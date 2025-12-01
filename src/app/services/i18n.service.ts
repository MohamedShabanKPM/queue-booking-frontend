import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<Language>('ar');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: { [key: string]: { ar: string; en: string } } = {
    // Common
    'app.title': { ar: ' إدارة الحجوزات', en: 'Queue Management' },
    'common.save': { ar: 'حفظ', en: 'Save' },
    'common.cancel': { ar: 'إلغاء', en: 'Cancel' },
    'common.delete': { ar: 'حذف', en: 'Delete' },
    'common.edit': { ar: 'تعديل', en: 'Edit' },
    'common.create': { ar: 'إنشاء', en: 'Create' },
    'common.update': { ar: 'تحديث', en: 'Update' },
    'common.close': { ar: 'إغلاق', en: 'Close' },
    'common.search': { ar: 'بحث', en: 'Search' },
    'common.filter': { ar: 'تصفية', en: 'Filter' },
    'common.today': { ar: 'اليوم', en: 'Today' },
    'common.day': { ar: 'اليوم', en: 'Day' },
    'common.month': { ar: 'الشهر', en: 'Month' },
    'common.year': { ar: 'السنة', en: 'Year' },
    'common.loading': { ar: 'جاري التحميل...', en: 'Loading...' },
    'common.noData': { ar: 'لا توجد بيانات', en: 'No data found' },
    
    // Navigation
    'nav.bookings': { ar: 'الحجوزات', en: 'Bookings' },
    'nav.tracking': { ar: 'تتبع الطابور', en: 'Queue Tracking' },
    'nav.selectWindow': { ar: 'اختر النافذة', en: 'Select Window' },
    'nav.windows': { ar: 'النوافذ', en: 'Windows' },
    'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
    'nav.users': { ar: 'المستخدمين', en: 'Users' },
    'nav.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
    
    // Booking
    'booking.title': { ar: 'حجز جديد', en: 'New Booking' },
    'booking.name': { ar: 'الاسم', en: 'Name' },
    'booking.phone': { ar: 'الهاتف', en: 'Phone' },
    'booking.email': { ar: 'البريد الإلكتروني', en: 'Email' },
    'booking.submit': { ar: 'إرسال الحجز', en: 'Submit Booking' },
    'booking.success': { ar: 'تم الحجز بنجاح', en: 'Booking Successful' },
    'booking.queueNumber': { ar: 'رقم ', en: 'Queue' },
    'booking.status': { ar: 'الحالة', en: 'Status' },
    'booking.waiting': { ar: 'في الانتظار', en: 'Waiting' },
    'booking.inProgress': { ar: 'قيد المعالجة', en: 'In Progress' },
    'booking.completed': { ar: 'مكتمل', en: 'Completed' },
    'booking.cancelled': { ar: 'ملغي', en: 'Cancelled' },
    'booking.window': { ar: 'النافذة', en: 'Window' },
    'booking.date': { ar: 'التاريخ', en: 'Date' },
    'booking.startTime': { ar: 'وقت البدء', en: 'Start Time' },
    'booking.endTime': { ar: 'وقت الانتهاء', en: 'End Time' },
    'booking.timeTaken': { ar: 'الوقت المستغرق', en: 'Time Taken' },
    'booking.startedBy': { ar: 'بدأ بواسطة', en: 'Started By' },
    'booking.startProcessing': { ar: 'بدء المعالجة', en: 'Start Processing' },
    'booking.complete': { ar: 'إكمال', en: 'Complete' },
    'booking.cancel': { ar: 'إلغاء', en: 'Cancel' },
    'booking.recall': { ar: 'استدعاء', en: 'Recall' },
    'booking.nextReservation': { ar: 'الحجز التالي', en: 'Next Reservation' },
    'booking.getNextWaiting': { ar: '  التالي ', en: ' Next ' },
    'booking.viewTracking': { ar: 'عرض التتبع', en: 'View Tracking' },
    
    // Tracking
    'tracking.title': { ar: 'حالة الطابور المباشرة', en: 'Live Queue Status' },
    'tracking.subtitle': { ar: 'تابع دورك لحظة بلحظة', en: 'Track Your Turn in Real-Time' },
    'tracking.nowServing': { ar: 'يتم خدمة رقم', en: 'Now Serving Number' },
    'tracking.waiting': { ar: 'في الانتظار', en: 'In Queue' },
    'tracking.completed': { ar: 'مكتمل', en: 'Completed' },
    'tracking.total': { ar: 'إجمالي اليوم', en: 'Total Today' },
    'tracking.lastUpdated': { ar: 'آخر تحديث', en: 'Last Updated' },
    
    // Common status
    'common.active': { ar: 'نشط', en: 'Active' },
    'common.inactive': { ar: 'غير نشط', en: 'Inactive' },
    
    // Window
    'window.title': { ar: 'إدارة النوافذ', en: 'Windows Management' },
    'window.create': { ar: 'إنشاء نافذة جديدة', en: 'Create New Window' },
    'window.edit': { ar: 'تعديل النافذة', en: 'Edit Window' },
    'window.number': { ar: 'رقم النافذة', en: 'Window Number' },
    'window.name': { ar: 'اسم النافذة', en: 'Window Name' },
    'window.active': { ar: 'نشط', en: 'Active' },
    'window.inactive': { ar: 'غير نشط', en: 'Inactive' },
    'window.currentUser': { ar: 'المستخدم الحالي', en: 'Current User' },
    'window.select': { ar: 'اختر النافذة', en: 'Select Window' },
    'window.selected': { ar: 'النافذة المحددة', en: 'Selected Window' },
    
    // Login
    'login.title': { ar: 'تسجيل الدخول', en: 'Login' },
    'login.email': { ar: 'البريد الإلكتروني', en: 'Email' },
    'login.password': { ar: 'كلمة المرور', en: 'Password' },
    'login.submit': { ar: 'تسجيل الدخول', en: 'Login' },
    'login.error': { ar: 'خطأ في تسجيل الدخول', en: 'Login Error' },
    
    // Dashboard
    'dashboard.title': { ar: 'لوحة التحكم', en: 'Dashboard' },
    'dashboard.statistics': { ar: 'إحصائيات لوحة التحكم', en: 'Dashboard Statistics' },
    'dashboard.totalBookings': { ar: 'إجمالي الحجوزات', en: 'Total Bookings' },
    'dashboard.waiting': { ar: 'في الانتظار', en: 'Waiting' },
    'dashboard.inProgress': { ar: 'قيد المعالجة', en: 'In Progress' },
    'dashboard.completed': { ar: 'مكتمل', en: 'Completed' },
    'dashboard.cancelled': { ar: 'ملغي', en: 'Cancelled' },
    'dashboard.selectDate': { ar: 'اختر التاريخ', en: 'Select Date' },
    'dashboard.timeStatistics': { ar: 'إحصائيات الوقت', en: 'Time Statistics' },
    'dashboard.averageTime': { ar: 'متوسط الوقت', en: 'Average Time' },
    'dashboard.minTime': { ar: 'أقل وقت', en: 'Min Time' },
    'dashboard.maxTime': { ar: 'أكثر وقت', en: 'Max Time' },
    'dashboard.totalCompleted': { ar: 'إجمالي المكتمل', en: 'Total Completed' },
    'dashboard.employeeStatistics': { ar: 'إحصائيات الموظفين', en: 'Employee Statistics' },
    'dashboard.employee': { ar: 'الموظف', en: 'Employee' },
    'dashboard.total': { ar: 'الإجمالي', en: 'Total' },
    'dashboard.avgTime': { ar: 'متوسط الوقت', en: 'Avg Time' },
    'dashboard.exportPDF': { ar: 'تصدير PDF', en: 'Export PDF' },
    
    // Customer Info
    'customer.title': { ar: 'معلومات العميل', en: 'Customer Information' },
    'customer.name': { ar: 'الاسم', en: 'Name' },
    'customer.phone': { ar: 'الهاتف', en: 'Phone' },
    'customer.email': { ar: 'البريد الإلكتروني', en: 'Email' },
    
    // Booking Details
    'details.title': { ar: 'تفاصيل الحجز', en: 'Booking Details' },
    'details.queueNumber': { ar: 'رقم الطابور', en: 'Queue #' },
    'details.status': { ar: 'الحالة', en: 'Status' },
    'details.window': { ar: 'النافذة', en: 'Window' },
    'details.date': { ar: 'التاريخ', en: 'Date' },
    'details.startedBy': { ar: 'بدأ بواسطة', en: 'Started By' },
    'details.startTime': { ar: 'وقت البدء', en: 'Start Time' },
    'details.endTime': { ar: 'وقت الانتهاء', en: 'End Time' },
    'details.timeTaken': { ar: 'الوقت المستغرق', en: 'Time Taken' },
    
    // Filters
    'filter.date': { ar: 'التاريخ', en: 'Date' },
    'filter.status': { ar: 'الحالة', en: 'Status' },
    'filter.all': { ar: 'الكل', en: 'All' },
    
    // Language
    'language.arabic': { ar: 'العربية', en: 'Arabic' },
    'language.english': { ar: 'الإنجليزية', en: 'English' },
    
    // Users
    'users.addUser': { ar: 'إضافة مستخدم', en: 'Add User' },
    'users.editUser': { ar: 'تعديل مستخدم', en: 'Edit User' },
    'users.id': { ar: 'كود المستخدم', en: 'User ID' },
    'users.name': { ar: 'الاسم', en: 'Name' },
    'users.email': { ar: 'البريد الإلكتروني', en: 'Email' },
    'users.password': { ar: 'كلمة المرور', en: 'Password' },
    'users.role': { ar: 'الدور', en: 'Role' },
    'users.createdAt': { ar: 'تاريخ الإنشاء', en: 'Created At' },
    'users.create': { ar: 'إنشاء', en: 'Create' },
    'users.leaveBlank': { ar: 'اتركه فارغاً إذا لم تريد تغييره', en: 'Leave blank to keep unchanged' },
    'users.noUsers': { ar: 'لا يوجد مستخدمين', en: 'No users found' },
    'users.searchPlaceholder': { ar: 'بحث بالاسم أو الرقم...', en: 'Search by name or ID...' },
    'users.noResults': { ar: 'لا توجد نتائج', en: 'No results found' },
    'common.actions': { ar: 'الإجراءات', en: 'Actions' }
  };

  constructor() {
    // Load saved language from localStorage or default to Arabic
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('ar');
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: Language) {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  translate(key: string, params?: { [key: string]: string }): string {
    const lang = this.getCurrentLanguage();
    let translation = this.translations[key]?.[lang] || key;
    
    // Replace parameters
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    
    return translation;
  }

  instant(key: string, params?: { [key: string]: string }): string {
    return this.translate(key, params);
  }
}

