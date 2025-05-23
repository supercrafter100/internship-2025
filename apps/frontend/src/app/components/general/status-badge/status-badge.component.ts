import { Component, Input } from '@angular/core';

type Status = 'online' | 'offline';

@Component({
  selector: 'app-status-badge',
  standalone: false,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.css',
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: Status;

  get badgeColor() {
    return this.status === 'online' ? '#4ade80' : '#d1d5db';
  }
}
