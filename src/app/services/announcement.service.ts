import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServiceService } from './http-service.service';
import { Announcement, AnnouncementType } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'announcements';

  // 假資料
  private mockAnnouncements: Announcement[] = [
    {
      id: 1,
      title: '春節活動會議報名通知',
      content: '春節活動會議將於下週舉行，請各位住戶踴躍報名參加。',
      date: new Date('2024-01-20'),
      type: '社區活動'
    },
    {
      id: 2,
      title: '社區環化美化計畫報告',
      content: '社區環境美化計畫執行進度報告。',
      date: new Date('2024-01-19'),
      type: '維修通知'
    },
    {
      id: 3,
      title: '元宵燈會活工程基地',
      content: '元宵燈會活動場地布置通知。',
      date: new Date('2024-01-18'),
      type: '社區活動'
    },
    {
      id: 4,
      title: '停車場照明系統更新',
      content: '停車場照明系統更新工程通知。',
      date: new Date('2024-01-17'),
      type: '維修通知'
    },
    {
      id: 5,
      title: '頂樓防水工程分配動',
      content: '頂樓防水工程施工進度說明。',
      date: new Date('2024-01-16'),
      type: '其他'
    },
    {
      id: 6,
      title: '住戶房屋保固期說明',
      content: '住戶房屋保固期限說明會通知。',
      date: new Date('2024-01-15'),
      type: '維修通知'
    },
    {
      id: 7,
      title: '兒童遊樂設施改造',
      content: '兒童遊樂設施改造工程通知。',
      date: new Date('2024-01-14'),
      type: '社區活動'
    },
    {
      id: 8,
      title: '門禁系統升級公告',
      content: '門禁系統升級維護通知。',
      date: new Date('2024-01-13'),
      type: '維修通知'
    },
    {
      id: 9,
      title: '老舊設施汰換報告',
      content: '社區老舊設施汰換計畫說明。',
      date: new Date('2024-01-12'),
      type: '其他'
    },
    {
      id: 10,
      title: '社區會議室更新通知',
      content: '社區會議室設備更新通知。',
      date: new Date('2024-01-11'),
      type: '社區活動'
    }
  ];

  constructor(private http: HttpServiceService) {}

  getAnnouncements(): Observable<Announcement[]> {
    // 暫時返回假資料
    return of(this.mockAnnouncements);
  }

  getAnnouncement(id: number): Observable<Announcement> {
    const announcement = this.mockAnnouncements.find(a => a.id === id);
    return of(announcement!);
  }

  createAnnouncement(announcement: Partial<Announcement>): Observable<Announcement> {
    const newAnnouncement = {
      ...announcement,
      id: this.mockAnnouncements.length + 1,
      date: announcement.date || new Date()
    } as Announcement;
    this.mockAnnouncements.unshift(newAnnouncement);
    return of(newAnnouncement);
  }

  updateAnnouncement(announcement: Announcement): Observable<Announcement> {
    const index = this.mockAnnouncements.findIndex(a => a.id === announcement.id);
    if (index > -1) {
      this.mockAnnouncements[index] = announcement;
    }
    return of(announcement);
  }

  deleteAnnouncement(id: number): Observable<any> {
    const index = this.mockAnnouncements.findIndex(a => a.id === id);
    if (index > -1) {
      this.mockAnnouncements.splice(index, 1);
    }
    return of(null);
  }
}