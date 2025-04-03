import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { InternalUser, ProjectUser } from '@bsaffer/common/entity/user.entity';
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

  private projectId!: number;
  users: ProjectUser[] = [];

  constructor(
    private userService: UserService,
    private readonly router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.projectId = Number(params.get('id'));

      if (this.projectId) {
        this.users = await this.userService.getAllProjectUsers(this.projectId);
      }
    });
  }
  updateAdminStatus(user: InternalUser, admin: boolean) {
    if (this.projectId !== undefined) {
      this.userService
        .updateAdminStatus(this.projectId, user, admin)
        .then(async () => {
          console.log('Admin status updated successfully');

          // **Forceer het opnieuw ophalen van gebruikers uit de database**
          this.users = await this.userService.getAllProjectUsers(
            this.projectId,
          );
        });
    } else {
      console.error('Project ID is undefined. Kan admin status niet updaten.');
    }
  }
}
