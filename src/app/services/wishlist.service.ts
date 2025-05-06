import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable, of } from "rxjs"
import { environment } from "../../environments/environment"
import { catchError, tap } from "rxjs/operators"

export interface WishlistItem {
  id: number
  bookId: number
  bookName: string
  author: string
  price: number
  addedAt: Date
}

@Injectable({
  providedIn: "root",
})
export class WishlistService {
  private apiUrl = environment.apiUrl
  private wishlistItemsSubject = new BehaviorSubject<WishlistItem[]>([])
  private wishlistItems: WishlistItem[] = []

  // Observable for components to subscribe to
  wishlistItems$ = this.wishlistItemsSubject.asObservable()

  constructor(private http: HttpClient) {
    // Local storage se wishlist load karna (fallback ke liye)
    this.loadWishlistFromStorage()
    
    // API se wishlist fetch karna
    this.fetchWishlistFromApi().subscribe()
  }

  // Get wishlist items
  getWishlistItems(): WishlistItem[] {
    return this.wishlistItems
  }

  // Check if book is in wishlist
  isInWishlist(bookId: number): boolean {
    return this.wishlistItems.some(item => item.bookId === bookId)
  }

  // Add to wishlist
  addToWishlist(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/Wishlist/${bookId}`, {})
      .pipe(
        tap((response: any) => {
          // API response se wishlist item create karna
          const newItem: WishlistItem = {
            id: response.wishlistId,
            bookId: response.bookId,
            bookName: response.bookName,
            author: response.author,
            price: response.price,
            addedAt: new Date(response.addedAt)
          }
          
          // Local wishlist update karna
          this.wishlistItems.push(newItem)
          this.updateWishlist()
        }),
        catchError(error => {
          console.error("Error adding to wishlist:", error)
          return of(null)
        })
      )
  }

  // Remove from wishlist
  removeFromWishlist(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/Wishlist/${bookId}`)
      .pipe(
        tap(() => {
          // Local wishlist se remove karna
          this.wishlistItems = this.wishlistItems.filter(item => item.bookId !== bookId)
          this.updateWishlist()
        }),
        catchError(error => {
          console.error("Error removing from wishlist:", error)
          return of(null)
        })
      )
  }

  // Fetch wishlist from API
  fetchWishlistFromApi(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/Wishlist`)
      .pipe(
        tap((response: any) => {
          if (Array.isArray(response)) {
            this.wishlistItems = response.map(item => ({
              id: item.wishlistId,
              bookId: item.bookId,
              bookName: item.bookName,
              author: item.author,
              price: item.price,
              addedAt: new Date(item.addedAt)
            }))
            this.updateWishlist()
          }
        }),
        catchError(error => {
          console.error("Error fetching wishlist:", error)
          return of([])
        })
      )
  }

  // Toggle wishlist (add/remove)
  toggleWishlist(bookId: number): Observable<any> {
    return this.isInWishlist(bookId) 
      ? this.removeFromWishlist(bookId)
      : this.addToWishlist(bookId)
  }

  private updateWishlist(): void {
    this.wishlistItemsSubject.next([...this.wishlistItems])
    this.saveWishlistToStorage()
  }

  private saveWishlistToStorage(): void {
    localStorage.setItem("wishlist_items", JSON.stringify(this.wishlistItems))
  }

  private loadWishlistFromStorage(): void {
    const storedWishlist = localStorage.getItem("wishlist_items")
    if (storedWishlist) {
      try {
        this.wishlistItems = JSON.parse(storedWishlist)
        this.wishlistItemsSubject.next([...this.wishlistItems])
      } catch (e) {
        console.error("Failed to parse wishlist data from storage")
      }
    }
  }
}