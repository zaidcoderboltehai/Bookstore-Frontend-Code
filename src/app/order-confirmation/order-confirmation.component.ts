import { Component, Input, type OnChanges, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"

@Component({
  selector: "app-order-confirmation",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./order-confirmation.component.html",
  styleUrls: ["./order-confirmation.component.scss"],
})
export class OrderConfirmationComponent implements OnChanges {
  @Input() isVisible = false

  // Order details
  orderId = "#123456"
  email = "admin@bookstore.com"
  phone = "+91 8163475881"
  address =
    "42, 14th Main, 15th Cross, Sector 4, opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore 560034"

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes["isVisible"]) {
      console.log("Order confirmation visibility changed:", this.isVisible)
    }
  }

  continueToShopping(): void {
    // Navigate to dashboard
    this.router.navigate(["/dashboard"])
  }
}
