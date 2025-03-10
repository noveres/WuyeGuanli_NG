import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AvatarService } from './services/avatar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule
  ],
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
  avatarUrl: string | null = null;
  showDefaultAvatar = false;

  // 訂閱頭像更新
  private avatarSubscription: Subscription | null = null;

  @ViewChild('drawer') drawer: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private avatarService: AvatarService,
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
    
    // 訂閱頭像更新
    this.avatarSubscription = this.avatarService.avatarUpdate$.subscribe(newAvatarUrl => {
      if (newAvatarUrl) {
        this.avatarUrl = newAvatarUrl;
        this.showDefaultAvatar = false;
      }
    });
    
    // 檢查並清除刷新標記
    const isRefreshing = sessionStorage.getItem('isRefreshing');
    if (isRefreshing) {
      sessionStorage.removeItem('isRefreshing');
      console.log('頁面刷新，不執行登出');
    }
    
    // 添加頁面關閉事件監聽
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngOnDestroy(): void {
    // 移除事件監聽器
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    
    // 取消訂閱
    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
  }

  // 處理頁面關閉事件
  handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    // 標記頁面正在刷新
    sessionStorage.setItem('isRefreshing', 'true');
    
    // 使用 setTimeout 來判斷是否真的是關閉視窗
    // 如果是刷新，setTimeout 內的代碼將不會執行，因為頁面會在超時前重新載入
    // 如果是關閉，sessionStorage 中的標記將不會被清除
    setTimeout(() => {
      const isRefreshing = sessionStorage.getItem('isRefreshing');
      if (isRefreshing) {
        // 如果標記仍存在，表示這是視窗關閉而不是刷新
        const sessionToken = sessionStorage.getItem('token');
        if (sessionToken) {
          this.logout();
        }
      }
    }, 0);
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
    return '';
  }

  // 處理頭像加載錯誤
  handleAvatarError(): void {
    console.log('頭像加載失敗，顯示默認頭像');
    this.showDefaultAvatar = true;
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

    // 設置用戶頭像
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.avatarUrl = this.userService.getAvatarUrl(userId);
      this.showDefaultAvatar = false;
    } else {
      this.showDefaultAvatar = true;
    }
  }
}
