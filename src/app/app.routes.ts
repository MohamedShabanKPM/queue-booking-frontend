import { Routes } from '@angular/router';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { QueueTrackingComponent } from './components/queue-tracking/queue-tracking.component';
import { LoginComponent } from './components/login/login.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: BookingFormComponent },
  { path: 'booking', component: BookingFormComponent },
  { path: 'tracking', component: QueueTrackingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminLayoutComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

