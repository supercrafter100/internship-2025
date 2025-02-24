import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideKeycloak } from 'keycloak-angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
