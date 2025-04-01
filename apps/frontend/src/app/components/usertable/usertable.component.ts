import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { InternalUser } from '@bsaffer/common/entity/user.entity';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usertable',
  standalone: false,
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css'], // 'styleUrl' moet 'styleUrls' zijn (array)
})
export class UsertableComponent implements OnInit {
  removeUser(_t20: InternalUser) {
    throw new Error('Method not implemented.');
  }
  updateAdminStatus(_t20: InternalUser) {
    throw new Error('Method not implemented.');
  }
  private projectId: number | undefined;
  users: InternalUser[] = [];

  constructor(
    private userService: UserService,
    private readonly router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.projectId = Number(params.get('id'));
      console.log('Project ID: ', this.projectId);

      if (this.projectId) {
        this.users = await this.userService.getAllProjectUsers(this.projectId);
      }
    });
  }
}
