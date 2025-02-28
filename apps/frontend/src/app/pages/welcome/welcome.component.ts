import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  public isLoggedIn = false;

  constructor(
    private readonly keycloak: KeycloakService,
    private router: Router,
  ) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.router.navigate(['home']);
    }
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
}
