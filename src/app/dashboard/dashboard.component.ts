import { Component, HostListener, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { MatDialog, MatDialogRef } from "@angular/material/dialog"
import { LoginComponent } from "../auth/login/login.component"

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

  totalItems = 128
  selectedSort = "relevance"
  showSortDropdown = false
  currentPage = 1
  showProfileDropdown = false
  isLoggedIn = false
  private authDialogRef?: MatDialogRef<LoginComponent>

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus()
    this.setupAuthSubscription()
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
  }

  changePage(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, 18))
    console.log("Page changed to:", this.currentPage)
  }

  navigateToBookDetail(bookId: number): void {
    this.router.navigate(["/book", bookId])
  }
}
