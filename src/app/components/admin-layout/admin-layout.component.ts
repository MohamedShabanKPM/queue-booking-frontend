import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BookingsTabComponent } from '../bookings-tab/bookings-tab.component';
import { TrackingTabComponent } from '../tracking-tab/tracking-tab.component';
import { SelectWindowTabComponent } from '../select-window-tab/select-window-tab.component';
import { WindowsTabComponent } from '../windows-tab/windows-tab.component';
import { DashboardTabComponent } from '../dashboard-tab/dashboard-tab.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    BookingsTabComponent,
    TrackingTabComponent,
    SelectWindowTabComponent,
    WindowsTabComponent,
    DashboardTabComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  activeTab: string = 'bookings';

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // If user tries to access dashboard but is not admin, redirect to bookings
    const user = this.authService.getCurrentUser();
    if (user && !this.authService.isAdmin()) {
      this.activeTab = 'bookings';
    }
  }

  setActiveTab(tab: string) {
    // Prevent non-admin users from accessing dashboard
    if (tab === 'dashboard' && !this.authService.isAdmin()) {
      return;
    }
    this.activeTab = tab;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

