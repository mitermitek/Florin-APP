import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackbar = inject(MatSnackBar);

  public success(message: string): void {
    this.show(message, 'snackbar-success');
  }

  public info(message: string): void {
    this.show(message, 'snackbar-info');
  }

  public warning(message: string): void {
    this.show(message, 'snackbar-warning');
  }

  public error(message: string): void {
    this.show(message, 'snackbar-error');
  }

  private show(message: string, panelClass: string) {
    this.snackbar.open(message, undefined, {
      panelClass: [panelClass],
    });
  }
}
