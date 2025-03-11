import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  public isLoggedIn = false;

  constructor(private router: Router) {}

  public async ngOnInit() {}

  public login() {
    window.location.href = '/api/auth/oauth';
  }

  public logout() {}
}
