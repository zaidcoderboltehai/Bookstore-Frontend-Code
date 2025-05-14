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
import { WishlistComponent } from './wishlist/wishlist.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MyOrdersComponent } from './my-orders/my-orders.component'; 

@NgModule({
  declarations: [
    // Standalone components 
  ],
  imports: [
    // Angular modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
    OrderSummaryComponent,
    OrderConfirmationComponent,
    WishlistComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MyOrdersComponent 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    BookDetailService,
    WishlistService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }