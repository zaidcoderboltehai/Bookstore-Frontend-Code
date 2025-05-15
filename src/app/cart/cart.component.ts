import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { CartService, CartItem } from "../services/cart.service"
import { AddressDetailsComponent } from "../address-details/address-details.component"

// Define a local interface that extends CartItem
interface ExtendedCartItem extends CartItem {
  inStock?: boolean
}

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, AddressDetailsComponent],
})
export class CartComponent implements OnInit {
  cartItems: ExtendedCartItem[] = []
  searchQuery = ""
  isLoading = false
  errorMessage = ""
  successMessage = ""
  showAddressDetails = false

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCartItems()

    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items as ExtendedCartItem[]
    })

    // Setup search functionality
    this.setupSearchListener()

    // Try to fetch cart from API
    this.fetchCartFromApi()
  }

  // Add search functionality
  setupSearchListener(): void {
    setTimeout(() => {
      const searchInput = document.querySelector(".search-input") as HTMLInputElement
      if (searchInput) {
        searchInput.addEventListener("keyup", (event) => {
          if (event.key === "Enter") {
            this.performSearch()
          }
        })

        // Add click event listener to search icon
        const searchIcon = document.querySelector(".search-icon")
        if (searchIcon) {
          searchIcon.addEventListener("click", () => {
            this.performSearch()
          })
        }
      }
    }, 500)
  }

  performSearch(): void {
    const searchInput = document.querySelector(".search-input") as HTMLInputElement
    if (searchInput && searchInput.value.trim()) {
      console.log("Searching for:", searchInput.value)

      // Call the search API and navigate with results
      this.router.navigate(["/dashboard"], {
        queryParams: { search: searchInput.value.trim() },
      })
    }
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems().map((item) => {
      const extendedItem = item as ExtendedCartItem

      // Ensure author is properly set with fallbacks
      if (!extendedItem.author || extendedItem.author === "Unknown Author") {
        extendedItem.author = this.getAuthorByTitle(extendedItem.title)
      }

      // Ensure inStock is properly set
      extendedItem.inStock = extendedItem.quantity === undefined ? true : extendedItem.quantity > 0

      return extendedItem
    })
  }

  // Helper method to get author by title
  getAuthorByTitle(title: string): string {
    // Map common titles to authors
    if (title.includes("Think")) return "Steve Krug"
    if (title.includes("UX")) return "Steve Krug"
    if (title.includes("C#")) return "John Sharp"
    if (title.includes("Python")) return "Mark Lutz"
    if (title.includes("AI")) return "Stuart Russell"
    if (title.includes("Wind")) return "Patrick Rothfuss"
    // Default author for unknown titles
    return "Steve Krug"
  }

  fetchCartFromApi(): void {
    this.isLoading = true
    this.errorMessage = ""

    this.cartService.fetchCartFromApi().subscribe({
      next: () => {
        // After fetching, ensure all items have proper author and stock status
        this.cartItems = this.cartService.getCartItems().map((item) => {
          const extendedItem = item as ExtendedCartItem

          // Ensure author is properly set with fallbacks
          if (!extendedItem.author || extendedItem.author === "Unknown Author") {
            extendedItem.author = this.getAuthorByTitle(extendedItem.title)
          }

          // Ensure inStock is properly set
          extendedItem.inStock = extendedItem.quantity === undefined ? true : extendedItem.quantity > 0

          return extendedItem
        })

        this.isLoading = false
      },
      error: (error) => {
        console.error("Error fetching cart from API:", error)
        this.errorMessage = "Could not fetch cart from server. Using local cart data."
        this.isLoading = false
        // We'll continue using local cart data in case of error
        this.loadCartItems() // Use the updated method
      },
    })
  }

  // Add image error handler method
  handleImageError(event: any): void {
    event.target.src = "assets/images/Image 11@2x.png" // Fallback image
  }

  decreaseQuantity(item: ExtendedCartItem): void {
    if (item.quantity > 1) {
      // Validate quantity before calling the service
      if (item.quantity - 1 < 1) {
        this.errorMessage = "Quantity must be at least 1"
        return
      }

      this.isLoading = true
      this.errorMessage = ""

      this.cartService.updateItemQuantity(item.id, item.quantity - 1).subscribe({
        next: () => {
          this.isLoading = false
          this.errorMessage = ""
        },
        error: (error) => {
          console.error("Error decreasing quantity:", error)
          this.errorMessage = error.message || "Failed to update quantity"
          this.isLoading = false
          // Reset to previous quantity in UI
          this.cartService.fetchCartFromApi().subscribe()
        },
      })
    }
  }

  increaseQuantity(item: ExtendedCartItem): void {
    this.isLoading = true
    this.errorMessage = ""

    this.cartService.updateItemQuantity(item.id, item.quantity + 1).subscribe({
      next: () => {
        this.isLoading = false
        this.errorMessage = ""
      },
      error: (error) => {
        console.error("Error increasing quantity:", error)
        this.errorMessage = error.message || "Failed to update quantity"
        this.isLoading = false
        // Reset to previous quantity in UI
        this.cartService.fetchCartFromApi().subscribe()
      },
    })
  }

  removeItem(itemId: number): void {
    this.isLoading = true
    this.errorMessage = ""

    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error removing item:", error)
        this.errorMessage = "Failed to remove item. Please try again."
        this.isLoading = false
      },
    })
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  placeOrder(): void {
    this.toggleAddressDetails()
    if (this.cartItems.length === 0) {
      this.errorMessage = "Your cart is empty. Please add items before placing an order."
      return
    }

    console.log("Placing order for items:", this.cartItems)

    // Instead of purchasing the cart here, we'll just show the address details
    // The actual purchase will happen in the address-details component
    // after the order is created
  }

  toggleAddressDetails(): void {
    this.showAddressDetails = !this.showAddressDetails
  }
}