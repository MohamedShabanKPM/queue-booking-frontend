import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginDto = {
    email: '',
    password: ''
  };

  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      this.error = 'Please enter email and password';
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        // Redirect to admin panel
        const user = this.authService.getCurrentUser();
        if (user?.role === 'Admin' || user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        this.error = err.error?.error || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}

