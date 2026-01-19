import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

export type CalendarViewType = 'monthly' | 'multi-month' | 'yearly';

@Component({
  selector: 'app-view-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  templateUrl: './view-switcher.component.html',
  styleUrls: ['./view-switcher.component.css']
})
export class ViewSwitcherComponent {
  @Input() currentView: CalendarViewType = 'monthly';
  @Output() viewChange = new EventEmitter<CalendarViewType>();

  onViewChange(view: CalendarViewType): void {
    this.currentView = view;
    this.viewChange.emit(view);
  }
}