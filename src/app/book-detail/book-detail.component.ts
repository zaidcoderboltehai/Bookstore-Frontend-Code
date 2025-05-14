import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule, Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { BookDetailQuantityComponent } from "../book-detail-quantity/book-detail-quantity.component"
import { BookDetailService } from "../services/book-detail.service"
import { catchError } from "rxjs/operators"
import { of } from "rxjs"
import { WishlistService } from "../services/wishlist.service" // New import

@Component({
  selector: "app-book-detail",
  templateUrl: "./book-detail.component.html",
  styleUrls: ["./book-detail.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BookDetailQuantityComponent],
})
export class BookDetailComponent implements OnInit {
  book: any = {}
  rating = 0
  reviewText = ""
  isLoading = false
  errorMessage = ""
  searchQuery = ""

  constructor(
    private route: ActivatedRoute,
    private bookDetailService: BookDetailService,
    private router: Router,
    private wishlistService: WishlistService, // New service
  ) {}

  ngOnInit(): void {
    // Get book ID from route parameter
    this.route.params.subscribe((params) => {
      const bookId = +params["id"] // Convert to number
      console.log("Loading book with ID:", bookId)
      this.loadBookDetails(bookId)
    })

    // Add event listener for search input
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

      // Call the search API and navigate with results
      this.bookDetailService.searchBooks(searchInput.value.trim()).subscribe({
        next: (results) => {
          console.log("Search results:", results)
          // Navigate to dashboard with search query
          this.router.navigate(["/dashboard"], {
            queryParams: { search: searchInput.value.trim() },
          })
        },
        error: (error) => {
          console.error("Search error:", error)
          // Still navigate even if search fails
          this.router.navigate(["/dashboard"], {
            queryParams: { search: searchInput.value.trim() },
          })
        },
      })
    }
  }

  // loadBookDetails मेथड को अपडेट करें ताकि वह भी सही तरीके से डेटा मैप करे
  loadBookDetails(bookId: number): void {
    this.isLoading = true

    console.log("API call starting...")

    this.bookDetailService
      .getBookById(bookId)
      .pipe(
        catchError((error) => {
          console.error("API error:", error)
          this.errorMessage = "Failed to load book details. Please try again."

          // Return fallback data in case of error
          return of({
            id: bookId,
            title: "Don't Make Me Think",
            author: "Steve Krug",
            imageUrl: "assets/images/Image 11@2x.png",
            rating: 4.5,
            reviewCount: 20,
            currentPrice: 1500,
            originalPrice: 2000,
            inStock: true,
            description:
              "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut",
          })
        }),
      )
      .subscribe((data) => {
        console.log("Data received from backend:", data)

        // Map API response to frontend model with fallback values
        this.book = {
          id: data.id,
          title: data.bookName || data.title || "Unknown Title",
          author: data.author || data.bookAuthor || "Unknown Author", // Added bookAuthor fallback
          // Use fallback image if API image is missing or invalid
          imageUrl: data.bookImage && data.bookImage.trim() !== "" ? data.bookImage : "assets/images/Image 11@2x.png",
          rating: data.rating || 4.5,
          reviewCount: data.reviewCount || 0,
          currentPrice: data.price || data.currentPrice || 0,
          originalPrice: data.discountPrice || data.originalPrice || 0,
          // Add stock status based on quantity
          inStock: data.quantity === undefined ? true : data.quantity > 0,
          description: data.description || "No description available",
        }

        console.log("Mapped book data:", this.book)
        this.isLoading = false
      })
  }

  // Add image error handler method
  handleImageError(event: any): void {
    event.target.src = "assets/images/Image 11@2x.png" // Fallback image
  }

  addToCart(): void {
    console.log("Adding to cart:", this.book)
    // Implement cart functionality here
  }

  addToWishlist(): void {
    console.log("Adding to wishlist:", this.book)
    this.wishlistService.addToWishlist(this.book.id).subscribe({
      next: (response) => {
        console.log("Added to wishlist:", response)
      },
      error: (error) => {
        console.error("Error adding to wishlist:", error)
      },
    })
  }

  setRating(rating: number): void {
    this.rating = rating
  }

  submitReview(): void {
    if (this.rating === 0) {
      alert("Please select a rating")
      return
    }

    console.log("Submitting review to API...")

    // API ko review submit karo
    this.bookDetailService
      .submitBookReview(this.book.id, this.rating, this.reviewText)
      .pipe(
        catchError((error) => {
          console.error("Error submitting review:", error)
          alert("Failed to submit review. Please try again.")
          return of(null)
        }),
      )
      .subscribe((response) => {
        console.log("Review submission response:", response)

        if (response) {
          console.log("Review submitted successfully:", {
            rating: this.rating,
            text: this.reviewText,
          })

          // Clear form
          this.rating = 0
          this.reviewText = ""

          // Optionally refresh book details to show updated rating
          this.loadBookDetails(this.book.id)
        }
      })
  }
}