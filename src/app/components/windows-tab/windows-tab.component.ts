import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QueueListComponent, QueueListColumn, QueueListButton } from '../queue-list/queue-list.component';
import { QueuePopupComponent } from '../queue-popup/queue-popup.component';
import { QueueFormField, QueueFormButton } from '../queue-form/queue-form.component';
import { AuthService } from '../../services/auth.service';

interface Window {
  id: number;
  name: string;
  number: number;
  isActive: boolean;
  currentUserId?: number;
  currentUserName?: string;
}

interface CreateWindowDto {
  name: string;
  number: number;
  isActive: boolean;
}

@Component({
  selector: 'app-windows-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, QueueListComponent, QueuePopupComponent],
  templateUrl: './windows-tab.component.html',
  styleUrls: ['./windows-tab.component.css']
})
export class WindowsTabComponent implements OnInit {
  windows: Window[] = [];
  loading = false;
  
  // Popup state
  showPopup: boolean = false;
  showCreateForm: boolean = false;
  selectedWindow: Window | null = null;
  editingWindow: Window | null = null;

  // Queue List columns
  listColumns: QueueListColumn[] = [
    { name: 'number', label: 'Number', type: 'number' },
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'currentUserName', label: 'Current User', type: 'text' },
    { name: 'isActive', label: 'Active', type: 'status' }
  ];

  // Header buttons
  headerButtons: QueueListButton[] = [
    {
      label: 'Create',
      icon: 'fa fa-plus',
      class: 'btn-primary',
      action: () => this.openCreateForm()
    }
  ];

  // Row buttons
  rowButtons: QueueListButton[] = [
    {
      label: 'Edit',
      icon: 'fa fa-edit',
      class: 'btn-link',
      action: (row) => this.editWindow(row),
      visible: () => true
    }
  ];

  // Form fields for create/edit
  formFields: QueueFormField[] = [];
  formButtons: QueueFormButton[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  ngOnInit() {
    this.loadWindows();
  }

  loadWindows() {
    this.loading = true;
    this.http.get<Window[]>('http://localhost:5000/api/windows', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.windows = data;
        this.loadWindowsWithUsers();
      },
      error: (err) => {
        console.error('Error loading windows:', err);
        this.loading = false;
      }
    });
  }

  loadWindowsWithUsers() {
    // Load current user for each window
    let loaded = 0;
    if (this.windows.length === 0) {
      this.loading = false;
      return;
    }
    
    this.windows.forEach(window => {
      this.http.get<any>(`http://localhost:5000/api/windows/${window.id}/current-user`, { headers: this.getHeaders() }).subscribe({
        next: (user) => {
          if (user) {
            window.currentUserId = user.id;
            window.currentUserName = user.name;
          } else {
            window.currentUserName = '-';
          }
          loaded++;
          if (loaded === this.windows.length) {
            this.loading = false;
          }
        },
        error: () => {
          // No user assigned
          window.currentUserName = '-';
          loaded++;
          if (loaded === this.windows.length) {
            this.loading = false;
          }
        }
      });
    });
  }

  getRowDecoration(row: any): string {
    return row.isActive ? '' : 'decoration-muted';
  }

  onRowClick(row: any) {
    this.openWindowDetails(row._original || row);
  }

  openWindowDetails(window: Window) {
    this.selectedWindow = window;
    this.showPopup = true;
  }

  openCreateForm() {
    this.editingWindow = null;
    this.setupFormFields(null);
    this.showCreateForm = true;
  }

  editWindow(window: Window) {
    this.editingWindow = window;
    this.setupFormFields(window);
    this.showCreateForm = true;
  }

  setupFormFields(window: Window | null) {
    this.formFields = [
      { name: 'number', label: 'Window Number', type: 'number', readonly: !!window },
      { name: 'name', label: 'Window Name', type: 'text', readonly: false },
      { name: 'isActive', label: 'Active', type: 'select', readonly: false, 
        options: [
          { value: true, label: 'Active' },
          { value: false, label: 'Inactive' }
        ]}
    ];

    this.formButtons = [
      {
        label: window ? 'Update' : 'Create',
        class: 'btn-primary',
        action: () => this.saveWindow(),
        visible: true
      },
      {
        label: 'Cancel',
        class: 'btn-secondary',
        action: () => this.closeForm(),
        visible: true
      }
    ];
  }

  saveWindow() {
    // Get form data from the form inputs
    const formData: any = {};
    
    const numberInput = document.querySelector('input[name="number"]') as HTMLInputElement;
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const activeSelect = document.querySelector('select[name="isActive"]') as HTMLSelectElement;
    
    if (numberInput) formData.number = parseInt(numberInput.value);
    if (nameInput) formData.name = nameInput.value;
    if (activeSelect) {
      formData.isActive = activeSelect.value === 'true';
    } else {
      formData.isActive = true;
    }

    if (!formData.name || !formData.number) {
      alert('Please fill all required fields');
      return;
    }

    if (this.editingWindow) {
      // Update existing window
      this.http.put(`http://localhost:5000/api/windows/${this.editingWindow.id}`, formData, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.loadWindows();
          this.closeForm();
        },
        error: (err) => {
          alert(err.error?.error || 'Failed to update window');
        }
      });
    } else {
      // Create new window
      this.http.post<Window>('http://localhost:5000/api/windows', formData, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.loadWindows();
          this.closeForm();
        },
        error: (err) => {
          alert(err.error?.error || 'Failed to create window');
        }
      });
    }
  }

  closeForm() {
    this.showCreateForm = false;
    this.editingWindow = null;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedWindow = null;
  }

  getListData(): any[] {
    return this.windows.map(w => ({
      number: w.number,
      name: w.name,
      currentUserName: w.currentUserName || '-',
      isActive: w.isActive ? 'Active' : 'Inactive',
      _original: w
    }));
  }
}
