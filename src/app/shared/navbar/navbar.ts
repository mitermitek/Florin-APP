import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly elementRef = inject(ElementRef);

  protected readonly isMenuOpen = signal(false);
  protected readonly isAuthenticated = computed(() => this.authService.isAuthenticated);

  protected toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onClickOutside(event: MouseEvent): void {
    if (!this.isMenuOpen()) return;

    const target = event.target as HTMLElement;
    const navbarElement = this.elementRef.nativeElement;

    // Close menu if clicking outside the navbar
    if (!navbarElement.contains(target)) {
      this.closeMenu();
    }
  }
}
