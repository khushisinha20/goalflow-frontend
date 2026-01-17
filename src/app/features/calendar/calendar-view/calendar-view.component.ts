import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TargetService } from '../../../core/services/target.service';
import { Target, ExecutionStatus } from '../../../shared/models/target.model';
import { CalendarHelper, CalendarWeek, CalendarDay } from '../../../shared/utils/calendar.helper';
import { DayDetailModalComponent } from '../day-detail-modal/day-detail-modal.component';
import { TargetFormComponent } from '../target-form/target-form.component';

interface DayTargets {
  [dateKey: string]: Target[];
}

interface DayStats {
  total: number;
  completed: number;
  percentage: number;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  currentMonth = this.currentDate.getMonth();
  weeks: CalendarWeek[] = [];
  targets: Target[] = [];
  dayTargets: DayTargets = {};
  loading = false;

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(
    private targetService: TargetService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.generateCalendar();
    this.loadTargets();
  }

  generateCalendar(): void {
    this.weeks = CalendarHelper.generateCalendarDays(this.currentYear, this.currentMonth);
  }

  loadTargets(): void {
    this.loading = true;
    const startDate = new Date(this.currentYear, this.currentMonth, 1);
    const endDate = new Date(this.currentYear, this.currentMonth + 1, 0);

    const startStr = CalendarHelper.formatDate(startDate);
    const endStr = CalendarHelper.formatDate(endDate);

    this.targetService.getTargetsForDateRange(startStr, endStr).subscribe({
      next: (targets) => {
        this.targets = targets;
        this.organizTargetsByDay();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading targets:', error);
        this.loading = false;
      }
    });
  }

  organizTargetsByDay(): void {
    this.dayTargets = {};
    this.targets.forEach(target => {
      if (!this.dayTargets[target.targetDate]) {
        this.dayTargets[target.targetDate] = [];
      }
      this.dayTargets[target.targetDate].push(target);
    });
  }

  getTargetsForDay(day: CalendarDay): Target[] {
    const dateKey = CalendarHelper.formatDate(day.date);
    return this.dayTargets[dateKey] || [];
  }

  getDayStats(day: CalendarDay): DayStats {
    const targets = this.getTargetsForDay(day);
    const total = targets.length;
    const completed = targets.filter(t => t.executionStatus === ExecutionStatus.COMPLETED).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, percentage };
  }

  getDayClass(day: CalendarDay): string {
    const classes: string[] = ['calendar-day'];

    if (!day.isCurrentMonth) {
      classes.push('other-month');
    }

    if (day.isToday) {
      classes.push('today');
    }

    if (day.isPast) {
      classes.push('past');
    }

    const stats = this.getDayStats(day);
    if (stats.total > 0) {
      if (stats.percentage === 100) {
        classes.push('fully-completed');
      } else if (stats.percentage > 0) {
        classes.push('partially-completed');
      } else if (day.isPast) {
        classes.push('has-missed');
      }
    }

    return classes.join(' ');
  }

  openDayDetail(day: CalendarDay): void {
    const targets = this.getTargetsForDay(day);
    
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

  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
    this.loadTargets();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
    this.loadTargets();
  }

  goToToday(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.generateCalendar();
    this.loadTargets();
  }

  getMonthYearDisplay(): string {
    return `${CalendarHelper.getMonthName(this.currentMonth)} ${this.currentYear}`;
  }

  addTarget(): void {
    const dialogRef = this.dialog.open(TargetFormComponent, {
      width: '500px',
      data: { date: new Date() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTargets();
      }
    });
  }

  getTargetIndicators(day: CalendarDay): { color: string; count: number }[] {
    const targets = this.getTargetsForDay(day);
    const categoryGroups: { [color: string]: number } = {};

    targets.forEach(target => {
      const color = target.categoryColor || '#3B82F6';
      categoryGroups[color] = (categoryGroups[color] || 0) + 1;
    });

    return Object.entries(categoryGroups).map(([color, count]) => ({ color, count }));
  }

  hasTargets(day: CalendarDay): boolean {
    return this.getTargetsForDay(day).length > 0;
  }
}