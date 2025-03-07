import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServiceService } from './http-service.service';
import { Announcement, AnnouncementType } from '../models/announcement.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:8585/api/announcements';

  // 假資料 - 保留作為備用
  private mockAnnouncements: Announcement[] = [
    {
      id: 1,
      title: '春節活動會議報名通知',
      content: '春節活動會議將於下週舉行，請各位住戶踴躍報名參加。',
      date: new Date('2024-01-20'),
      type: '住戶相關'
    },
    {
      id: 2,
      title: '社區環化美化計畫報告',
      content: '社區環境美化計畫執行進度報告。',
      date: new Date('2024-01-19'),
      type: '維修相關'
    },
    {
      id: 3,
      title: '元宵燈會活工程基地',
      content: '元宵燈會活動場地布置通知。',
      date: new Date('2024-01-18'),
      type: '住戶相關'
    },
    {
      id: 4,
      title: '停車場照明系統更新',
      content: '停車場照明系統更新工程通知。',
      date: new Date('2024-01-17'),
      type: '水電相關'
    },
    {
      id: 5,
      title: '頂樓防水工程分配動',
      content: '頂樓防水工程施工進度說明。',
      date: new Date('2024-01-16'),
      type: '維修相關'
    },
    {
      id: 6,
      title: '住戶房屋保固期說明',
      content: '住戶房屋保固期限說明會通知。',
      date: new Date('2024-01-15'),
      type: '住戶相關'
    },
    {
      id: 7,
      title: '兒童遊樂設施改造',
      content: '兒童遊樂設施改造工程通知。',
      date: new Date('2024-01-14'),
      type: '維修相關'
    },
    {
      id: 8,
      title: '門禁系統升級公告',
      content: '門禁系統升級維護通知。',
      date: new Date('2024-01-13'),
      type: '水電相關'
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
      type: '住戶相關'
    }
  ];

  constructor(private http: HttpServiceService) {}

  getAnnouncements(): Observable<Announcement[]> {
    // 使用真實 API
    return this.http.GetApi<any[]>(this.apiUrl).pipe(
      map(data => data.map(item => this.mapDashboardToAnnouncement(item)))
    );
    
    // 如果 API 不可用，可以使用以下備用代碼
    // return of(this.mockAnnouncements);
  }

  getAnnouncement(id: number): Observable<Announcement> {
    // 使用真實 API
    return this.http.GetApi<any>(`${this.apiUrl}/${id}`).pipe(
      map(data => this.mapDashboardToAnnouncement(data))
    );
    
    // 如果 API 不可用，可以使用以下備用代碼
    // const announcement = this.mockAnnouncements.find(a => a.id === id);
    // return of(announcement!);
  }

  createAnnouncement(announcement: Partial<Announcement>): Observable<Announcement> {
    // 將 Angular 的日期對象轉換為字符串格式，後端會將其轉換為 LocalDate
    const formattedAnnouncement = {
      date: announcement.date ? this.formatDate(announcement.date) : this.formatDate(new Date()),
      sort: announcement.type, // 後端使用 sort 字段，前端使用 type 字段
      header: announcement.title, // 後端使用 header 字段，前端使用 title 字段
      content: announcement.content,
      imgUrl: announcement.imageUrl // 後端使用 imgUrl 字段，前端使用 imageUrl 字段
    };

    // 使用真實 API
    return this.http.PostApi<any>(this.apiUrl, formattedAnnouncement).pipe(
      map(data => this.mapDashboardToAnnouncement(data))
    );
    
    // 如果 API 不可用，可以使用以下備用代碼
    // const newAnnouncement = {
    //   ...announcement,
    //   id: this.mockAnnouncements.length + 1,
    //   date: announcement.date || new Date()
    // } as Announcement;
    // this.mockAnnouncements.unshift(newAnnouncement);
    // return of(newAnnouncement);
  }

  updateAnnouncement(announcement: Announcement): Observable<Announcement> {
    // 將 Angular 的日期對象轉換為字符串格式，後端會將其轉換為 LocalDate
    const formattedAnnouncement = {
      date: announcement.date ? this.formatDate(announcement.date) : this.formatDate(new Date()),
      sort: announcement.type, // 後端使用 sort 字段，前端使用 type 字段
      header: announcement.title, // 後端使用 header 字段，前端使用 title 字段
      content: announcement.content,
      imgUrl: announcement.imageUrl // 後端使用 imgUrl 字段，前端使用 imageUrl 字段
    };

    // 使用真實 API
    return this.http.PutApi<any>(`${this.apiUrl}/${announcement.id}`, formattedAnnouncement).pipe(
      map(data => this.mapDashboardToAnnouncement(data))
    );
    
    // 如果 API 不可用，可以使用以下備用代碼
    // const index = this.mockAnnouncements.findIndex(a => a.id === announcement.id);
    // if (index > -1) {
    //   this.mockAnnouncements[index] = announcement;
    // }
    // return of(announcement);
  }

  deleteAnnouncement(id: number): Observable<any> {
    // 使用真實 API
    return this.http.DeleteApi<any>(`${this.apiUrl}/${id}`);
    
    // 如果 API 不可用，可以使用以下備用代碼
    // const index = this.mockAnnouncements.findIndex(a => a.id === id);
    // if (index > -1) {
    //   this.mockAnnouncements.splice(index, 1);
    // }
    // return of(null);
  }

  // 將日期格式化為 yyyy-MM-dd 格式
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 將後端 Dashboard 格式轉換為前端 Announcement 格式
  private mapDashboardToAnnouncement(item: any): Announcement {
    return {
      id: item.id,
      title: item.header,
      content: item.content,
      date: item.date ? new Date(item.date) : new Date(), // 如果日期為空，使用當前日期
      type: this.mapSortToType(item.sort),
      imageUrl: item.imgUrl
    };
  }

  // 將後端 sort 字段映射到前端 type 字段
  private mapSortToType(sort: string): AnnouncementType {
    if (sort === '水電相關' || sort === '住戶相關' || sort === '維修相關') {
      return sort as AnnouncementType;
    }
    return '其他';
  }
}