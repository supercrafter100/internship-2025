import { Component, OnInit } from '@angular/core';
import { User } from '@bsaffer/common/entity/user.entity';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  public user: User | null = null;

  constructor(private readonly _userService: UserService) {}

  async ngOnInit(): Promise<void> {
    this.user = await this._userService.getUserInfo();
    console.log(this.user.profile.name);
  }
}
