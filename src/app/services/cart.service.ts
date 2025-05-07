import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { BehaviorSubject, type Observable } from "rxjs"
import { environment } from "../../environments/environment"
import { tap, catchError } from "rxjs/operators"

export interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  imageUrl: string
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
    return this.cartItems
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  addToCart(item: CartItem): void {
    // First try to add to backend API
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    this.http
      .post(`${this.apiUrl}/api/Cart/${item.id}`, {}, { headers })
      .pipe(
        catchError((error) => {
          console.error("Error adding to cart API:", error)
          // Fallback to local storage if API fails
          this.addToLocalCart(item)
          return []
        }),
      )
      .subscribe(() => {
        // On success, add to local cart as well
        this.addToLocalCart(item)
      })
  }

  private addToLocalCart(item: CartItem): void {
    const existingItem = this.cartItems.find((i) => i.id === item.id)

    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      this.cartItems.push(item)
    }

    this.updateCart()
  }

  updateItemQuantity(itemId: number, quantity: number): void {
    const item = this.cartItems.find((i) => i.id === itemId)

    if (item) {
      const token = localStorage.getItem("bookstore_token")
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      })

      // Try to update in backend first
      this.http
        .put(`${this.apiUrl}/api/Cart/${itemId}`, quantity, { headers })
        .pipe(
          catchError((error) => {
            console.error("Error updating cart quantity:", error)
            // Fallback to local update if API fails
            this.updateLocalItemQuantity(itemId, quantity)
            return []
          }),
        )
        .subscribe(() => {
          // On success, update local cart as well
          this.updateLocalItemQuantity(itemId, quantity)
        })
    }
  }

  private updateLocalItemQuantity(itemId: number, quantity: number): void {
    const item = this.cartItems.find((i) => i.id === itemId)

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId)
      } else {
        item.quantity = quantity
        this.updateCart()
      }
    }
  }

  removeFromCart(itemId: number): void {
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    // Try to remove from backend first
    this.http
      .delete(`${this.apiUrl}/api/Cart/${itemId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error("Error removing from cart API:", error)
          // Fallback to local removal if API fails
          this.removeFromLocalCart(itemId)
          return []
        }),
      )
      .subscribe(() => {
        // On success, remove from local cart as well
        this.removeFromLocalCart(itemId)
      })
  }

  private removeFromLocalCart(itemId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId)
    this.updateCart()
  }

  clearCart(): void {
    this.cartItems = []
    this.updateCart()
  }

  purchaseCart(): Observable<any> {
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    return this.http.post(`${this.apiUrl}/api/Cart/purchase`, {}, { headers })
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

  // New method to fetch cart from API
  fetchCartFromApi(): Observable<any> {
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    return this.http.get(`${this.apiUrl}/api/Cart`, { headers }).pipe(
      tap((response: any) => {
        if (response && response.items) {
          // Map API response to our CartItem format
          this.cartItems = response.items.map((item: any) => ({
            id: item.bookId,
            title: item.bookName,
            price: item.pricePerUnit,
            quantity: item.quantity,
            imageUrl: item.book?.bookImage || "assets/images/default-book.png",
          }))
          this.updateCart()
        }
      }),
    )
  }
}