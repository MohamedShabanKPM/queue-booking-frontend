import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserDto, CreateUserDto, UpdateUserDto } from '../../models/auth.model';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-users-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.css']
})
export class UsersTabComponent implements OnInit {
  users: UserDto[] = [];
  loading = false;
  showAddForm = false;
  showEditForm = false;
  selectedUser: UserDto | null = null;

  // Form data
  formData: CreateUserDto = {
    name: '',
    email: '',
    password: '',
    role: 'User'
  };

  editFormData: UpdateUserDto = {
    name: '',
    email: '',
    password: '',
    role: ''
  };

  roles = ['Admin', 'User'];

  constructor(
    private userService: UserService,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading = false;
        alert(err.error?.error || 'Failed to load users');
      }
    });
  }

  openAddForm() {
    this.formData = {
      name: '',
      email: '',
      password: '',
      role: 'User'
    };
    this.showAddForm = true;
    this.showEditForm = false;
  }

  closeAddForm() {
    this.showAddForm = false;
  }

  openEditForm(user: UserDto) {
    this.selectedUser = user;
    this.editFormData = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  closeEditForm() {
    this.showEditForm = false;
    this.selectedUser = null;
  }

  createUser() {
    if (!this.formData.name || !this.formData.email || !this.formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    this.userService.createUser(this.formData).subscribe({
      next: () => {
        this.loadUsers();
        this.closeAddForm();
        alert('User created successfully');
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to create user');
      }
    });
  }

  updateUser() {
    if (!this.selectedUser) return;

    // Only include fields that have values
    const updateData: UpdateUserDto = {};
    if (this.editFormData.name) updateData.name = this.editFormData.name;
    if (this.editFormData.email) updateData.email = this.editFormData.email;
    if (this.editFormData.password) updateData.password = this.editFormData.password;
    if (this.editFormData.role) updateData.role = this.editFormData.role;

    this.userService.updateUser(this.selectedUser.id, updateData).subscribe({
      next: () => {
        this.loadUsers();
        this.closeEditForm();
        alert('User updated successfully');
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to update user');
      }
    });
  }

  deleteUser(user: UserDto) {
    if (!confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
        alert('User deleted successfully');
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to delete user');
      }
    });
  }

  getRoleClass(role: string): string {
    return role === 'Admin' ? 'role-admin' : 'role-user';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}

