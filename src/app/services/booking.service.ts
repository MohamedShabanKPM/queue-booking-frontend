import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingDto, BookingResponseDto, DashboardStatsDto } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) { }

  createBooking(booking: BookingDto): Observable<BookingResponseDto> {
    return this.http.post<BookingResponseDto>(this.apiUrl, booking);
  }

  getBookings(date?: Date, status?: string): Observable<BookingResponseDto[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    
    if (date) {
      params.push(`date=${date.toISOString().split('T')[0]}`);
    }
    if (status) {
      params.push(`status=${status}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<BookingResponseDto[]>(url);
  }

  getBooking(id: number): Observable<BookingResponseDto> {
    return this.http.get<BookingResponseDto>(`${this.apiUrl}/${id}`);
  }

  startProcessing(id: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/start?userId=${userId}`, {});
  }

  completeBooking(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/complete`, {});
  }

  cancelBooking(id: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel?userId=${userId}`, {});
  }

  getNextWaiting(userId?: number): Observable<BookingResponseDto> {
    const url = userId ? `${this.apiUrl}/next-waiting?userId=${userId}` : `${this.apiUrl}/next-waiting`;
    return this.http.post<BookingResponseDto>(url, {});
  }

  getDashboardStats(date?: Date): Observable<DashboardStatsDto> {
    let url = `${this.apiUrl}/dashboard`;
    if (date) {
      url += `?date=${date.toISOString().split('T')[0]}`;
    }
    return this.http.get<DashboardStatsDto>(url);
  }
}

