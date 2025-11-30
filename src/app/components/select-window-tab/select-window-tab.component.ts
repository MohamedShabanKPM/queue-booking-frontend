import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface Window {
  id: number;
  name: string;
  number: number;
  isActive: boolean;
}

@Component({
  selector: 'app-select-window-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-window-tab.component.html',
  styleUrls: ['./select-window-tab.component.css']
})
export class SelectWindowTabComponent implements OnInit {
  windows: Window[] = [];
  currentWindow: Window | null = null;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadWindows();
    this.loadCurrentWindow();
  }

  loadWindows() {
    this.loading = true;
    this.http.get<Window[]>('http://localhost:5000/api/windows').subscribe({
      next: (data) => {
        this.windows = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load windows';
        this.loading = false;
      }
    });
  }

  loadCurrentWindow() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.http.get<Window>(`http://localhost:5000/api/windows/user/${user.id}`).subscribe({
        next: (data) => {
          this.currentWindow = data;
        },
        error: () => {
          // No window assigned yet
          this.currentWindow = null;
        }
      });
    }
  }

  selectWindow(window: Window) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error = 'User not authenticated';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    this.http.post(`http://localhost:5000/api/windows/assign?userId=${user.id}&windowId=${window.id}`, {}).subscribe({
      next: () => {
        this.currentWindow = window;
        this.success = `${window.name} assigned successfully!`;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to assign window';
        this.loading = false;
      }
    });
  }
}

