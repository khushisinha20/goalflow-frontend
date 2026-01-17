import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TargetService } from '../../../core/services/target.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { TargetFormComponent } from '../target-form/target-form.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getUserCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    // TODO: Emit event to filter calendar by category
  }

  addTarget(): void {
    const dialogRef = this.dialog.open(TargetFormComponent, {
      width: '500px',
      data: { date: new Date() }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh calendar
      }
    });
  }
}