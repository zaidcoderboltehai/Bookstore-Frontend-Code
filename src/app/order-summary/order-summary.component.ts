import { Component, Input, Output, EventEmitter } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-order-summary",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./order-summary.component.html",
  styleUrls: ["./order-summary.component.scss"],
})
export class OrderSummaryComponent {
  @Input() isVisible = false
  @Input() orderDetails: any = {
    title: "Don't Make Me Think",
    author: "Steve Krug",
    price: 1500,
    originalPrice: 2000,
    imageUrl: "assets/images/Image 11@2x.png",
  }

  @Output() checkout = new EventEmitter<void>()

  onCheckout(): void {
    this.checkout.emit()
  }
}