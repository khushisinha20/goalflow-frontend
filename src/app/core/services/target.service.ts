import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Target, TargetRequest, DailyStats, ExecutionRequest } from '../../shared/models/target.model';

@Injectable({
  providedIn: 'root'
})
export class TargetService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createTarget(request: TargetRequest): Observable<Target> {
    return this.http.post<Target>(`${this.apiUrl}/targets`, request);
  }

  getTargetsForDateRange(startDate: string, endDate: string): Observable<Target[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<Target[]>(`${this.apiUrl}/targets`, { params });
  }

  getTargetById(id: number): Observable<Target> {
    return this.http.get<Target>(`${this.apiUrl}/targets/${id}`);
  }

  updateTarget(id: number, request: TargetRequest): Observable<Target> {
    return this.http.put<Target>(`${this.apiUrl}/targets/${id}`, request);
  }

  deleteTarget(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/targets/${id}`);
  }

  getDailyStats(date: string): Observable<DailyStats> {
    return this.http.get<DailyStats>(`${this.apiUrl}/executions/daily/${date}`);
  }

  markAsCompleted(targetId: number, request?: ExecutionRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/executions/${targetId}/complete`, request || {});
  }

  markAsSkipped(targetId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/executions/${targetId}/skip`, {});
  }
}