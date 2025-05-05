// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  declarations: [
    // Standalone components ko yahan declare nahi karna hai
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
    OrderSummaryComponent,  // OrderSummaryComponent ko declarations se imports mein move kiya
    OrderConfirmationComponent  // OrderConfirmationComponent ko imports mein add kiya
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }