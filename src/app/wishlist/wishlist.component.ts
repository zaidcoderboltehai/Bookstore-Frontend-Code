import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService, WishlistItem } from '../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wishlist-container">
      <!-- Header Section -->
      <header class="header">
        <div class="logo" style="cursor: pointer;" routerLink="/dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
              class="book-icon">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span>Bookstore</span>
        </div>

        <!-- Search Bar -->
        <div class="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
              class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search..." class="search-input">
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <a class="user-action" routerLink="/profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </a>

          <a class="user-action" routerLink="/cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Cart</span>
          </a>
        </div>
      </header>

      <!-- Breadcrumb Navigation -->
      <div class="breadcrumb">
        <a routerLink="/">Home</a> / <span>My Wishlist</span>
      </div>

      <!-- Wishlist Content -->
      <div class="wishlist-content">
        <h2 class="section-title">My Wishlist ({{ wishlistItems.length }})</h2>
        
        <div class="wishlist-items">
          <div class="wishlist-item" *ngFor="let item of wishlistItems">
            <div class="item-image">
              <img src="assets/images/Image 11@2x.png" [alt]="item.bookName">
            </div>
            <div class="item-details">
              <h3 class="item-title">{{ item.bookName }}</h3>
              <p class="item-author">by {{ item.author }}</p>
              <p class="item-price">Rs. {{ item.price }}</p>
              <div class="item-actions">
                <button class="add-to-cart-btn" (click)="addToCart(item)">ADD TO CART</button>
                <button class="remove-btn" (click)="removeFromWishlist(item.bookId)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  REMOVE
                </button>
              </div>
            </div>
          </div>

          <!-- Empty Wishlist Message -->
          <div class="empty-wishlist" *ngIf="wishlistItems.length === 0">
            <p>Your wishlist is empty</p>
            <a routerLink="/dashboard" class="continue-shopping">Continue Shopping</a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          Copyright © 2020, Bookstore Private Limited. All Rights Reserved
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .wishlist-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
      font-family: Arial, sans-serif;
      background-color: white;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 60px;
      background-color: #b02a37;
      color: white;
      position: sticky;
      top: 0;
      z-index: 100;
      width: 100%;
      left: 0;
      right: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      
      .book-icon {
        margin-right: 8px;
      }
    }

    .search-container {
      flex: 1;
      max-width: 600px;
      margin: 0 20px;
      position: relative;
      
      .search-input {
        width: 100%;
        padding: 8px 12px;
        padding-left: 35px;
        border-radius: 4px;
        border: none;
        font-size: 14px;
      }
      
      .search-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #777;
      }
    }

    .user-actions {
      display: flex;
      
      .user-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 20px;
        color: white;
        text-decoration: none;
        font-size: 12px;
        
        svg {
          margin-bottom: 4px;
        }
      }
    }

    .breadcrumb {
      padding: 15px 20px;
      font-size: 14px;
      color: #777;
      
      a {
        color: #b02a37;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .wishlist-content {
      flex: 1;
      padding: 0 20px 40px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .section-title {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 20px;
      color: #333;
    }

    .wishlist-items {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .wishlist-item {
      display: flex;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      
      .item-image {
        width: 150px;
        height: 200px;
        padding: 20px;
        background-color: #f5f5f5;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      
      .item-details {
        flex: 1;
        padding: 20px;
        
        .item-title {
          font-size: 18px;
          margin: 0 0 5px;
          color: #333;
        }
        
        .item-author {
          font-size: 14px;
          color: #777;
          margin-bottom: 10px;
        }
        
        .item-price {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        
        .item-actions {
          display: flex;
          gap: 10px;
          
          .add-to-cart-btn {
            padding: 10px 20px;
            background-color: #b02a37;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            
            &:hover {
              background-color: darken(#b02a37, 10%);
            }
          }
          
          .remove-btn {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            background-color: #f5f5f5;
            color: #333;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            
            svg {
              margin-right: 5px;
            }
            
            &:hover {
              background-color: #e0e0e0;
            }
          }
        }
      }
    }

    .empty-wishlist {
      text-align: center;
      padding: 40px 0;
      
      p {
        font-size: 18px;
        color: #777;
        margin-bottom: 20px;
      }
      
      .continue-shopping {
        display: inline-block;
        padding: 10px 20px;
        background-color: #b02a37;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        
        &:hover {
          background-color: darken(#b02a37, 10%);
        }
      }
    }

    .footer {
      background-color: #2a1a1f;
      color: white;
      padding: 15px 0;
      width: 100%;
      margin-top: auto;
    }

    .footer-content {
      text-align: center;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .wishlist-item {
        flex-direction: column;
        
        .item-image {
          width: 100%;
          height: 200px;
        }
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  isLoading = false;

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.loadWishlist();
    
    // Subscribe to wishlist changes
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.fetchWishlistFromApi().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  removeFromWishlist(bookId: number): void {
    this.wishlistService.removeFromWishlist(bookId).subscribe();
  }

  addToCart(item: WishlistItem): void {
    // Implement add to cart functionality
    console.log('Adding to cart:', item);
  }
}