import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '@bsaffer/common/entity/user.entity';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  public isLoggedIn = false;
  public user: User | undefined;

  constructor(
    private router: ActivatedRoute,
    private userService: UserService,
  ) {}

  public async ngOnInit() {
    this.user = await this.userService.getUserInfo();
    this.isLoggedIn = !!this.user;
  }

  public login() {
    window.location.href = '/api/auth/oauth';
  }

  public logout() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action =
      '/api/auth/logout?redirectUrl=/' + this.router.snapshot.url.join('/');
    document.body.appendChild(form);
    form.submit();
  }
}
