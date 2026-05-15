import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css'],
})
export class Dialog {
  readonly title = input.required<string>();
  readonly formId = input<string>();
  readonly disabled = input<boolean>(false);
  readonly close = output();
  readonly confirm = output();

  protected cancel(): void {
    this.close.emit();
  }

  protected validate(): void {
    this.confirm.emit();
  }
}
