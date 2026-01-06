import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TargetService } from '../../core/services/target.service';
import { StreakService } from '../../core/services/streak.service';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { User } from '../../shared/models/user.model';
import { Streak, Target } from '../../shared/models/target.model';
import { TargetFormComponent } from '../calendar/target-form/target-form.component';
import { DayDetailModalComponent } from '../calendar/day-detail-modal/day-detail-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  streak: Streak | null = null;
  todayTargets: Target[] = [];

  constructor(
    private authService: AuthService,
    private targetService: TargetService,
    private streakService: StreakService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadStreak();
    this.loadTodayTargets();
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

  loadTodayTargets(): void {
    const today = new Date();
    const dateStr = this.formatDate(today);
    
    this.targetService.getTargetsForDateRange(dateStr, dateStr).subscribe({
      next: (targets) => {
        this.todayTargets = targets;
      },
      error: (error) => {
        console.error('Error loading today targets:', error);
      }
    });
  }

  openCreateTarget(): void {
    const dialogRef = this.dialog.open(TargetFormComponent, {
      width: '500px',
      data: { date: new Date() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTodayTargets();
      }
    });
  }

  openDayDetail(): void {
    const dialogRef = this.dialog.open(DayDetailModalComponent, {
      width: '600px',
      data: { date: new Date(), targets: this.todayTargets }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTodayTargets();
        this.loadStreak();
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}