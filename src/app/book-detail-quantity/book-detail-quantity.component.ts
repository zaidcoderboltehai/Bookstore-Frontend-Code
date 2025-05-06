import { Component, Input, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { CartService, type CartItem } from "../services/cart.service"
import { WishlistService } from "../services/wishlist.service" // New import

@Component({
  selector: "app-book-detail-quantity",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="book-actions">
      <div *ngIf="!showQuantity" class="add-to-bag-container">
        <button class="add-to-bag-btn" (click)="addToBag()">ADD TO BAG</button>
      </div>
      <div *ngIf="showQuantity" class="quantity-container">
        <button class="quantity-btn" (click)="decreaseQuantity()">-</button>
        <span class="quantity-value">{{ quantity }}</span>
        <button class="quantity-btn" (click)="increaseQuantity()">+</button>
      </div>
      
      <button class="wishlist-btn" [class.active]="isInWishlist" (click)="addToWishlist()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        WISHLIST
      </button>
    </div>
  `,
  styles: [
    `
    .book-actions {
      display: flex;
      gap: 15px;
      margin-bottom: 40px;
    }
    
    .add-to-bag-container, .quantity-container {
      flex: 1;
    }
    
    .add-to-bag-btn {
      background-color: #b02a37;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }
    
    .add-to-bag-btn:hover {
      background-color: #9a2530;
    }
    
    .quantity-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background-color: #b02a37;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-weight: bold;
    }
    
    .quantity-btn {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .quantity-value {
      font-size: 16px;
      min-width: 20px;
      text-align: center;
    }
    
    .wishlist-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .wishlist-btn svg {
      margin-right: 8px;
    }
    
    .wishlist-btn:hover {
      background-color: #222;
    }
    
    .wishlist-btn.active {
      background-color: #b02a37;
    }
    
    .wishlist-btn.active svg {
      fill: white;
    }
  `,
  ],
})
export class BookDetailQuantityComponent implements OnInit {
  @Input() bookId = 0
  @Input() bookTitle = ""
  @Input() bookPrice = 0
  @Input() bookImage = ""

  quantity = 1
  showQuantity = false
  isInWishlist = false // New property
  isLoading = false // New property

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService // New service
  ) {}

  ngOnInit(): void {
    // Check if book is already in cart
    const cartItems = this.cartService.getCartItems()
    const existingItem = cartItems.find((item: CartItem) => item.id === this.bookId)

    if (existingItem) {
      this.quantity = existingItem.quantity
      this.showQuantity = true
    }

    // Check if book is in wishlist - New code
    this.isInWishlist = this.wishlistService.isInWishlist(this.bookId)
    
    // Subscribe to wishlist changes - New code
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.isInWishlist = items.some(item => item.bookId === this.bookId)
    })

    // Update cart badge on init
    this.updateCartBadge(this.cartService.getCartItemCount())
  }

  addToBag(): void {
    this.showQuantity = true

    // Add to cart service
    this.cartService.addToCart({
      id: this.bookId,
      title: this.bookTitle,
      price: this.bookPrice,
      quantity: this.quantity,
      imageUrl: this.bookImage,
    })

    this.updateCartBadge(this.cartService.getCartItemCount())
  }

  increaseQuantity(): void {
    this.quantity++

    // Update cart service
    this.cartService.updateItemQuantity(this.bookId, this.quantity)
    this.updateCartBadge(this.cartService.getCartItemCount())
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--

      // Update cart service
      this.cartService.updateItemQuantity(this.bookId, this.quantity)
    } else {
      this.showQuantity = false
      this.quantity = 1

      // Remove from cart
      this.cartService.removeFromCart(this.bookId)
    }

    this.updateCartBadge(this.cartService.getCartItemCount())
  }

  addToWishlist(): void {
    // Updated wishlist functionality
    if (this.isLoading) return
    
    this.isLoading = true
    this.wishlistService.toggleWishlist(this.bookId).subscribe({
      next: () => {
        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
      }
    })
  }

  private updateCartBadge(count: number): void {
    // DOM se cart badge ko update karna
    const cartBadge = document.querySelector(".cart-badge")
    if (cartBadge) {
      if (count > 0) {
        cartBadge.textContent = count.toString()
        cartBadge.classList.add("visible")
      } else {
        cartBadge.textContent = ""
        cartBadge.classList.remove("visible")
      }
    } else {
      // Agar badge nahi hai to create karna
      this.createCartBadge(count)
    }
  }

  private createCartBadge(count: number): void {
    if (count <= 0) return

    // Cart icon ke parent element ko find karna
    const cartIcon = document.querySelector('a[routerlink="/cart"]')
    if (cartIcon) {
      const badge = document.createElement("span")
      badge.className = "cart-badge visible"
      badge.textContent = count.toString()
      cartIcon.appendChild(badge)

      // Badge ke liye CSS add karna
      const style = document.createElement("style")
      style.textContent = `
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #b02a37;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
        }
        
        .cart-badge.visible {
          opacity: 1;
          visibility: visible;
        }
        
        a[routerlink="/cart"] {
          position: relative;
        }
      `
      document.head.appendChild(style)
    }
  }
}