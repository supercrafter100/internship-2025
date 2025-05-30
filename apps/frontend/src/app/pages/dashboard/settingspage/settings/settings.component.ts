import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toast: HotToastService,
    private readonly userService: UserService,
  ) {}

  private arSettings = [
    {
      icon: 'user-round-cog',
      title: 'Manage users',
      description: 'Manage who can view and/or edit this project.',
      route: 'users',
    },
    {
      icon: 'monitor-smartphone',
      title: 'Create devices',
      description: 'Add devices to the project',
      route: 'create-device',
    },
    {
      icon: 'pencil-ruler',
      title: 'Manage devices',
      description:
        'Manage the devices configured for this project. Modify or remove devices.',
      route: 'manage-devices',
    },
    {
      icon: 'cloud-cog',
      title: 'Configure TTN',
      description:
        'Configure the Things Network MQTT integration for this project.',
      route: 'configure-ttn',
    },
    {
      icon: 'pencil',
      title: 'Edit project',
      description:
        'Edit the project details, like the name, description and story.',
      route: 'edit-project',
      admin: true,
    },
  ];

  public modalOpen = false;
  private projectId: number = -1;
  public isAdmin = false;

  public async ngOnInit(): Promise<void> {
    this.route.params.subscribe((params) => {
      this.projectId = +params['id'];
      if (this.projectId < 0) {
        console.error('Invalid project ID');
      }
    });

    const user = await this.userService.getUserInfo();
    if (!user) {
      this.toast.error('Failed to load user information.');
      return;
    }

    this.isAdmin = user.internalUser.admin;
  }

  public get settings(): any[] {
    return this.arSettings;
  }

  public openModal() {
    this.modalOpen = true;
  }

  public closeModal() {
    this.modalOpen = false;
  }

  public async deleteProject() {
    const success = await this.projectService
      .deleteProject(this.projectId)
      .catch(() => false);
    if (!success) {
      this.toast.error(
        'Something went wrong, do you still have devices in this project?',
      );
      this.closeModal();
      return;
    }

    if (success) {
      this.router.navigate(['/home']);
    }
  }
}
