import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">

      
      <main class="dashboard-content">
        <h2>儀表板</h2>
        <p>登錄成功！這是儀表板頁面。</p>
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
  }
}
