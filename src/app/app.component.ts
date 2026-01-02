import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GoalFlow';
  backendMessage = '';
  loading = true;
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.testBackendConnection();
  }

  testBackendConnection() {
    this.apiService.testConnection().subscribe({
      next: (response) => {
        this.backendMessage = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to connect to backend: ' + error.message;
        this.loading = false;
        console.error('Backend connection error:', error);
      }
    });
  }
}