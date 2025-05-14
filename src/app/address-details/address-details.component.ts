import { Component, Input, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { OrderSummaryComponent } from "../order-summary/order-summary.component"
import { OrderConfirmationComponent } from "../order-confirmation/order-confirmation.component"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { CartService } from "../services/cart.service" // Added import for CartService

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

  constructor(
    private http: HttpClient,
    private cartService: CartService, // Added CartService
  ) {
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
          console.log("Mapped addresses:", this.addresses)
          console.log(
            "Address IDs after mapping:",
            this.addresses.map((addr) => addr.id),
          )

          // YE CODE ADD KARO - Auto-correction for selected address
          if (this.addresses.length > 0) {
            // Check if selected address exists in the list
            const addressExists = this.addresses.some((addr) => addr.id === this.selectedAddressId)
            if (!addressExists) {
              // If not, select the first address
              this.selectedAddressId = this.addresses[0].id
              console.log("Auto-corrected selected address to:", this.selectedAddressId)
            }
          }
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
    console.log("Selecting address ID:", addressId)
    console.log(
      "Available address IDs:",
      this.addresses.map((addr) => addr.id),
    )
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

  // API Integration: Save address changes (Workaround using delete-and-recreate)
  saveAddress(): void {
    if (!this.editingAddressId) return

    const address = this.addresses.find((a) => a.id === this.editingAddressId)
    if (!address) return

    // Show loading indicator
    this.isLoading = true
    this.errorMessage = ""

    const token = localStorage.getItem("bookstore_token")
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    // JWT token se userId extract karein
    const tokenData = this.decodeJwtToken(token)
    const userId = tokenData ? Number.parseInt(tokenData.nameid) : 0

    // Prepare data for API
    const addressData = {
      userId: userId,
      fullName: this.customerName,
      addressLine1: address.addressLine,
      city: address.city,
      state: address.state,
      addressType: address.type,
    }

    console.log("Address data for recreation:", addressData)

    // WORKAROUND: Since PUT is not working, we'll delete and recreate
    // Step 1: Delete the existing address
    this.http.delete(`${this.apiUrl}/${address.id}`, { headers }).subscribe({
      next: () => {
        console.log("Address deleted successfully, now creating new one")

        // Step 2: Create a new address with updated data
        this.http.post(this.apiUrl, addressData, { headers }).subscribe({
          next: (response: any) => {
            console.log("Address re-created successfully:", response)
            this.isLoading = false
            this.isEditing = false
            this.editingAddressId = null
            this.errorMessage = ""

            // Refresh addresses list
            this.loadAddresses()
          },
          error: (error) => {
            console.error("Error creating address:", error)
            this.isLoading = false
            this.errorMessage = "Update failed: " + (error.error || error.message || error.statusText)
            this.isEditing = false
            this.editingAddressId = null
          },
        })
      },
      error: (error) => {
        console.error("Error deleting address:", error)
        this.isLoading = false
        this.errorMessage = "Update failed: Could not delete existing address"
        this.isEditing = false
        this.editingAddressId = null
      },
    })
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
    console.log("Selected Address ID:", this.selectedAddressId)

    if (this.selectedAddressId) {
      const token = localStorage.getItem("bookstore_token")
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      })

      // IMPORTANT: Create the order BEFORE purchasing the cart
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

            // Now purchase the cart
            // Fetch cart from API before purchasing
            this.cartService.fetchCartFromApi().subscribe({
              next: (cartResponse) => {
                console.log("Cart fetched successfully before purchase:", cartResponse)
                this.cartService.purchaseCart().subscribe({
                  next: (purchaseResponse) => {
                    console.log("Cart purchased successfully:", purchaseResponse)
                    // Show order confirmation
                    this.showOrderConfirmation = true
                    this.errorMessage = ""
                  },
                  error: (error) => {
                    console.error("Error purchasing cart:", error)
                    // Still show order confirmation even if cart purchase fails
                    // since the order was created successfully, but don't show any error message
                    this.showOrderConfirmation = true
                    // No error message shown to user
                  },
                })
              },
              error: (error) => {
                console.error("Error fetching cart before purchase:", error)
                this.errorMessage = "Failed to fetch cart before purchase. Please try again."
              },
            })
          },
          error: (error) => {
            console.error("Error creating order:", error)
            this.errorMessage = error.error?.error || "Failed to create order. Please try again."
          },
        })
    } else {
      this.errorMessage = "Please select a shipping address"
    }
  }

  // Add this method for testing order confirmation
  testOrderConfirmation(): void {
    console.log("Testing order confirmation visibility")
    this.showOrderConfirmation = true
  }

  // Helper method to verify if an address exists in the backend
  private async verifyAddressExists(addressId: number, token: string | null): Promise<boolean> {
    if (!token) return false

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    try {
      // Try to fetch the specific address
      const response = await this.http.get(`${this.apiUrl}/${addressId}`, { headers }).toPromise()
      return !!response // If we get a response, the address exists
    } catch (error) {
      console.error("Error verifying address:", error)
      return false // If there's an error, assume the address doesn't exist
    }
  }

  // Add this method to reset address selection to the first available address
  resetAddressSelection(): void {
    if (this.addresses.length > 0) {
      this.selectedAddressId = this.addresses[0].id
      console.log("Reset address selection to:", this.selectedAddressId)

      // Clear from localStorage if you're storing it there
      localStorage.removeItem("selected_address_id")
    }
  }
}