import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Announcement, AnnouncementType } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';
import { EditAnnouncementDialogComponent } from '../edit-announcement-dialog/edit-announcement-dialog.component';
import { PreviewAnnouncementDialogComponent } from '../preview-announcement-dialog/preview-announcement-dialog.component';

@Component({
  selector: 'app-announcement-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    DatePipe
  ],
  templateUrl: './announcement-board.component.html',
  styleUrls: ['./announcement-board.component.scss']
})
export class AnnouncementBoardComponent implements OnInit {
  announcements: Announcement[] = [];
  displayedColumns: string[] = ['date', 'type', 'title', 'actions'];
  
  // 搜尋條件
  startDate: Date | null = null;
  selectedType: AnnouncementType | '' = '';
  searchText: string = '';
  
  // 排序設定
  sortOrder: 'asc' | 'desc' = 'desc'; // 默認降序（新到舊）

  // Math物件用於模板中計算頁數
  Math = Math;

  // 分頁
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  private allAnnouncements: Announcement[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private announcementService: AnnouncementService
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe({
      next: (data) => {
        this.allAnnouncements = data;
        this.filterAnnouncements();
      },
      error: (error) => {
        console.error('載入公告失敗:', error);
        this.showMessage('載入公告失敗');
      }
    });
  }

  filterAnnouncements(): void {
    let filtered = [...this.allAnnouncements];

    // 過濾日期
    if (this.startDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const searchDate = new Date(this.startDate!);
        return itemDate.toDateString() === searchDate.toDateString();
      });
    }

    // 過濾類型
    if (this.selectedType) {
      filtered = filtered.filter(item => item.type === this.selectedType);
    }

    // 過濾標題
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower)
      );
    }
    
    // 排序
    this.sortAnnouncements(filtered);

    this.totalItems = filtered.length;
    
    // 分頁
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.announcements = filtered.slice(start, end);
  }
  
  // 切換排序順序
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    
    // 應用排序變化動畫
    const dateColumn = document.querySelector('.mat-column-date');
    if (dateColumn) {
      dateColumn.classList.add('sort-changed');
      setTimeout(() => {
        dateColumn.classList.remove('sort-changed');
      }, 500);
    }
    
    this.filterAnnouncements();
  }
  
  // 排序公告
  private sortAnnouncements(announcements: Announcement[]): void {
    announcements.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      return this.sortOrder === 'asc' 
        ? dateA - dateB  // 升序：從舊到新
        : dateB - dateA; // 降序：從新到舊
    });
  }

  search(): void {
    this.currentPage = 0;
    this.filterAnnouncements();
  }

  clearSearch(): void {
    this.startDate = null;
    this.selectedType = '';
    this.searchText = '';
    this.search();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.filterAnnouncements();
  }

  getTypeClass(type: AnnouncementType): string {
    switch (type) {
      case '水電相關':
        return 'type-utility';
      case '住戶相關':
        return 'type-resident';
      case '維修相關':
        return 'type-maintenance';
      default:
        return 'type-other';
    }
  }

  openEditDialog(announcement?: Announcement): void {
    const dialogRef = this.dialog.open(EditAnnouncementDialogComponent, {
      width: '600px',
      data: announcement || {
        title: '',
        content: '',
        date: new Date(),
        type: '其他',
        imageUrl: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAnnouncements();
        this.showMessage(announcement ? '公告已更新' : '公告已新增');
      }
    });
  }

  openPreviewDialog(announcement: Announcement): void {
    this.dialog.open(PreviewAnnouncementDialogComponent, {
      width: '600px',
      data: announcement
    });
  }

  deleteAnnouncement(announcement: Announcement): void {
    if (confirm('確定要刪除這個公告嗎？')) {
      this.announcementService.deleteAnnouncement(announcement.id).subscribe({
        next: () => {
          this.loadAnnouncements();
          this.showMessage('公告已刪除');
        },
        error: (error) => {
          console.error('刪除公告失敗:', error);
          this.showMessage('刪除公告失敗');
        }
      });
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, '關閉', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
