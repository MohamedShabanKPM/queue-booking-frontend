import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface QueueFormField {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'statusbar';
  readonly?: boolean;
  invisible?: boolean;
  options?: { value: any; label: string }[];
  widget?: string;
}

export interface QueueFormButton {
  label: string;
  class?: string;
  action: () => void;
  visible?: boolean;
  icon?: string;
}

export interface QueueStatusBar {
  statusField: string;
  states: string[];
  currentState: string;
}

@Component({
  selector: 'app-queue-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './queue-form.component.html',
  styleUrls: ['./queue-form.component.css']
})
export class QueueFormComponent {
  @Input() title: string = '';
  @Input() data: any = {};
  @Input() fields: QueueFormField[] = [];
  @Input() headerButtons: QueueFormButton[] = [];
  @Input() statusBar?: QueueStatusBar;
  @Input() buttonBox?: { icon: string; label: string; action: () => void };
  @Output() fieldChange = new EventEmitter<{ field: string; value: any }>();

  onFieldChange(field: string, value: any) {
    this.fieldChange.emit({ field, value });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'waiting': 'status-waiting',
      'in_progress': 'status-in-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return statusMap[status] || '';
  }

  getStateIndex(state: string): number {
    if (!this.statusBar) return -1;
    return this.statusBar.states.indexOf(state);
  }
}
