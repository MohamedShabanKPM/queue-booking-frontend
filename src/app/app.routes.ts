import { Routes } from '@angular/router';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { QueueTrackingComponent } from './components/queue-tracking/queue-tracking.component';
import { LoginComponent } from './components/login/login.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { BookingsTabComponent } from './components/bookings-tab/bookings-tab.component';
import { TrackingTabComponent } from './components/tracking-tab/tracking-tab.component';
import { SelectWindowTabComponent } from './components/select-window-tab/select-window-tab.component';
import { WindowsTabComponent } from './components/windows-tab/windows-tab.component';
import { DashboardTabComponent } from './components/dashboard-tab/dashboard-tab.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'booking', component: BookingFormComponent },
  { path: 'tracking', component: QueueTrackingComponent }, // Public tracking route
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: AdminLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: '', component: BookingsTabComponent }, // Default to bookings
      { path: 'bookings', component: BookingsTabComponent },
      { path: 'tracking', component: TrackingTabComponent },
      { path: 'select-window', component: SelectWindowTabComponent },
      { path: 'windows', component: WindowsTabComponent },
      { path: 'dashboard', component: DashboardTabComponent, canActivate: [adminGuard] }
    ]
  },
  { path: '**', redirectTo: '' }
];

