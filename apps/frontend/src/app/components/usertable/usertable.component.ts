import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { InternalUser, ProjectUser } from '@bsaffer/common/entity/user.entity';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  standalone: false,
  styleUrls: ['./usertable.component.css'],
})
export class UsertableComponent implements OnInit {
  removeUser(arg0: InternalUser) {
    throw new Error('Method not implemented.');
  }
  public email: string = '';
  private projectId!: number;
  users: ProjectUser[] = [];
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private readonly router: Router,
    private route: ActivatedRoute,
    private toast: HotToastService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.projectId = Number(params.get('id'));
      if (this.projectId) {
        this.users = await this.userService.getAllProjectUsers(this.projectId);
      }
    });
  }

  public async addUser(email: string) {
    this.errorMessage = null; // Reset foutmelding
    this.userService
      .addUserToProject(this.projectId, email)
      .then(async () => {
        console.log('User added successfully');
        this.email = '';
        this.users = await this.userService.getAllProjectUsers(this.projectId);
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        this.toast.error(
          'Error adding the user, the user is already added or is not connected to AP Terra.',
        );
      });
  }

  updateAdminStatus(user: InternalUser, admin: boolean) {
    this.errorMessage = null; // Reset foutmelding
    if (this.projectId !== undefined) {
      this.userService
        .updateAdminStatus(this.projectId, user, admin)
        .then(async () => {
          console.log('Admin status updated successfully');
          this.users = await this.userService.getAllProjectUsers(
            this.projectId,
          );
        })
        .catch((error) => {
          console.error('Error updating admin status:', error);
          this.errorMessage = 'Fail to update admin status. Try again later.';
        });
    } else {
      this.errorMessage = 'Project ID missing.';
    }
  }
}
