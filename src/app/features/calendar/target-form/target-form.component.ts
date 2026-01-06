import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TargetService } from '../../../core/services/target.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { Target, TargetRequest } from '../../../shared/models/target.model';

@Component({
  selector: 'app-target-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './target-form.component.html',
  styleUrls: ['./target-form.component.css']
})
export class TargetFormComponent implements OnInit {
  targetForm: FormGroup;
  loading = false;
  errorMessage = '';
  categories: Category[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private targetService: TargetService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<TargetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { target?: Target; date?: Date }
  ) {
    this.isEditMode = !!data.target;
    
    this.targetForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      targetDate: [data.date || new Date(), Validators.required],
      categoryId: [null]
    });

    if (this.isEditMode && data.target) {
      this.targetForm.patchValue({
        title: data.target.title,
        description: data.target.description,
        targetDate: new Date(data.target.targetDate),
        categoryId: data.target.categoryId
      });
    }
  }

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

  onSubmit(): void {
    if (this.targetForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formValue = this.targetForm.value;
      const request: TargetRequest = {
        title: formValue.title,
        description: formValue.description,
        targetDate: this.formatDate(formValue.targetDate),
        categoryId: formValue.categoryId
      };

      const operation = this.isEditMode && this.data.target
        ? this.targetService.updateTarget(this.data.target.id, request)
        : this.targetService.createTarget(request);

      operation.subscribe({
        next: (target) => {
          this.dialogRef.close(target);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to save target';
          this.loading = false;
          console.error('Error saving target:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get title() { return this.targetForm.get('title'); }
  get description() { return this.targetForm.get('description'); }
  get targetDate() { return this.targetForm.get('targetDate'); }
  get categoryId() { return this.targetForm.get('categoryId'); }
}