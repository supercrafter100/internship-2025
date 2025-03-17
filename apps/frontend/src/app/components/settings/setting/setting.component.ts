import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-setting',
  standalone: false,
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon!: string;
  @Input() route!: string;
}
