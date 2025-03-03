import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'WuyeGuanli_NG';

  // 側邊欄相關
  isSidebarActive = false;
  isLoginPage = false;
  currentPage = '儀表板';

  // 用戶信息
  userName = '系統管理員';
  userRole = '系統管理員';

  constructor(
    private router: Router
  ) {
    // 監聽路由變化
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // 獲取當前頁面標題
      this.currentPage = this.getPageTitle(event.url);

      // 判斷是否為登錄頁面
      const url = event.url.replace(/[#?].*$/, '').trim();
      this.isLoginPage = url === '/login';

      // 每次路由變化時更新用戶信息
      this.updateUserInfo();
    });
  }

  ngOnInit(): void {
    // 從 localStorage 獲取用戶信息
    this.updateUserInfo();
    
    // 添加頁面關閉事件監聽
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngOnDestroy(): void {
    // 移除事件監聽器
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  // 處理頁面關閉事件
  handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    // 檢查是否有 sessionStorage 中的 token
    // 如果有，表示用戶沒有選擇保持登入，需要在頁面關閉時自動登出
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
      this.logout();
    }
  }

  // 登出方法
  logout(): void {
    // 清除 token
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  // 切換側邊欄狀態
  toggleSidebar(): void {
    this.isSidebarActive = !this.isSidebarActive;
  }

  // 根據 URL 獲取頁面標題
  getPageTitle(url: string): string {
    if (url.includes('/dashboard')) return '儀表板';
    if (url.includes('/properties')) return '住戶管理';
    if (url.includes('/employees')) return '員工';
    if (url.includes('/leave')) return '請假';
    if (url.includes('/attendance')) return '考勤';
    if (url.includes('/admin')) return '管理';
    if (url.includes('/settings')) return '設置';
    if (url.includes('/fee-info')) return '費用信息';
    return '';
  }

  // 更新用戶信息
  private updateUserInfo(): void {
    console.log('更新用戶信息');
    console.log('localStorage userName:', localStorage.getItem('userName'));
    console.log('localStorage userRole:', localStorage.getItem('userRole'));

    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    if (userName && userName.trim() !== '') {
      this.userName = userName;
    } else {
      this.userName = '系統管理員';
    }

    if (userRole && userRole.trim() !== '') {
      // 轉換角色顯示
      if (userRole === 'admin') {
        this.userRole = '系統管理員';
      } else if (userRole === 'staff') {
        this.userRole = '工作人員';
      } else {
        this.userRole = userRole;
      }
    } else {
      this.userRole = '系統管理員';
    }
  }
}
