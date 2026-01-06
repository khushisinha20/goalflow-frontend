import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TargetService } from '../../../core/services/target.service';
import { Target, ExecutionStatus, DailyStats } from '../../../shared/models/target.model';
import { TargetFormComponent } from '../target-form/target-form.component';

@Component({
  selector: 'app-day-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './day-detail-modal.component.html',
  styleUrls: ['./day-detail-modal.component.css']
})
export class DayDetailModalComponent implements OnInit {
  targets: Target[] = [];
  dailyStats?: DailyStats;
  loading = false;
  ExecutionStatus = ExecutionStatus;

  constructor(
    private targetService: TargetService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DayDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date; targets: Target[] }
  ) {
    this.targets = data.targets || [];
  }

  ngOnInit(): void {
    this.loadDailyStats();
  }

  loadDailyStats(): void {
    const dateStr = this.formatDate(this.data.date);
    this.targetService.getDailyStats(dateStr).subscribe({
      next: (stats) => {
        this.dailyStats = stats;
      },
      error: (error) => {
        console.error('Error loading daily stats:', error);
      }
    });
  }

  markAsCompleted(target: Target): void {
    this.loading = true;
    this.targetService.markAsCompleted(target.id).subscribe({
      next: () => {
        target.executionStatus = ExecutionStatus.COMPLETED;
        target.completionTime = new Date().toISOString();
        this.loadDailyStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error marking as completed:', error);
        this.loading = false;
      }
    });
  }

  markAsSkipped(target: Target): void {
    this.loading = true;
    this.targetService.markAsSkipped(target.id).subscribe({
      next: () => {
        target.executionStatus = ExecutionStatus.SKIPPED;
        target.completionTime = new Date().toISOString();
        this.loadDailyStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error marking as skipped:', error);
        this.loading = false;
      }
    });
  }

  editTarget(target: Target): void {
    const dialogRef = this.dialog.open(TargetFormComponent, {
      width: '500px',
      data: { target, date: this.data.date }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }

  deleteTarget(target: Target): void {
    if (confirm(`Are you sure you want to delete "${target.title}"?`)) {
      this.targetService.deleteTarget(target.id).subscribe({
        next: () => {
          this.targets = this.targets.filter(t => t.id !== target.id);
          this.loadDailyStats();
        },
        error: (error) => {
          console.error('Error deleting target:', error);
        }
      });
    }
  }

  addTarget(): void {
    const dialogRef = this.dialog.open(TargetFormComponent, {
      width: '500px',
      data: { date: this.data.date }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
      }
    });
  }

  close(): void {
    this.dialogRef.close(true);
  }

  getStatusColor(status: ExecutionStatus): string {
    switch (status) {
      case ExecutionStatus.COMPLETED:
        return 'completed';
      case ExecutionStatus.SKIPPED:
        return 'skipped';
      case ExecutionStatus.MISSED:
        return 'missed';
      default:
        return 'pending';
    }
  }

  getStatusIcon(status: ExecutionStatus): string {
    switch (status) {
      case ExecutionStatus.COMPLETED:
        return 'check_circle';
      case ExecutionStatus.SKIPPED:
        return 'remove_circle';
      case ExecutionStatus.MISSED:
        return 'cancel';
      default:
        return 'radio_button_unchecked';
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getFormattedDate(): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return this.data.date.toLocaleDateString('en-US', options);
  }
}