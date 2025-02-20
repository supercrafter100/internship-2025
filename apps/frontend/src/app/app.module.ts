import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideKeycloak } from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [provideKeycloak({
    config: {
      url: 'keycloak.iot-ap.be',
      realm: 'test',
      clientId: 'frontend'
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    }
  })],
  bootstrap: [AppComponent]
})
export class AppModule { }
