import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
  imports: [
    AppModule,      // Your application's main module
    ServerModule    // Server-specific module
  ],
  bootstrap: [AppComponent] // Bootstrap the root component
})
export class AppServerModule {}