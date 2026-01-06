import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Streak } from '../../shared/models/target.model';

@Injectable({
  providedIn: 'root'
})
export class StreakService {
  private apiUrl = environment.apiUrl + '/streaks';

  constructor(private http: HttpClient) {}

  getCurrentStreak(): Observable<Streak> {
    return this.http.get<Streak>(`${this.apiUrl}/current`);
  }
}