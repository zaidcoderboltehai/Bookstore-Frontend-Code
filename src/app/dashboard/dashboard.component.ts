import { Component, HostListener, type OnInit, Injector } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule, ActivatedRoute } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { MatDialog, MatDialogRef } from "@angular/material/dialog"
import { LoginComponent } from "../auth/login/login.component"
import { BookService } from "src/app/services/book.service"

interface Book {
  id: number
  title: string
  author: string
  imageUrl: string
  rating: number
  reviewCount: number
  currentPrice: number
  originalPrice: number
  inStock: boolean
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class DashboardComponent implements OnInit {
  books: Book[] = [
    {
      id: 1,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 11@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      inStock: true,
    },
    {
      id: 2,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 10@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      inStock: true,
    },
    {
      id: 3,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 7@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      inStock: true,
    },
    {
      id: 4,
      title: "UX For DUMMIES",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 8@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      inStock: false,
    },
    {
      id: 5,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 12@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      inStock: true,
    },
    {
      id: 6,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 13@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      inStock: true,
    },
    {
      id: 7,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 14@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      inStock: true,
    },
    {
      id: 8,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 18@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      inStock: true,
    },
  ]

  // Original books array for filtering
  allBooks: Book[] = []

  totalItems = 128
  selectedSort = "relevance"
  showSortDropdown = false
  currentPage = 1
  showProfileDropdown = false
  isLoggedIn = false
  private authDialogRef?: MatDialogRef<LoginComponent>
  searchQuery = ""
  private injector: Injector

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    injector: Injector,
  ) {
    this.injector = injector
  }

  ngOnInit(): void {
    this.checkAuthStatus()
    this.setupAuthSubscription()

    // Store original books for filtering
    this.allBooks = [...this.books]

    // Check for search query in URL
    this.route.queryParams.subscribe((params) => {
      if (params["search"]) {
        this.searchQuery = params["search"]
        this.performSearch(this.searchQuery)

        // Update search input field with query
        setTimeout(() => {
          const searchInput = document.querySelector(".search-input") as HTMLInputElement
          if (searchInput) {
            searchInput.value = this.searchQuery
          }
        }, 100)
      }
    })

    // Setup search functionality
    this.setupSearchListener()

    // Load books initially
    this.loadBooks()
  }

  // Add image error handler method
  handleImageError(event: any): void {
    event.target.src = "assets/images/Image 11@2x.png" // Fallback image
  }

  // Add search functionality
  setupSearchListener(): void {
    setTimeout(() => {
      const searchInput = document.querySelector(".search-input") as HTMLInputElement
      if (searchInput) {
        searchInput.addEventListener("keyup", (event) => {
          if (event.key === "Enter") {
            this.performSearch(searchInput.value)
          }
        })

        // Add click event listener to search icon
        const searchIcon = document.querySelector(".search-icon")
        if (searchIcon) {
          searchIcon.addEventListener("click", () => {
            this.performSearch(searchInput.value)
          })
        }
      }
    }, 500)
  }

  performSearch(query: string): void {
    if (query.trim()) {
      this.searchQuery = query.trim()

      // Call the search API
      const bookService = this.injector.get(BookService)
      bookService.searchBooks(this.searchQuery).subscribe({
        next: (results) => {
          console.log("Search results:", results)
          // Filter books based on search results
          if (results && results.books) {
            this.books = results.books.map((book: any) => ({
              ...book,
              imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
              title: book.bookName || book.title || "Unknown Title",
              author: book.author || "Unknown Author",
              currentPrice: book.price || book.currentPrice || 0,
              originalPrice: book.discountPrice || book.originalPrice || 0,
              inStock: book.quantity > 0, // Add this line to set inStock based on quantity
              rating: book.rating || 4.5,
              reviewCount: book.reviewCount || 0,
            }))
            this.totalItems = results.books.length
          } else {
            this.filterBooks(this.searchQuery)
          }

          // Update URL with search query
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { search: this.searchQuery },
            queryParamsHandling: "merge",
          })
        },
        error: (error) => {
          console.error("Search error:", error)
          // Fallback to client-side filtering if API fails
          this.filterBooks(this.searchQuery)

          // Update URL with search query
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { search: this.searchQuery },
            queryParamsHandling: "merge",
          })
        },
      })
    } else {
      // If search is empty, reset to all books
      this.books = [...this.allBooks]
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: null },
        queryParamsHandling: "merge",
      })
    }
  }

  filterBooks(query: string): void {
    if (!query) {
      this.books = [...this.allBooks]
      return
    }

    const lowerQuery = query.toLowerCase()
    this.books = this.allBooks.filter(
      (book) => book.title.toLowerCase().includes(lowerQuery) || book.author.toLowerCase().includes(lowerQuery),
    )

    // Update total items count
    this.totalItems = this.books.length
  }

  private checkAuthStatus(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(["/auth/login"])
    }
  }

  private setupAuthSubscription(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status
      if (!status) this.handleLogout()
    })
  }

  private handleLogout(): void {
    this.router.navigate(["/auth/login"])
    this.showProfileDropdown = false
  }

  openAuthModal(): void {
    if (this.authDialogRef) {
      this.authDialogRef.close()
      this.authDialogRef = undefined
      return
    }

    this.authDialogRef = this.dialog.open(LoginComponent, {
      width: "900px",
      panelClass: "auth-modal",
      disableClose: true,
      data: { isModal: true },
    })

    this.authDialogRef.afterClosed().subscribe(() => {
      this.authDialogRef = undefined
    })
  }

  logout(): void {
    this.authService.logout()
  }

  toggleSortDropdown(): void {
    this.showSortDropdown = !this.showSortDropdown
  }

  selectSort(sort: string): void {
    this.selectedSort = sort
    this.showSortDropdown = false

    // Apply sorting to books
    this.applySorting()
  }

  applySorting(): void {
    const bookService = this.injector.get(BookService)

    switch (this.selectedSort) {
      case "price: low to high":
        // Call API for price sorting (ascending)
        bookService.getSortedBooks("price_asc").subscribe({
          next: (results) => {
            console.log("Sorted books (low to high):", results)
            if (results && results.books) {
              this.books = results.books.map((book: any) => ({
                ...book,
                imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
                title: book.bookName || book.title || "Unknown Title",
                author: book.author || "Unknown Author",
                currentPrice: book.price || book.currentPrice || 0,
                originalPrice: book.discountPrice || book.originalPrice || 0,
                inStock: book.quantity > 0, // Yeh line important hai - quantity check karke inStock set karta hai
                rating: book.rating || 4.5,
                reviewCount: book.reviewCount || 0,
              }))
            } else {
              // Fallback to client-side sorting (original behavior)
              this.books.sort((a, b) => a.currentPrice - b.currentPrice)
            }
          },
          error: (error) => {
            console.error("Sorting error:", error)
            // Fallback to client-side sorting (original behavior)
            this.books.sort((a, b) => a.currentPrice - b.currentPrice)
          },
        })
        break

      case "price: high to low":
        // Call API for price sorting (descending)
        bookService.getSortedBooks("price_desc").subscribe({
          next: (results) => {
            console.log("Sorted books (high to low):", results)
            if (results && results.books) {
              this.books = results.books.map((book: any) => ({
                ...book,
                imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
                title: book.bookName || book.title || "Unknown Title",
                author: book.author || "Unknown Author",
                currentPrice: book.price || book.currentPrice || 0,
                originalPrice: book.discountPrice || book.originalPrice || 0,
                inStock: book.quantity > 0, // Yeh line important hai - quantity check karke inStock set karta hai
                rating: book.rating || 4.5,
                reviewCount: book.reviewCount || 0,
              }))
            } else {
              // Fallback to client-side sorting (original behavior)
              this.books.sort((a, b) => b.currentPrice - a.currentPrice)
            }
          },
          error: (error) => {
            console.error("Sorting error:", error)
            // Fallback to client-side sorting (original behavior)
            this.books.sort((a, b) => b.currentPrice - a.currentPrice)
          },
        })
        break

      case "newest":
        // Call API for recent books
        bookService.getRecentBooks(this.books.length).subscribe({
          next: (results) => {
            console.log("Recent books:", results)
            if (results && results.books) {
              this.books = results.books.map((book: any) => ({
                ...book,
                imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
                title: book.bookName || book.title || "Unknown Title",
                author: book.author || "Unknown Author",
                currentPrice: book.price || book.currentPrice || 0,
                originalPrice: book.discountPrice || book.originalPrice || 0,
                inStock: book.quantity > 0, // Yeh line important hai - quantity check karke inStock set karta hai
                rating: book.rating || 4.5,
                reviewCount: book.reviewCount || 0,
              }))
            } else {
              // Fallback to client-side sorting (original behavior)
              this.books.reverse()
            }
          },
          error: (error) => {
            console.error("Recent books error:", error)
            // Fallback to client-side sorting (original behavior)
            this.books.reverse()
          },
        })
        break

      default:
        // 'relevance' - preserve original behavior exactly
        if (this.searchQuery) {
          // First filter by search query
          const lowerQuery = this.searchQuery.toLowerCase()
          this.books = this.allBooks.filter(
            (book) => book.title.toLowerCase().includes(lowerQuery) || book.author.toLowerCase().includes(lowerQuery),
          )
        } else {
          // If no search query, just use the original order
          this.books = [...this.allBooks]
        }
    }
  }

  // Update the loadBooks method to handle stock status
  loadBooks(): void {
    const bookService = this.injector.get(BookService)
    bookService.getBooks().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.books = data.map((book: any) => ({
            ...book,
            imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
            title: book.bookName || book.title || "Unknown Title",
            author: book.author || "Unknown Author",
            currentPrice: book.price || book.currentPrice || 0,
            originalPrice: book.discountPrice || book.originalPrice || 0,
            inStock: book.quantity > 0, // Yeh line important hai
            rating: book.rating || 4.5,
            reviewCount: book.reviewCount || 0,
          }))
          this.allBooks = [...this.books]
          this.totalItems = data.length
        } else if (data && Array.isArray(data.books)) {
          this.books = data.books.map((book: any) => ({
            ...book,
            imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
            title: book.bookName || book.title || "Unknown Title",
            author: book.author || "Unknown Author",
            currentPrice: book.price || book.currentPrice || 0,
            originalPrice: book.discountPrice || book.originalPrice || 0,
            inStock: book.quantity > 0, // Yeh line important hai
            rating: book.rating || 4.5,
            reviewCount: book.reviewCount || 0,
          }))
          this.allBooks = [...this.books]
          this.totalItems = data.books.length
        } else {
          console.warn("Unexpected data format from API:", data)
        }
      },
      error: (error: any) => {
        console.error("Error loading books:", error)
      },
    })
  }

  getStars(rating: number): number[] {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    return Array(5)
      .fill(0)
      .map((_, i) => {
        if (i < fullStars) return 1
        if (i === fullStars && hasHalfStar) return 0.5
        return 0
      })
  }

  toggleProfileDropdown(event: Event): void {
    event.preventDefault()
    event.stopPropagation()
    this.showProfileDropdown = !this.showProfileDropdown
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    if (!target.closest(".user-action-container") && !target.closest(".sort-dropdown")) {
      this.showProfileDropdown = false
      this.showSortDropdown = false
    }
  }

  navigateToOrders(): void {
    console.log("Navigating to orders page")
  }

  navigateToWishlist(): void {
    console.log("Navigating to wishlist page")
    this.router.navigate(["/wishlist"])
  }

  changePage(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, 18))
    console.log("Page changed to:", this.currentPage)

    // Call the API to get paginated results
    this.loadPagedBooks(this.currentPage)
  }

  // Add a new method to load books by page
  loadPagedBooks(pageNumber: number): void {
    const bookService = this.injector.get(BookService)
    bookService.getBooksByPage(pageNumber).subscribe({
      next: (data: any) => {
        console.log("Paged books:", data)
        if (data && Array.isArray(data.books)) {
          this.books = data.books.map((book: any) => ({
            ...book,
            imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
            title: book.bookName || book.title || "Unknown Title",
            author: book.author || "Unknown Author",
            currentPrice: book.price || book.currentPrice || 0,
            originalPrice: book.discountPrice || book.originalPrice || 0,
            inStock: book.quantity > 0, // Yeh line important hai - quantity check karke inStock set karta hai
            rating: book.rating || 4.5,
            reviewCount: book.reviewCount || 0,
          }))
          this.totalItems = data.totalItems || data.books.length
          this.currentPage = data.currentPage || pageNumber
        } else {
          console.warn("Unexpected data format from API:", data)
        }
      },
      error: (error: any) => {
        console.error("Error loading paged books:", error)
        // Fallback to client-side pagination if API fails
        this.clientSidePagination(pageNumber)
      },
    })
  }

  // Add a method for client-side pagination as fallback
  clientSidePagination(pageNumber: number): void {
    const pageSize = 8 // Number of items per page
    const startIndex = (pageNumber - 1) * pageSize
    const endIndex = startIndex + pageSize

    // Use all books for pagination if we have them
    if (this.allBooks && this.allBooks.length > 0) {
      this.books = this.allBooks.slice(startIndex, endIndex)
    }
  }

  navigateToBookDetail(bookId: number): void {
    this.router.navigate(["/book", bookId])
  }

  updateCartItemQuantity(cartItemId: number, newQuantity: number): void {
    if (newQuantity < 1) return
    const bookService = this.injector.get(BookService)
    bookService.updateCartItemQuantity(cartItemId, newQuantity).subscribe({
      next: (response) => {
        console.log("Cart item updated:", response)
        // You might want to show a success message here
      },
      error: (error) => {
        console.error("Error updating cart item:", error)
        // Handle the error - show a message to the user
        alert("Failed to update quantity. Please try again.")
      },
    })
  }
}
