import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { QueueFormComponent, QueueFormField, QueueFormButton } from '../queue-form/queue-form.component';
import type { QueueStatusBar } from '../queue-form/queue-form.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-queue-popup',
  standalone: true,
  imports: [CommonModule, QueueFormComponent, DatePipe, TranslatePipe],
  templateUrl: './queue-popup.component.html',
  styleUrls: ['./queue-popup.component.css']
})
export class QueuePopupComponent {
  @Input() title: string = '';
  @Input() data: any = {};
  @Input() fields: QueueFormField[] = [];
  @Input() buttons: QueueFormButton[] = [];
  @Input() statusBar?: QueueStatusBar;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<string>();

  onClose() {
    this.visible = false;
    this.close.emit();
  }

  onButtonClick(action: () => void) {
    action();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('queue-popup-backdrop')) {
      this.onClose();
    }
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

  constructor(private i18n: I18nService) {}

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
