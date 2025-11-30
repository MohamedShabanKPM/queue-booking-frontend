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
import { UsersTabComponent } from './components/users-tab/users-tab.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: BookingFormComponent }, // Default route to booking form
  { path: 'booking', component: BookingFormComponent },
  { path: 'tracking', component: QueueTrackingComponent }, // Public tracking route
  { path: 'login', component: LoginComponent },
  { 
    path: 'bookings', 
    component: AdminLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: '', component: BookingsTabComponent } // Bookings list
    ]
  },
  { 
    path: 'select-window', 
    component: AdminLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: '', component: SelectWindowTabComponent }
    ]
  },
  { 
    path: 'windows', 
    component: AdminLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: '', component: WindowsTabComponent }
    ]
  },
  { 
    path: 'dashboard', 
    component: AdminLayoutComponent, 
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: DashboardTabComponent }
    ]
  },
  { 
    path: 'users', 
    component: AdminLayoutComponent, 
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: UsersTabComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

