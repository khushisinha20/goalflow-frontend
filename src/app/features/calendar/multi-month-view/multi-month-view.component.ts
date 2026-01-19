import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { TargetService } from '../../../core/services/target.service';
import { Target, ExecutionStatus } from '../../../shared/models/target.model';
import { CalendarHelper, CalendarWeek } from '../../../shared/utils/calendar.helper';
import { DayDetailModalComponent } from '../day-detail-modal/day-detail-modal.component';

interface MonthData {
  year: number;
  month: number;
  monthName: string;
  weeks: CalendarWeek[];
}

interface DayTargets {
  [dateKey: string]: Target[];
}

@Component({
  selector: 'app-multi-month-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './multi-month-view.component.html',
  styleUrls: ['./multi-month-view.component.css']
})
export class MultiMonthViewComponent implements OnInit {
  currentDate = new Date();
  months: MonthData[] = [];
  targets: Target[] = [];
  dayTargets: DayTargets = {};
  loading = false;

  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  constructor(
    private targetService: TargetService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.generateMonths();
    this.loadTargets();
  }

  generateMonths(): void {
    this.months = [];
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();

    // Previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Next month
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    this.months = [
      {
        year: prevYear,
        month: prevMonth,
        monthName: CalendarHelper.getMonthName(prevMonth),
        weeks: CalendarHelper.generateCalendarDays(prevYear, prevMonth)
      },
      {
        year: currentYear,
        month: currentMonth,
        monthName: CalendarHelper.getMonthName(currentMonth),
        weeks: CalendarHelper.generateCalendarDays(currentYear, currentMonth)
      },
      {
        year: nextYear,
        month: nextMonth,
        monthName: CalendarHelper.getMonthName(nextMonth),
        weeks: CalendarHelper.generateCalendarDays(nextYear, nextMonth)
      }
    ];
  }

  loadTargets(): void {
    this.loading = true;
    
    const firstMonth = this.months[0];
    const lastMonth = this.months[this.months.length - 1];
    
    const startDate = new Date(firstMonth.year, firstMonth.month, 1);
    const endDate = new Date(lastMonth.year, lastMonth.month + 1, 0);

    const startStr = CalendarHelper.formatDate(startDate);
    const endStr = CalendarHelper.formatDate(endDate);

    this.targetService.getTargetsForDateRange(startStr, endStr).subscribe({
      next: (targets) => {
        this.targets = targets;
        this.organizeTargetsByDay();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading targets:', error);
        this.loading = false;
      }
    });
  }

  organizeTargetsByDay(): void {
    this.dayTargets = {};
    this.targets.forEach(target => {
      if (!this.dayTargets[target.targetDate]) {
        this.dayTargets[target.targetDate] = [];
      }
      this.dayTargets[target.targetDate].push(target);
    });
  }

  getTargetsForDay(date: Date): Target[] {
    const dateKey = CalendarHelper.formatDate(date);
    return this.dayTargets[dateKey] || [];
  }

  getCompletionPercentage(date: Date): number {
    const targets = this.getTargetsForDay(date);
    if (targets.length === 0) return 0;
    
    const completed = targets.filter(t => t.executionStatus === ExecutionStatus.COMPLETED).length;
    return (completed / targets.length) * 100;
  }

  getDayClass(day: any, monthData: MonthData): string {
    const classes: string[] = ['mini-day'];

    if (!day.isCurrentMonth) {
      classes.push('other-month');
      return classes.join(' ');
    }

    if (day.isToday) {
      classes.push('today');
    }

    const percentage = this.getCompletionPercentage(day.date);
    const targets = this.getTargetsForDay(day.date);

    if (targets.length > 0) {
      if (percentage === 100) {
        classes.push('completed');
      } else if (percentage > 0) {
        classes.push('partial');
      } else if (day.isPast) {
        classes.push('missed');
      }
    }

    return classes.join(' ');
  }

  openDayDetail(day: any): void {
    if (!day.isCurrentMonth) return;
    
    const targets = this.getTargetsForDay(day.date);
    
    const dialogRef = this.dialog.open(DayDetailModalComponent, {
      width: '650px',
      data: { date: day.date, targets }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTargets();
      }
    });
  }

  previousPeriod(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 3,
      1
    );
    this.generateMonths();
    this.loadTargets();
  }

  nextPeriod(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 3,
      1
    );
    this.generateMonths();
    this.loadTargets();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.generateMonths();
    this.loadTargets();
  }

  hasTargets(day: any): boolean {
    if (!day.isCurrentMonth) return false;
    return this.getTargetsForDay(day.date).length > 0;
  }
}