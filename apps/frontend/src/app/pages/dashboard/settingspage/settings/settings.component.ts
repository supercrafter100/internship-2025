import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  private arSettings = [
    {
      icon: 'user-round-cog',
      title: 'Manage users',
      description: 'Manage who can view and/or edit this project.',
      route: '/iets',
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
  ];

  public get settings(): any[] {
    return this.arSettings;
  }
}
