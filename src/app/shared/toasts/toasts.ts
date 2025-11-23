import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toasts',
  imports: [NgClass],
  templateUrl: './toasts.html',
  styleUrl: './toasts.css',
})
export class Toasts {
  private toastService = inject(ToastService);
  readonly activeToasts = this.toastService.activeToasts;
}
