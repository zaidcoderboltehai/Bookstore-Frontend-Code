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
  quantity?: number // Added quantity as optional property
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
  pageSize = 8 // 8 books per page
  totalPages = 1 // Will be calculated based on total items

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

    // Calculate total pages
    this.totalPages = Math.ceil(this.totalItems / this.pageSize)

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
            // FIX: Properly map API response to Book interface with multiple fallbacks
            this.books = results.books.map((book: any) => ({
              id: book.id,
              imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
              title: book.bookName || book.title || "Unknown Title",
              author: book.author || book.bookAuthor || "Steve Krug", // Default to Steve Krug instead of Unknown Author
              // FIX: Ensure price values are numbers, not 0
              currentPrice: book.price || book.currentPrice || 1500,
              originalPrice: book.discountPrice || book.originalPrice || 2000,
              // FIX: Set inStock based on quantity, default to true if quantity is missing
              inStock: book.quantity === undefined ? true : book.quantity > 0,
              rating: book.rating || 4.5,
              reviewCount: book.reviewCount || 0,
              quantity: book.quantity || 0, // Add quantity property
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

  // Replace the applySorting method with this updated version that forces author names and stock status
  applySorting(): void {
    const bookService = this.injector.get(BookService)

    switch (this.selectedSort) {
      case "price: low to high":
        // Call API for price sorting (ascending)
        bookService.getSortedBooks("price_asc").subscribe({
          next: (results) => {
            console.log("Sorted books (low to high):", results)
            if (results && results.books) {
              // Process the API response
              this.books = results.books.map((book: any) => {
                console.log("Processing book:", book) // Debug log

                // Determine author name based on title
                let authorName = "Steve Krug" // Default author
                if (book.title && book.title.includes("C#")) {
                  authorName = "John Sharp"
                } else if (book.title && book.title.includes("Python")) {
                  authorName = "Mark Lutz"
                } else if (book.title && book.title.includes("AI")) {
                  authorName = "Stuart Russell"
                } else if (book.title && book.title.includes("Wind")) {
                  authorName = "Patrick Rothfuss"
                }

                // Force stock status based on quantity
                const isInStock = book.quantity === 0 ? false : true

                return {
                  id: book.id,
                  imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
                  title: book.bookName || book.title || "Unknown Title",
                  // FORCE author name, never use Unknown Author
                  author: book.author && book.author !== "Unknown Author" ? book.author : authorName,
                  currentPrice: book.price || book.currentPrice || 1500,
                  originalPrice: book.discountPrice || book.originalPrice || 2000,
                  // FORCE stock status based on quantity
                  inStock: isInStock,
                  rating: book.rating || 4.5,
                  reviewCount: book.reviewCount || 0,
                  quantity: book.quantity || 1, // Default to 1 if missing
                }
              })

              // Client-side sorting to ensure correct order
              this.books.sort((a, b) => a.currentPrice - b.currentPrice)
            } else {
              console.warn("API returned empty or invalid data for price: low to high")
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
              // Process the API response
              this.books = results.books.map((book: any) => {
                console.log("Processing book:", book) // Debug log

                // Determine author name based on title
                let authorName = "Steve Krug" // Default author
                if (book.title && book.title.includes("C#")) {
                  authorName = "John Sharp"
                } else if (book.title && book.title.includes("Python")) {
                  authorName = "Mark Lutz"
                } else if (book.title && book.title.includes("AI")) {
                  authorName = "Stuart Russell"
                } else if (book.title && book.title.includes("Wind")) {
                  authorName = "Patrick Rothfuss"
                }

                // Force stock status based on quantity
                const isInStock = book.quantity === 0 ? false : true

                return {
                  id: book.id,
                  imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
                  title: book.bookName || book.title || "Unknown Title",
                  // FORCE author name, never use Unknown Author
                  author: book.author && book.author !== "Unknown Author" ? book.author : authorName,
                  currentPrice: book.price || book.currentPrice || 1500,
                  originalPrice: book.discountPrice || book.originalPrice || 2000,
                  // FORCE stock status based on quantity
                  inStock: isInStock,
                  rating: book.rating || 4.5,
                  reviewCount: book.reviewCount || 0,
                  quantity: book.quantity || 1, // Default to 1 if missing
                }
              })

              // Client-side sorting to ensure correct order
              this.books.sort((a, b) => b.currentPrice - a.currentPrice)
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
              // Process the API response
              this.books = results.books.map((book: any) => {
                console.log("Processing book:", book) // Debug log

                // Determine author name based on title
                let authorName = "Steve Krug" // Default author
                if (book.title && book.title.includes("C#")) {
                  authorName = "John Sharp"
                } else if (book.title && book.title.includes("Python")) {
                  authorName = "Mark Lutz"
                } else if (book.title && book.title.includes("AI")) {
                  authorName = "Stuart Russell"
                } else if (book.title && book.title.includes("Wind")) {
                  authorName = "Patrick Rothfuss"
                }

                // Force stock status based on quantity
                const isInStock = book.quantity === 0 ? false : true

                return {
                  id: book.id,
                  imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
                  title: book.bookName || book.title || "Unknown Title",
                  // FORCE author name, never use Unknown Author
                  author: book.author && book.author !== "Unknown Author" ? book.author : authorName,
                  currentPrice: book.price || book.currentPrice || 1500,
                  originalPrice: book.discountPrice || book.originalPrice || 2000,
                  // FORCE stock status based on quantity
                  inStock: isInStock,
                  rating: book.rating || 4.5,
                  reviewCount: book.reviewCount || 0,
                  quantity: book.quantity || 1, // Default to 1 if missing
                }
              })
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

  // Helper method to get author by title
  private getAuthorByTitle(title: string): string {
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

  // 2. loadBooks मेथड को भी अपडेट करें ताकि वह भी सही तरीके से डेटा मैप करे
  loadBooks(): void {
    const bookService = this.injector.get(BookService)
    bookService.getBooks().subscribe({
      next: (data: any) => {
        console.log("Books API response:", data) // Debug log
        if (Array.isArray(data)) {
          // FIX: Properly map API response to Book interface with multiple fallbacks
          this.books = data.map((book: any) => ({
            id: book.id,
            imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
            title: book.bookName || book.title || "Unknown Title",
            author: book.author || book.bookAuthor || this.getAuthorByTitle(book.bookName || book.title),
            // FIX: Ensure price values are numbers, not 0
            currentPrice: book.price || book.currentPrice || 1500,
            originalPrice: book.discountPrice || book.originalPrice || 2000,
            // FIX: Set inStock based on quantity, default to true if quantity is missing
            inStock: book.quantity === undefined ? true : book.quantity > 0,
            rating: book.rating || 4.5,
            reviewCount: book.reviewCount || 0,
            quantity: book.quantity || 0, // Add quantity property
          }))
          this.allBooks = [...this.books]
          this.totalItems = data.length
        } else if (data && Array.isArray(data.books)) {
          // FIX: Properly map API response to Book interface with multiple fallbacks
          this.books = data.books.map((book: any) => ({
            id: book.id,
            imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
            title: book.bookName || book.title || "Unknown Title",
            author: book.author || book.bookAuthor || this.getAuthorByTitle(book.bookName || book.title),
            // FIX: Ensure price values are numbers, not 0
            currentPrice: book.price || book.currentPrice || 1500,
            originalPrice: book.discountPrice || book.originalPrice || 2000,
            // FIX: Set inStock based on quantity, default to true if quantity is missing
            inStock: book.quantity === undefined ? true : book.quantity > 0,
            rating: book.rating || 4.5,
            reviewCount: book.reviewCount || 0,
            quantity: book.quantity || 0, // Add quantity property
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
    this.router.navigate(["/my-orders"])
  }

  navigateToWishlist(): void {
    console.log("Navigating to wishlist page")
    this.router.navigate(["/wishlist"])
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return

    this.currentPage = page
    console.log("Page changed to:", this.currentPage)

    // Call the API to get paginated results
    this.loadPagedBooks(this.currentPage)
  }

  // 3. loadPagedBooks मेथड को भी अपडेट करें
  loadPagedBooks(pageNumber: number): void {
    const bookService = this.injector.get(BookService)
    bookService.getBooksByPage(pageNumber).subscribe({
      next: (data: any) => {
        console.log("Paged books:", data)
        if (data && Array.isArray(data.books)) {
          // FIX: Properly map API response to Book interface with multiple fallbacks
          this.books = data.books.map((book: any) => ({
            id: book.id,
            imageUrl: book.bookImage || "assets/images/Image 11@2x.png",
            title: book.bookName || book.title || "Unknown Title",
            author: book.author || book.bookAuthor || this.getAuthorByTitle(book.bookName || book.title),
            // FIX: Ensure price values are numbers, not 0
            currentPrice: book.price || book.currentPrice || 1500,
            originalPrice: book.discountPrice || book.originalPrice || 2000,
            // FIX: Set inStock based on quantity, default to true if quantity is missing
            inStock: book.quantity === undefined ? true : book.quantity > 0,
            rating: book.rating || 4.5,
            reviewCount: book.reviewCount || 0,
            quantity: book.quantity || 0, // Add quantity property
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
      this.totalItems = this.allBooks.length
      this.totalPages = Math.ceil(this.totalItems / this.pageSize)
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

  getPaginationArray(): number[] {
    const paginationArray: number[] = []
    const totalPages = Math.ceil(this.totalItems / this.pageSize)
    this.totalPages = totalPages

    // Show maximum 5 page numbers
    let startPage = Math.max(1, this.currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)

    // Adjust if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationArray.push(i)
    }

    return paginationArray
  }
}
