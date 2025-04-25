import { Component, OnInit } from '@angular/core';
import { User } from '@bsaffer/common/entity/user.entity';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  public user: User | undefined;

  constructor(
    private readonly _userService: UserService,
    private readonly _route: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this._userService.getUserInfo();
  }

  public login() {
    window.location.href = '/api/auth/oauth';
  }

  public logout() {
    // redirect user with a post request to /api/auth/oauth
    const form = document.createElement('form');
    form.method = 'POST';
    form.action =
      '/api/auth/logout?redirectUrl=/' + this._route.snapshot.url.join('/');
    document.body.appendChild(form);
    form.submit();
  }
}
