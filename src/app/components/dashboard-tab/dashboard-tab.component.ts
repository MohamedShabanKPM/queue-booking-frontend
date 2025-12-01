import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { DashboardStatsDto } from '../../models/booking.model';
import { I18nService } from '../../services/i18n.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-dashboard-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.css']
})
export class DashboardTabComponent implements OnInit {
  stats: DashboardStatsDto | null = null;
  loading = false;
  selectedDate: string = this.getTodayDateString();
  
  // Date input components
  selectedDay: number | null = null;
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  days: number[] = [];
  months: string[] = [];
  years: number[] = [];

  constructor(
    private bookingService: BookingService,
    public i18n: I18nService
  ) { }

  ngOnInit() {
    this.initializeDateInputs();
    this.setToday();
    this.loadStats();
    
    // Update months when language changes
    this.i18n.currentLanguage$.subscribe(() => {
      const currentLang = this.i18n.getCurrentLanguage();
      if (currentLang === 'ar') {
        this.months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      } else {
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      }
    });
  }

  initializeDateInputs() {
    // Generate days (1-31)
    this.days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    // Generate months based on current language
    const lang = this.i18n.getCurrentLanguage();
    if (lang === 'ar') {
      this.months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    } else {
      this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }
    
    // Generate years (current year - 2 to current year + 2)
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }

  getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  setToday() {
    const today = new Date();
    this.selectedDay = today.getDate();
    this.selectedMonth = today.getMonth() + 1;
    this.selectedYear = today.getFullYear();
    this.selectedDate = this.getTodayDateString();
    this.loadStats();
  }

  onDateChange() {
    if (this.selectedDay && this.selectedMonth && this.selectedYear) {
      const month = String(this.selectedMonth).padStart(2, '0');
      const day = String(this.selectedDay).padStart(2, '0');
      this.selectedDate = `${this.selectedYear}-${month}-${day}`;
      this.loadStats();
    } else {
      this.selectedDate = '';
      this.loadStats();
    }
  }

  loadStats() {
    this.loading = true;
    const date = this.selectedDate ? new Date(this.selectedDate) : undefined;
    
    this.bookingService.getDashboardStats(date).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loading = false;
      }
    });
  }

  exportToPDF() {
    if (!this.stats) {
      return;
    }

    // Create PDF content
    const lang = this.i18n.getCurrentLanguage();
    const isArabic = lang === 'ar';
    
    // Create a new window with the report content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    const dateStr = this.selectedDate || this.getTodayDateString();
    const dateObj = new Date(dateStr);
    const formattedDate = dateObj.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="${isArabic ? 'rtl' : 'ltr'}" lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <title>${isArabic ? 'تقرير الإحصائيات' : 'Statistics Report'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            direction: ${isArabic ? 'rtl' : 'ltr'};
          }
          h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
          }
          .report-date {
            text-align: center;
            margin-bottom: 30px;
            font-size: 14px;
            color: #666;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .stat-card {
            border: 1px solid #ddd;
            padding: 15px;
            text-align: center;
            border-radius: 5px;
            background: #f9f9f9;
          }
          .stat-card h3 {
            font-size: 32px;
            margin: 10px 0;
            color: #2c3e50;
          }
          .stat-card p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }
          .employee-stats {
            margin-top: 30px;
          }
          .employee-stats h3 {
            margin-bottom: 15px;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: ${isArabic ? 'right' : 'left'};
          }
          th {
            background-color: #2c3e50;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          @media print {
            body { margin: 0; padding: 10px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${isArabic ? 'تقرير الحجوزات' : ' Reservations Report'}</h1>
        <div class="report-date">${isArabic ? 'التاريخ' : 'Date'}: ${formattedDate}</div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>${this.stats.totalToday}</h3>
            <p>${isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}</p>
          </div>
          <div class="stat-card">
            <h3>${this.stats.waiting}</h3>
            <p>${isArabic ? 'في الانتظار' : 'Waiting'}</p>
          </div>
          <div class="stat-card">
            <h3>${this.stats.inProgress}</h3>
            <p>${isArabic ? 'قيد المعالجة' : 'In Progress'}</p>
          </div>
          <div class="stat-card">
            <h3>${this.stats.completed}</h3>
            <p>${isArabic ? 'مكتمل' : 'Completed'}</p>
          </div>
          <div class="stat-card">
            <h3>${this.stats.cancelled}</h3>
            <p>${isArabic ? 'ملغي' : 'Cancelled'}</p>
          </div>
        </div>

        ${this.stats.employeeStats.length > 0 ? `
        <div class="employee-stats">
          <h3>${isArabic ? 'إحصائيات الموظفين' : 'Employee Statistics'}</h3>
          <table>
            <thead>
              <tr>
                <th>${isArabic ? 'الموظف' : 'Employee'}</th>
                <th>${isArabic ? 'الإجمالي' : 'Total'}</th>
                <th>${isArabic ? 'مكتمل' : 'Completed'}</th>
                <th>${isArabic ? 'ملغي' : 'Cancelled'}</th>
                <th>${isArabic ? 'متوسط الوقت' : 'Avg Time'}</th>
                <th>${isArabic ? 'أقل وقت' : 'Min Time'}</th>
                <th>${isArabic ? 'أكثر وقت' : 'Max Time'}</th>
              </tr>
            </thead>
            <tbody>
              ${this.stats.employeeStats.map(emp => `
                <tr>
                  <td>${emp.name}</td>
                  <td>${emp.count}</td>
                  <td>${emp.completed}</td>
                  <td>${emp.cancelled}</td>
                  <td>${emp.averageTime}</td>
                  <td>${emp.minTime}</td>
                  <td>${emp.maxTime}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

