import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { AnnouncementService } from '../../services/announcement.service';
import { UserService } from '../../services/user.service';
import { Announcement, AnnouncementType } from '../../models/announcement.model';

interface DashboardAnnouncement {
  id: number;
  date: string;
  sort: string;
  header: string;
  content: string;
  imgUrl: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName = '系統管理員';
  userRole = '系統管理員';
  announcements: DashboardAnnouncement[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private announcementService: AnnouncementService
  ) {}

  ngOnInit() {
    this.loadAnnouncements();
    this.updateUserInfo();
  }

  private updateUserInfo(): void {
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    if (userName && userName.trim() !== '') {
      this.userName = userName;
    }

    if (userRole && userRole.trim() !== '') {
      if (userRole === 'admin') {
        this.userRole = '系統管理員';
      } else if (userRole === 'staff') {
        this.userRole = '工作人員';
      } else {
        this.userRole = userRole;
      }
    }
  }

  loadAnnouncements() {
    this.announcementService.getAnnouncements().subscribe({
      next: (announcements: Announcement[]) => {
        this.announcements = announcements
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
          .map(announcement => ({
            id: announcement.id,
            date: announcement.date.toString(),
            sort: announcement.type,
            header: announcement.title,
            content: announcement.content,
            imgUrl: announcement.imageUrl || null
          }));
      },
      error: (error: any) => {
        console.error('獲取公告失敗:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
