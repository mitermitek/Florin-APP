import { Component, computed, DestroyRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  protected sidenavElement = viewChild<MatSidenav>('sidenav');
  protected isAuthenticated = computed(() => this.authService.isAuthenticated());

  protected menuButtonAriaLabel = computed(() =>
    this.sidenavElement()?.opened ? 'Close side navigation' : 'Open side navigation',
  );

  constructor() {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        const sidenav = this.sidenavElement();
        if (sidenav?.opened) {
          sidenav.close();
        }
      });
  }

  protected toggleSidenav(): void {
    this.sidenavElement()?.toggle();
  }
}
