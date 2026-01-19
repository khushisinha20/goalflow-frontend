import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TargetService } from '../../../core/services/target.service';
import { Target, ExecutionStatus } from '../../../shared/models/target.model';
import { CalendarHelper } from '../../../shared/utils/calendar.helper';

interface YearMonth {
  monthIndex: number;
  monthName: string;
  totalTargets: number;
  completedTargets: number;
  completionPercentage: number;
}

interface DayTargets {
  [dateKey: string]: Target[];
}

@Component({
  selector: 'app-yearly-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './yearly-view.component.html',
  styleUrls: ['./yearly-view.component.css']
})
export class YearlyViewComponent implements OnInit {
  @Output() monthSelected = new EventEmitter<{ year: number; month: number }>();
  
  currentYear = new Date().getFullYear();
  months: YearMonth[] = [];
  targets: Target[] = [];
  dayTargets: DayTargets = {};
  loading = false;

  constructor(private targetService: TargetService) {}

  ngOnInit(): void {
    this.initializeMonths();
    this.loadTargets();
  }

  initializeMonths(): void {
    this.months = [];
    for (let i = 0; i < 12; i++) {
      this.months.push({
        monthIndex: i,
        monthName: CalendarHelper.getMonthName(i),
        totalTargets: 0,
        completedTargets: 0,
        completionPercentage: 0
      });
    }
  }

  loadTargets(): void {
    this.loading = true;
    
    const startDate = new Date(this.currentYear, 0, 1);
    const endDate = new Date(this.currentYear, 11, 31);

    const startStr = CalendarHelper.formatDate(startDate);
    const endStr = CalendarHelper.formatDate(endDate);

    this.targetService.getTargetsForDateRange(startStr, endStr).subscribe({
      next: (targets) => {
        this.targets = targets;
        this.organizeTargetsByDay();
        this.calculateMonthStats();
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

  calculateMonthStats(): void {
    this.months.forEach(month => {
      const monthTargets = this.targets.filter(target => {
        const targetDate = new Date(target.targetDate);
        return targetDate.getMonth() === month.monthIndex;
      });

      month.totalTargets = monthTargets.length;
      month.completedTargets = monthTargets.filter(
        t => t.executionStatus === ExecutionStatus.COMPLETED
      ).length;
      
      month.completionPercentage = month.totalTargets > 0
        ? (month.completedTargets / month.totalTargets) * 100
        : 0;
    });
  }

  getMonthClass(month: YearMonth): string {
    const classes: string[] = ['month-card'];
    
    if (month.totalTargets === 0) {
      classes.push('no-data');
      return classes.join(' ');
    }

    if (month.completionPercentage >= 80) {
      classes.push('excellent');
    } else if (month.completionPercentage >= 60) {
      classes.push('good');
    } else if (month.completionPercentage >= 40) {
      classes.push('average');
    } else {
      classes.push('needs-work');
    }

    return classes.join(' ');
  }

  getMonthGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }

  onMonthClick(month: YearMonth): void {
    this.monthSelected.emit({
      year: this.currentYear,
      month: month.monthIndex
    });
  }

  previousYear(): void {
    this.currentYear--;
    this.initializeMonths();
    this.loadTargets();
  }

  nextYear(): void {
    this.currentYear++;
    this.initializeMonths();
    this.loadTargets();
  }

  goToCurrentYear(): void {
    this.currentYear = new Date().getFullYear();
    this.initializeMonths();
    this.loadTargets();
  }

  isCurrentMonth(monthIndex: number): boolean {
    const now = new Date();
    return this.currentYear === now.getFullYear() && monthIndex === now.getMonth();
  }
}