import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakRoles } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend';
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  public userRoles: String[] | null = null;

  constructor(private readonly keycloak: KeycloakService) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
      this.userRoles = await this.keycloak.getUserRoles();
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
}
