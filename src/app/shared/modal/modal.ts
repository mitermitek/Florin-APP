import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  modalId = input.required<string>();
  title = input.required<string>();
  confirmText = input<string>('Confirm');
  confirmDisabled = input<boolean>(false);
  cancelText = input<string>('Cancel');
  formId = input<string>();
  confirmed = output<void>();
  closed = output<void>();

  protected confirm(): void {
    this.confirmed.emit();
  }

  protected close(): void {
    this.closed.emit();
  }
}
