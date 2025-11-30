import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    LanguageSwitcherComponent,
    TranslatePipe
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  activeTab: string = 'bookings';

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Set active tab based on current route
    this.updateActiveTab();
    
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveTab();
    });
  }

  updateActiveTab() {
    const url = this.router.url;
    if (url === '/bookings' || url === '/bookings/') {
      this.activeTab = 'bookings';
    } else if (url === '/tracking' || url.includes('/tracking')) {
      this.activeTab = 'tracking';
    } else if (url === '/select-window' || url === '/select-window/') {
      this.activeTab = 'select-window';
    } else if (url === '/windows' || url === '/windows/') {
      this.activeTab = 'windows';
    } else if (url === '/dashboard' || url === '/dashboard/') {
      this.activeTab = 'dashboard';
    }
  }

  setActiveTab(tab: string) {
    // Prevent non-admin users from accessing dashboard
    if (tab === 'dashboard' && !this.authService.isAdmin()) {
      return;
    }
    // Navigate to tracking page directly (public route)
    if (tab === 'tracking') {
      this.router.navigate(['/tracking']);
    } else if (tab === 'bookings') {
      this.router.navigate(['/bookings']);
    } else {
      this.router.navigate([`/${tab}`]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

