import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { BookDetailQuantityComponent } from "../book-detail-quantity/book-detail-quantity.component"

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get book ID from route parameter
    this.route.params.subscribe((params) => {
      const bookId = +params["id"] // Convert to number
      this.loadBookDetails(bookId)
    })
  }

  loadBookDetails(bookId: number): void {
    // In a real app, you would fetch this from a service
    // For now, we'll use mock data based on the screenshot
    this.book = {
      id: bookId,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      imageUrl: "assets/images/Image 11@2x.png",
      rating: 4.5,
      reviewCount: 20,
      currentPrice: 1500,
      originalPrice: 2000,
      description:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut",
    }
  }

  addToCart(): void {
    console.log("Adding to cart:", this.book)
    // Implement cart functionality here
  }

  addToWishlist(): void {
    console.log("Adding to wishlist:", this.book)
    // Implement wishlist functionality here
  }

  setRating(rating: number): void {
    this.rating = rating
  }

  submitReview(): void {
    if (this.rating === 0) {
      alert("Please select a rating")
      return
    }

    console.log("Submitting review:", {
      rating: this.rating,
      text: this.reviewText,
    })

    // Clear form
    this.rating = 0
    this.reviewText = ""
  }
}