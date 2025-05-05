import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-cart-quantity",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quantity-container" *ngIf="showQuantity">
      <button class="quantity-btn" (click)="decreaseQuantity()">-</button>
      <span class="quantity-value">{{ quantity }}</span>
      <button class="quantity-btn" (click)="increaseQuantity()">+</button>
    </div>
    <button *ngIf="!showQuantity" class="add-to-bag-btn" (click)="addToBag()">ADD TO BAG</button>
  `,
  styles: [
    `
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
      width: 100%;
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
  `,
  ],
})
export class CartQuantityComponent implements OnInit {
  quantity = 1
  showQuantity = false

  // Cart service ko inject karna hoga real implementation mein
  // private cartService: CartService

  constructor() {}

  ngOnInit(): void {
    // Check if item is already in cart
    // this.checkIfItemInCart();
  }

  addToBag(): void {
    this.showQuantity = true
    this.updateCartBadge()
  }

  increaseQuantity(): void {
    this.quantity++
    this.updateCartBadge()
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--
      this.updateCartBadge()
    } else {
      this.showQuantity = false
      this.quantity = 1
      this.updateCartBadge(0)
    }
  }

  private updateCartBadge(count: number = this.quantity): void {
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
