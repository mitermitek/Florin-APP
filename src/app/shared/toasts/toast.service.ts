import { Injectable, signal } from '@angular/core';
import { ToastData } from './toast.data';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<ToastData[]>([]);
  readonly activeToasts = this.toasts.asReadonly();

  private toastId = 0;

  private show(toast: Omit<ToastData, 'id'>): void {
    const id = this.toastId++;
    const toastWithId: ToastData = { id, ...toast };

    this.toasts.update((currentToasts) => [...currentToasts, toastWithId]);

    setTimeout(() => {
      this.toasts.update((currentToasts) => currentToasts.filter((t) => t.id !== id));
    }, 5000);
  }

  success(message: string) {
    this.show({ message, type: 'success' });
  }

  info(message: string) {
    this.show({ message, type: 'info' });
  }

  warning(message: string) {
    this.show({ message, type: 'warning' });
  }

  error(message: string) {
    this.show({ message, type: 'error' });
  }
}
