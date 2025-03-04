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

import { Announcement, AnnouncementType } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';
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

  // 分頁
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  private allAnnouncements: Announcement[] = [];

  constructor(
    private dialog: MatDialog,
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

    this.totalItems = filtered.length;
    
    // 分頁
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.announcements = filtered.slice(start, end);
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
      case '社區活動':
        return 'type-activity';
      case '維修通知':
        return 'type-maintenance';
      default:
        return 'type-other';
    }
  }

  openPreviewDialog(announcement: Announcement): void {
    this.dialog.open(PreviewAnnouncementDialogComponent, {
      width: '600px',
      data: announcement
    });
  }
}
