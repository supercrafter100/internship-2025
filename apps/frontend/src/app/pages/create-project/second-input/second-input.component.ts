import { Component } from '@angular/core';
import { ContentChange } from 'ngx-quill';

@Component({
  selector: 'app-create-project-second-input',
  standalone: false,
  templateUrl: './second-input.component.html',
  styleUrl: './second-input.component.css',
})
export class CreateProjectSecondInputStep {
  onContentChanged(event: ContentChange) {
    console.log(event);
  }
}
