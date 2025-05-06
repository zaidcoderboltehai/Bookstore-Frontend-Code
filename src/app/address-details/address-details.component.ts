import { Component, Input, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { OrderSummaryComponent } from "../order-summary/order-summary.component"
import { OrderConfirmationComponent } from "../order-confirmation/order-confirmation.component"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from "../../environments/environment"

@Component({
  selector: "app-address-details",
  standalone: true,
  imports: [CommonModule, FormsModule, OrderSummaryComponent, OrderConfirmationComponent],
  templateUrl: "./address-details.component.html",
  styleUrls: ["./address-details.component.scss"],
})
export class AddressDetailsComponent implements OnInit {
  @Input() isVisible = false

  customerName = "Poonam Yadav"
  addresses: any[] = []
  selectedAddressId: number | null = 1
  isEditing = false
  editingAddressId: number | null = null
  showOrderSummary = false
  showOrderConfirmation = false
  isLoading = false
  errorMessage = ""

  private apiUrl = environment.apiUrl + "/api/CustomerAddress"

  constructor(private http: HttpClient) {
    // Mock data for demonstration (will be replaced by API data if available)
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

  ngOnInit(): void {
    // Load addresses from API when component initializes
    this.loadAddresses()
  }

  // API Integration: Load addresses from backend
  loadAddresses(): void {
    this.isLoading = true

    // Get token from localStorage for authorization
    const token = localStorage.getItem("bookstore_token")

    // Create headers with authorization token
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    // Call the API to get addresses
    this.http.get<any[]>(this.apiUrl, { headers }).subscribe({
      next: (response) => {
        console.log("Addresses loaded successfully:", response)

        // If we got addresses from API, use them
        if (response && response.length > 0) {
          this.addresses = response.map((addr) => ({
            id: addr.id,
            type: addr.addressType || (addr.id === 1 ? "WORK" : "HOME"),
            addressLine: addr.addressLine1,
            city: addr.city,
            state: addr.state,
          }))
        }
        // If no addresses found, we'll keep the mock data initialized in constructor

        // Set first address as selected if none is selected
        if (this.addresses.length > 0 && !this.selectedAddressId) {
          this.selectedAddressId = this.addresses[0].id
        }

        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading addresses:", error)
        // We'll keep using the mock data initialized in constructor
        this.isLoading = false
      },
    })
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

  // API Integration: Save address changes
  saveAddress(): void {
    if (!this.editingAddressId) return

    const address = this.addresses.find((a) => a.id === this.editingAddressId)
    if (!address) return

    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    // JWT token se userId extract karein
    const tokenData = this.decodeJwtToken(token)
    const userId = tokenData ? Number.parseInt(tokenData.nameid) : 0

    // Prepare data for API with correct userId
    const addressData = {
      id: address.id,
      userId: userId, // <-- CORRECT USER ID
      fullName: this.customerName,
      addressLine1: address.addressLine,
      city: address.city,
      state: address.state,
      addressType: address.type,
    }

    // Check if this is a new address or existing one
    if (address.id > 100000) {
      // Assuming new addresses have temporary high IDs
      // Create new address
      this.http.post(this.apiUrl, addressData, { headers }).subscribe({
        next: (response: any) => {
          console.log("Address created successfully:", response)
          // Update address ID with the one from server
          address.id = response.id
          this.isEditing = false
          this.editingAddressId = null
        },
        error: (error) => {
          console.error("Error creating address:", error)
          // Still exit edit mode even if there's an error
          this.isEditing = false
          this.editingAddressId = null
        },
      })
    } else {
      // Update existing address
      this.http.put(`${this.apiUrl}/${address.id}`, addressData, { headers }).subscribe({
        next: () => {
          console.log("Address updated successfully")
          this.isEditing = false
          this.editingAddressId = null
        },
        error: (error) => {
          console.error("Error updating address:", error)
          this.isEditing = false
          this.editingAddressId = null
        },
      })
    }
  }

  // Add this helper method to decode JWT token
  private decodeJwtToken(token: string | null): any {
    if (!token) return null
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error("Error decoding token:", e)
      return null
    }
  }

  // API Integration: Delete address
  deleteAddress(addressId: number): void {
    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    })

    this.http.delete(`${this.apiUrl}/${addressId}`, { headers }).subscribe({
      next: () => {
        console.log("Address deleted successfully")
        // Remove from local array
        this.addresses = this.addresses.filter((a) => a.id !== addressId)

        // If deleted address was selected, select another one
        if (this.selectedAddressId === addressId) {
          this.selectedAddressId = this.addresses.length > 0 ? this.addresses[0].id : null
        }
      },
      error: (error) => {
        console.error("Error deleting address:", error)
      },
    })
  }

  continueToPayment(): void {
    if (this.selectedAddressId) {
      console.log("Continuing to payment with address ID:", this.selectedAddressId)

      // If in edit mode, save changes first
      if (this.isEditing && this.editingAddressId) {
        this.saveAddress()
      }

      // Toggle order summary visibility
      this.showOrderSummary = true
    } else {
      alert("Please select an address to continue")
    }
  }

  handleCheckout(): void {
    console.log("Proceeding to checkout")

    // Create order with selected address
    if (this.selectedAddressId) {
      const token = localStorage.getItem("bookstore_token")
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      })

      this.http
        .post(
          `${environment.apiUrl}/api/Order`,
          {
            addressId: this.selectedAddressId,
          },
          { headers },
        )
        .subscribe({
          next: (response: any) => {
            console.log("Order created successfully:", response)
            // Show order confirmation
            this.showOrderConfirmation = true
          },
          error: (error) => {
            console.error("Error creating order:", error)
            // Still show confirmation for demo purposes
            this.showOrderConfirmation = true
          },
        })
    } else {
      // Show order confirmation
      this.showOrderConfirmation = true
    }
  }
}