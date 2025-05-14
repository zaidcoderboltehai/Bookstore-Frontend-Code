import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from "../../environments/environment"

interface Order {
  id: number
  bookId: number
  bookName: string
  author: string
  price: number
  imageUrl: string
  orderDate: string
  formattedDate: string
}

@Component({
  selector: "app-my-orders",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./my-orders.component.html",
  styleUrls: ["./my-orders.component.scss"],
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = []
  isLoading = false
  errorMessage = ""

  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders()

    // Setup search functionality
    this.setupSearchListener()
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
      // Navigate to dashboard with search query
      window.location.href = `/dashboard?search=${encodeURIComponent(searchInput.value.trim())}`
    }
  }

  loadOrders(): void {
    this.isLoading = true
    this.errorMessage = ""

    // Get token from localStorage for authorization
    const token = localStorage.getItem("bookstore_token")

    // Create headers with authorization token
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })

    let useMock = false

    // Call the API to get orders
    this.http.get<any[]>(`${this.apiUrl}/api/Order`, { headers }).subscribe({
      next: (response) => {
        console.log("Orders loaded successfully:", response)

        if (response && response.length > 0) {
          // Map API response to Order interface
          this.orders = response.map((order) => {
            // Format the date to display as "Month DD" (e.g., "May 21")
            const orderDate = new Date(order.orderDate)
            const month = orderDate.toLocaleString("default", { month: "long" })
            const day = orderDate.getDate()

            return {
              id: order.id,
              bookId: order.bookId,
              bookName: order.bookName || "Don't Make Me Think",
              author: order.author || "Steve Krug",
              price: order.price || 1500,
              imageUrl: order.bookImage || "assets/images/Image 11@2x.png",
              orderDate: order.orderDate,
              formattedDate: `${month} ${day}`,
            }
          })
        } else {
          // If no orders found, use mock data for demonstration
          useMock = true
        }

        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading orders:", error)
        this.errorMessage = "Failed to load orders. Using sample data for demonstration."

        // Use mock data if API fails
        useMock = true

        this.isLoading = false
      },
      complete: () => {
        if (useMock) {
          this.useMockData()
        }
      },
    })
  }

  // Use mock data for demonstration
  useMockData(): void {
    this.orders = [
      {
        id: 1,
        bookId: 1,
        bookName: "Don't Make Me Think",
        author: "Steve Krug",
        price: 1500,
        imageUrl: "assets/images/Image 11@2x.png",
        orderDate: "2023-05-21T10:30:00",
        formattedDate: "May 21",
      },
      {
        id: 2,
        bookId: 2,
        bookName: "React Material-UI",
        author: "Cookbook",
        price: 780,
        imageUrl: "assets/images/Image 10@2x.png",
        orderDate: "2023-04-06T14:45:00",
        formattedDate: "April 06",
      },
    ]
  }

  // Add image error handler method
  handleImageError(event: any): void {
    event.target.src = "assets/images/Image 11@2x.png" // Fallback image
  }
}
