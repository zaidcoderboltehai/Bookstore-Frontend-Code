import { Component, EventEmitter, Input, Output, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { CartService } from "../services/cart.service"

interface CartItem {
  id: number
  title: string
  author: string
  price: number
  quantity: number
  imageUrl: string
}

@Component({
  selector: "app-order-summary",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./order-summary.component.html",
  styleUrls: ["./order-summary.component.scss"],
})
export class OrderSummaryComponent implements OnInit {
  @Input() isVisible = false
  @Input() orderDetails: any = {
    title: "Don't Make Me Think",
    author: "Steve Krug",
    price: 1500,
    originalPrice: 2000,
    imageUrl: "assets/images/Image 11@2x.png",
  }
  @Input() cartItems: CartItem[] = []

  @Output() checkout = new EventEmitter<void>()
  @Output() toggleSummary = new EventEmitter<void>()

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Load cart items
    this.loadCartItems()

    // If cart has items, use the first item as the featured item
    if (this.cartItems && this.cartItems.length > 0) {
      const firstItem = this.cartItems[0]
      this.orderDetails = {
        title: firstItem.title,
        author: firstItem.author,
        price: firstItem.price,
        originalPrice: firstItem.price * 1.2, // Assuming 20% markup
        imageUrl: firstItem.imageUrl || "assets/images/Image 11@2x.png",
      }
    }
  }

  // Add this method to load cart items
  loadCartItems(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items as CartItem[]

      // Update order details if we have items
      if (this.cartItems && this.cartItems.length > 0) {
        const firstItem = this.cartItems[0]
        this.orderDetails = {
          title: firstItem.title,
          author: firstItem.author,
          price: firstItem.price,
          originalPrice: this.orderDetails.originalPrice, // Keep original price
          imageUrl: firstItem.imageUrl || "assets/images/Image 11@2x.png",
        }
      }
    })

    // Fetch cart from API
    this.cartService.fetchCartFromApi().subscribe()
  }

  // Add this method to calculate total price
  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  onCheckout(): void {
    console.log("Proceeding to checkout with items:", this.cartItems)
    console.log("Total amount:", this.getTotal() + 40)
    this.checkout.emit()
  }

  toggleSummaryVisibility(): void {
    this.toggleSummary.emit()
  }
}
