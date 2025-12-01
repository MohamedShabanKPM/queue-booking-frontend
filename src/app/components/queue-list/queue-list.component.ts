import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n.service';

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

  constructor(private i18n: I18nService) {}

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
    if (column.type === 'status' && value) {
      return this.getStatusTranslation(value);
    }
    if (column.type === 'date') {
      // Check if value exists and is valid
      if (!value || value === '-' || value === null || value === undefined) {
        return '-';
      }
      // Try to parse the date
      const date = new Date(value);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '-';
      }
      return date.toLocaleString();
    }
    return value?.toString() || '';
  }

  getStatusTranslation(status: string): string {
    const statusMap: { [key: string]: string } = {
      'waiting': this.i18n.translate('booking.waiting'),
      'in_progress': this.i18n.translate('booking.inProgress'),
      'completed': this.i18n.translate('booking.completed'),
      'cancelled': this.i18n.translate('booking.cancelled')
    };
    return statusMap[status] || status;
  }
}
