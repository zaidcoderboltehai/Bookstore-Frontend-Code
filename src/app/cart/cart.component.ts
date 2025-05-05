import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CartService, CartItem } from "../services/cart.service";
import { AddressDetailsComponent } from "../address-details/address-details.component";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule, AddressDetailsComponent]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  showAddressDetails = false;
  
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
    
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateItemQuantity(item.id, item.quantity - 1);
    }
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item.id, item.quantity + 1);
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  placeOrder(): void {
    console.log("Placing order for items:", this.cartItems);
    // Toggle address details visibility
    this.showAddressDetails = true;
  }
}