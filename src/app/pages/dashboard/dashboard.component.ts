import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>物業管理系統</h1>
        <div class="user-info">
          <span>歡迎，{{ username }}</span>
          <button (click)="logout()">登出</button>
        </div>
      </div>
      
      <main class="dashboard-content">
        <div class="service-cards">
          <mat-card class="service-card" routerLink="/announcements">
            <mat-card-header>
              <mat-icon class="service-icon">announcement</mat-icon>
              <mat-card-title>公告管理</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>查看和管理小區公告信息</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="service-card" routerLink="/fee-info">
            <mat-card-header>
              <mat-icon class="service-icon">payments</mat-icon>
              <mat-card-title>費用管理</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>查看和管理物業費用信息</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="service-card" routerLink="/repair-management">
            <mat-card-header>
              <mat-icon class="service-icon">build</mat-icon>
              <mat-card-title>維修服務</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>提交和管理維修申請</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="service-card" routerLink="/profile">
            <mat-card-header>
              <mat-icon class="service-icon">person</mat-icon>
              <mat-card-title>個人資料</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>查看和編輯個人資料信息</p>
            </mat-card-content>
          </mat-card>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-info button {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .user-info button:hover {
      background-color: #d32f2f;
    }
    
    .dashboard-content {
      flex: 1;
    }
    
    .service-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .service-card {
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    
    .service-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
      margin-right: 8px;
      color: #1976d2;
    }
    
    mat-card-title {
      margin-bottom: 8px;
    }
    
    mat-card-content p {
      color: #666;
    }
    
    @media (max-width: 768px) {
      .service-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  username: string = '管理員';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // 從本地存儲獲取用戶名
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
