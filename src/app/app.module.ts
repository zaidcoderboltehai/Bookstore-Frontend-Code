// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookDetailQuantityComponent } from './book-detail-quantity/book-detail-quantity.component';
import { CartQuantityComponent } from './cart-quantity/cart-quantity.component';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { BookDetailService } from './services/book-detail.service';
import { WishlistService } from './services/wishlist.service';
import { WishlistComponent } from './wishlist/wishlist.component'; // New import

@NgModule({
  declarations: [
    // Standalone components ko yahan declare nahi karna hai
  ],
  imports: [
    // Angular modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, // HTTP requests ke liye important
    RouterModule,
    
    // Material Design modules
    MatDialogModule,
    
    // App routing
    AppRoutingModule,
    
    // Standalone components
    BookDetailQuantityComponent,
    CartQuantityComponent,
    CartComponent,
    AddressDetailsComponent,
    OrderSummaryComponent,  // OrderSummaryComponent ko declarations se imports mein move kiya
    OrderConfirmationComponent,  // OrderConfirmationComponent ko imports mein add kiya
    WishlistComponent // WishlistComponent ko declarations se imports mein move kiya
  ],
  providers: [
    // Auth interceptor for adding JWT token to requests
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Services
    BookDetailService,
    WishlistService, // New service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }