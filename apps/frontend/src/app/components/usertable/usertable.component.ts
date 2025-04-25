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
  public email: string = '';
  private projectId!: number;
  users: ProjectUser[] = [];
  errorMessage: string | null = null;

  //Modal
  public isModalOpen: boolean = false;
  public modalTitle: string = '⚠️ Are you sure? ⚠️';
  public userToDelete: InternalUser | null = null;

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

  public setToBeRemoved(arg0: InternalUser) {
    this.userToDelete = arg0;
    this.isModalOpen = true;
  }

  public async addUser(email: string) {
    email = email.toLowerCase(); // Convert email to lowercase
    this.errorMessage = null; // Reset foutmelding
    this.userService
      .addUserToProject(this.projectId, email)
      .then(async () => {
        console.log('User added successfully');
        this.email = '';
        this.users = await this.userService.getAllProjectUsers(this.projectId);
        this.toast.success(email + ' added successfully.');
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        this.toast.error(
          'Error adding the user, the user is already added or is not connected to AP Terra.',
        );
      });
  }

  public async removeUser() {
    let user = this.userToDelete;
    if (!user) {
      this.errorMessage = 'User not found.';
      return;
    }

    this.errorMessage = null; // Reset foutmelding
    this.userService
      .removeUserFromProject(this.projectId, user.id)
      .then(async () => {
        console.log('User removed successfully');
        this.users = await this.userService.getAllProjectUsers(this.projectId);
      })
      .catch((error) => {
        console.error('Error removing user:', error);
        this.toast.error('Fail to remove user. Try again later.');
      });

    this.toast.success(this.userToDelete?.name + ' successfully removed.');
    this.closeModal();
  }

  updateAdminStatus(user: InternalUser, admin: boolean) {
    this.errorMessage = null; // Reset foutmelding
    if (this.projectId !== undefined) {
      this.userService
        .updateAdminStatus(this.projectId, user, admin)
        .then(async () => {
          console.log('Admin status updated successfully');
          this.toast.success(user.name + ' admin status updated successfully.');
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

  public closeModal() {
    this.isModalOpen = false;
  }
}
