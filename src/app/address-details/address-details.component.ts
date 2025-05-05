import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { OrderSummaryComponent } from "../order-summary/order-summary.component"
import { OrderConfirmationComponent } from "../order-confirmation/order-confirmation.component"

@Component({
  selector: "app-address-details",
  standalone: true,
  imports: [CommonModule, FormsModule, OrderSummaryComponent, OrderConfirmationComponent],
  templateUrl: "./address-details.component.html",
  styleUrls: ["./address-details.component.scss"],
})
export class AddressDetailsComponent {
  @Input() isVisible = false

  customerName = "Poonam Yadav"
  addresses: any[] = []
  selectedAddressId: number | null = 1
  isEditing = false
  editingAddressId: number | null = null
  showOrderSummary = false
  showOrderConfirmation = false

  constructor() {
    // Mock data for demonstration
    this.addresses = [
      {
        id: 1,
        type: "WORK",
        addressLine:
          "BridgeLabz Solutions LLP No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore",
        city: "Bengaluru",
        state: "Karnataka",
      },
      {
        id: 2,
        type: "HOME",
        addressLine:
          "BridgeLabz Solutions LLP No. 42, 14th Main, 15th Cross, Sector 4, Opp to BDA complex, near Kumarakom restaurant, HSR Layout, Bangalore",
        city: "Bengaluru",
        state: "Karnataka",
      },
    ]
  }

  selectAddress(addressId: number): void {
    this.selectedAddressId = addressId
  }

  addNewAddress(): void {
    const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map((a) => a.id)) + 1 : 1
    const newAddress = {
      id: newId,
      type: "OTHER",
      addressLine: "",
      city: "",
      state: "",
    }

    this.addresses.push(newAddress)
    this.selectedAddressId = newId
    this.isEditing = true
    this.editingAddressId = newId
  }

  editAddress(addressId: number): void {
    this.isEditing = true
    this.editingAddressId = addressId
  }

  continueToPayment(): void {
    if (this.selectedAddressId) {
      console.log("Continuing to payment with address ID:", this.selectedAddressId)
      // Toggle order summary visibility
      this.showOrderSummary = true
    } else {
      alert("Please select an address to continue")
    }
  }

  handleCheckout(): void {
    console.log("Proceeding to checkout")
    // Show order confirmation
    this.showOrderConfirmation = true
  }
}