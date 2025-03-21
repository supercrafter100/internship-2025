import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

/**
 * @title Drag&Drop custom placeholder
 */

@Component({
  selector: 'app-parameterstep',
  standalone: false,
  templateUrl: './parameterstep.component.html',
  styleUrl: './parameterstep.component.css',
})
export class ParameterstepComponent {
  parameters: { name: string; description: string }[] = [];

  // Add a new row
  addParameter() {
    this.parameters.push({ name: '', description: '' });
  }

  // Remove a parameter row
  removeParameter(index: number) {
    this.parameters.splice(index, 1);
  }

  // Handle drag and drop
  onDrop(event: CdkDragDrop<{ name: string; description: string }[]>) {
    moveItemInArray(this.parameters, event.previousIndex, event.currentIndex);
  }
}
