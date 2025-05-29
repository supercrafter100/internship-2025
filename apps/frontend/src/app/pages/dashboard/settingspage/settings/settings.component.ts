import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

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
  ];

  public modalOpen = false;
  private projectId: number = -1;

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = +params['id'];
      if (this.projectId < 0) {
        console.error('Invalid project ID');
      }
    });
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
