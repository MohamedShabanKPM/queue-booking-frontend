import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface QueueListColumn {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'button';
  format?: (value: any) => string;
}

export interface QueueListButton {
  label: string;
  icon?: string;
  class?: string;
  action: (row: any) => void;
  visible?: (row: any) => boolean;
}

@Component({
  selector: 'app-queue-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './queue-list.component.html',
  styleUrls: ['./queue-list.component.css']
})
export class QueueListComponent {
  @Input() data: any[] = [];
  @Input() columns: QueueListColumn[] = [];
  @Input() headerButtons: QueueListButton[] = [];
  @Input() rowButtons: QueueListButton[] = [];
  @Input() getRowClass?: (row: any) => string;
  @Input() getRowDecoration?: (row: any) => string;
  @Output() rowClick = new EventEmitter<any>();

  onRowClick(row: any) {
    this.rowClick.emit(row);
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

  formatValue(value: any, column: QueueListColumn): string {
    if (column.format) {
      return column.format(value);
    }
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleString();
    }
    return value?.toString() || '';
  }
}
