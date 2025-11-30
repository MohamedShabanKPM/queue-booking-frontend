import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
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
    if (url.includes('/bookings')) {
      this.activeTab = 'bookings';
    } else if (url.includes('/tracking')) {
      this.activeTab = 'tracking';
    } else if (url.includes('/select-window')) {
      this.activeTab = 'select-window';
    } else if (url.includes('/windows')) {
      this.activeTab = 'windows';
    } else if (url.includes('/dashboard')) {
      this.activeTab = 'dashboard';
    }
  }

  setActiveTab(tab: string) {
    // Prevent non-admin users from accessing dashboard
    if (tab === 'dashboard' && !this.authService.isAdmin()) {
      return;
    }
    // Map tracking tab to tracking route to avoid conflict with public tracking
    const route = tab === 'tracking' ? 'tracking' : tab;
    this.router.navigate([`/${route}`]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

