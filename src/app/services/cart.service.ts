import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http"
import { BehaviorSubject, type Observable, catchError, tap, throwError, of } from "rxjs"
import { environment } from "../../environments/environment"

export interface CartItem {
  id: number
  bookId: number
  title: string
  author: string
  imageUrl: string
  price: number
  quantity: number
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems: CartItem[] = []
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([])
  private apiUrl = environment.apiUrl

  cartItems$ = this.cartItemsSubject.asObservable()

  constructor(private http: HttpClient) {
    // Local storage se cart data load karna
    this.loadCartFromStorage()
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  // Fetch cart from API
  fetchCartFromApi(): Observable<any> {
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    return this.http.get(`${this.apiUrl}/api/Cart`, { headers }).pipe(
      tap((response: any) => {
        console.log("Cart API response:", response)
        if (response && response.items && Array.isArray(response.items)) {
          // Map API response to CartItem format
          const items: CartItem[] = response.items.map((item: any) => ({
            id: item.id,
            bookId: item.bookId,
            title: item.bookName || "Unknown Title",
            author: item.author || "Unknown Author",
            imageUrl: item.bookImage || "assets/images/Image 11@2x.png",
            price: item.pricePerUnit || 0,
            quantity: item.quantity || 1,
          }))
          this.cartItemsSubject.next(items)
          this.cartItems = items
          this.saveCartToStorage()
        }
      }),
      catchError(this.handleError),
    )
  }

  // Modified to accept both bookId and CartItem object
  addToCart(bookIdOrItem: number | CartItem): Observable<any> {
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    // If bookIdOrItem is a number, it's a bookId
    if (typeof bookIdOrItem === "number") {
      return this.http.post<any>(`${this.apiUrl}/api/Cart/${bookIdOrItem}`, {}, { headers }).pipe(
        tap((response) => {
          console.log("Add to cart response:", response)
          // Refresh cart after adding item
          this.fetchCartFromApi().subscribe()
        }),
        catchError(this.handleError),
      )
    }
    // If bookIdOrItem is an object, it's a CartItem
    else {
      // First update local state for immediate UI feedback
      const item = bookIdOrItem
      const existingItem = this.cartItems.find((i) => i.id === item.id)

      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        this.cartItems.push(item)
      }

      this.cartItemsSubject.next([...this.cartItems])
      this.saveCartToStorage()

      // Then send API request
      return this.http.post<any>(`${this.apiUrl}/api/Cart/${item.bookId || item.id}`, {}, { headers }).pipe(
        tap((response) => {
          console.log("Add to cart response:", response)
          // Refresh cart after adding item
          this.fetchCartFromApi().subscribe()
        }),
        catchError((error) => {
          console.error("Error adding to cart:", error)
          return of(null)
        }),
      )
    }
  }

  // Update item quantity - FIXED to send proper payload and validate minimum quantity
  updateItemQuantity(itemId: number, quantity: number): Observable<any> {
    console.log(`Updating cart item ${itemId} to quantity ${quantity}`)

    // Validate quantity - must be at least 1
    if (quantity < 1) {
      console.error("Quantity must be at least 1")
      return throwError(() => new Error("Quantity must be at least 1"))
    }

    // First update local state for immediate UI feedback
    const currentItems = this.cartItemsSubject.value
    const updatedItems = currentItems.map((item) =>
      item.id === itemId || item.bookId === itemId ? { ...item, quantity } : item,
    )
    this.cartItemsSubject.next(updatedItems)
    this.cartItems = updatedItems
    this.saveCartToStorage()

    // Then send API request with proper payload format
    const payload = { quantity: quantity }
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    // Find the actual cart item ID (not bookId)
    const cartItem = currentItems.find((item) => item.bookId === itemId || item.id === itemId)
    const cartItemId = cartItem ? cartItem.id : itemId

    return this.http
      .put<any>(`${this.apiUrl}/api/Cart/${cartItemId}`, payload, { headers })
      .pipe(catchError(this.handleError))
  }

  removeFromCart(itemId: number): Observable<any> {
    // First update local state for immediate UI feedback
    const currentItems = this.cartItemsSubject.value

    // Find the actual cart item ID (not bookId)
    const cartItem = currentItems.find((item) => item.bookId === itemId || item.id === itemId)
    const cartItemId = cartItem ? cartItem.id : itemId

    const updatedItems = currentItems.filter((item) => item.id !== cartItemId && item.bookId !== itemId)
    this.cartItemsSubject.next(updatedItems)
    this.cartItems = updatedItems
    this.saveCartToStorage()

    // Then send API request
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    return this.http
      .delete<any>(`${this.apiUrl}/api/Cart/${cartItemId}`, { headers })
      .pipe(catchError(this.handleError))
  }

  clearCart(): void {
    this.cartItems = []
    this.cartItemsSubject.next([])
    this.saveCartToStorage()
  }

  // Purchase cart - FIXED to include empty object in request body
  purchaseCart(): Observable<any> {
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    // Important: Send an empty object as the request body
    return this.http.post<any>(`${this.apiUrl}/api/Cart/purchase`, {}, { headers }).pipe(
      tap((response) => {
        console.log("Purchase response:", response)
        // Clear cart after successful purchase
        this.cartItemsSubject.next([])
        this.cartItems = []
        this.saveCartToStorage()
      }),
      catchError(this.handleError),
    )
  }

  private updateCart(): void {
    this.cartItemsSubject.next([...this.cartItems])
    this.saveCartToStorage()
  }

  private saveCartToStorage(): void {
    localStorage.setItem("cart_items", JSON.stringify(this.cartItems))
  }

  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem("cart_items")
    if (storedCart) {
      try {
        this.cartItems = JSON.parse(storedCart)
        this.cartItemsSubject.next([...this.cartItems])
      } catch (e) {
        console.error("Failed to parse cart data from storage")
      }
    }
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred"

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`
    } else {
      // Server-side error
      if (error.error && typeof error.error === "object") {
        // Try to extract error message from response
        errorMessage = error.error.message || error.error.error || error.error.detailed || error.statusText
      } else {
        errorMessage = `Error Code: ${error.status}, Message: ${error.message}`
      }
    }

    console.error(errorMessage)
    return throwError(() => new Error(errorMessage))
  }
}
