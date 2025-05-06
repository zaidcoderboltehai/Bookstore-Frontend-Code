import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { CartService, CartItem } from "../services/cart.service"
import { AddressDetailsComponent } from "../address-details/address-details.component"

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, AddressDetailsComponent],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = []
  // showAddressDetails = false; // Remove this line
  searchQuery = ""
  isLoading = false
  errorMessage = ""

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCartItems()

    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items
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
    this.cartItems = this.cartService.getCartItems()
  }

  fetchCartFromApi(): void {
    this.isLoading = true
    this.cartService.fetchCartFromApi().subscribe({
      next: () => {
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error fetching cart from API:", error)
        this.errorMessage = "Could not fetch cart from server. Using local cart data."
        this.isLoading = false
        // We'll continue using local cart data in case of error
      },
    })
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateItemQuantity(item.id, item.quantity - 1)
    }
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item.id, item.quantity + 1)
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId)
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  placeOrder(): void {
    console.log("Placing order for items:", this.cartItems)

    // Try to use the API to purchase cart
    this.isLoading = true
    this.cartService.purchaseCart().subscribe({
      next: (response) => {
        console.log("Order placed successfully:", response)
        this.isLoading = false
        // No need to toggle address details visibility since it's always visible
        // this.showAddressDetails = true;
      },
      error: (error) => {
        console.error("Error placing order:", error)
        this.errorMessage = "Could not place order with server. Continuing with local flow."
        this.isLoading = false
        // Continue with local flow in case of error
      },
    })
  }
}