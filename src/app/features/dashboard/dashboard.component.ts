import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { StreakService } from '../../core/services/streak.service';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { User } from '../../shared/models/user.model';
import { Streak } from '../../shared/models/target.model';
import { CalendarViewComponent } from '../calendar/calendar-view/calendar-view.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    CalendarViewComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  streak: Streak | null = null;

  constructor(
    private authService: AuthService,
    private streakService: StreakService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadStreak();
  }

  loadStreak(): void {
    this.streakService.getCurrentStreak().subscribe({
      next: (streak) => {
        this.streak = streak;
      },
      error: (error) => {
        console.error('Error loading streak:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}