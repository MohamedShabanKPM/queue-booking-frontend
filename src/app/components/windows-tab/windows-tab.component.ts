import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Window {
  id: number;
  name: string;
  number: number;
  isActive: boolean;
}

@Component({
  selector: 'app-windows-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './windows-tab.component.html',
  styleUrls: ['./windows-tab.component.css']
})
export class WindowsTabComponent implements OnInit {
  windows: Window[] = [];
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadWindows();
  }

  loadWindows() {
    this.loading = true;
    this.http.get<Window[]>('http://localhost:5000/api/windows').subscribe({
      next: (data) => {
        this.windows = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading windows:', err);
        this.loading = false;
      }
    });
  }
}

