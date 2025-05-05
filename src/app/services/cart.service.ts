import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

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

  cartItems$ = this.cartItemsSubject.asObservable()

  constructor() {
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
      if (quantity <= 0) {
        this.removeFromCart(itemId)
      } else {
        item.quantity = quantity
        this.updateCart()
      }
    }
  }

  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId)
    this.updateCart()
  }

  clearCart(): void {
    this.cartItems = []
    this.updateCart()
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
}
