import { Component } from '@angular/core';

@Component({
  selector: 'app-create-project',
  standalone: false,
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
})
export class CreateProjectComponent {
  public step = 0;
  public get stepOffset() {
    return `${this.step * 100}%`;
  }

  public stepContent = ['Test step 1', 'Test step 2', 'Test step 3'];
  public indices = Array(this.stepContent.length)
    .fill(0)
    .map((x, i) => i);

  public nextStep() {
    this.step = Math.min(this.stepContent.length - 1, this.step + 1);
  }

  public prevStep() {
    this.step = Math.max(0, this.step - 1);
  }

  public setStep(index: number) {
    this.step = index;
  }
}
