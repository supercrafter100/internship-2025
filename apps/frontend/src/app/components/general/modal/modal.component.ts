import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() public isModalOpen: boolean = false;
  @Input() public title: string = 'test';

  @Output() public onClose: EventEmitter<void> = new EventEmitter<void>();

  public closeModal() {
    this.onClose.emit();
  }
}
