import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { RepairRequestService } from '../../services/repair-request.service';
import { HttpServiceService } from '../../services/http-service.service';
import { RepairRequest, RepairSort, RepairStatus } from '../../models/repair-request.model';
import { EditRepairDialogComponent } from '../../components/edit-repair-dialog/edit-repair-dialog.component';

@Component({
  selector: 'app-repair-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    DatePipe
  ],
  templateUrl: './repair-management.component.html',
  styleUrls: ['./repair-management.component.scss']
})
export class RepairManagementComponent implements OnInit {
  repairs: RepairRequest[] = [];
  displayedColumns: string[] = ['date', 'sort', 'location', 'status', 'actions'];
  
  // 搜尋條件
  startDate: Date | null = null;
  selectedType: RepairSort | '' = '';
  selectedStatus: RepairStatus | '' = '';
  searchText: string = '';

  // 分頁
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  // 選項
  repairSorts: RepairSort[] = ['水電相關', '設備相關', '結構相關', '其他'];
  repairStatuses: RepairStatus[] = ['待處理', '處理中', '已完成', '已拒絕'];

  private allRepairs: RepairRequest[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private repairService: RepairRequestService,
    private httpService: HttpServiceService
  ) {}

  ngOnInit(): void {
    this.loadRepairs();
  }

  loadRepairs(): void {
    this.repairService.getRepairRequests().subscribe({
      next: (data) => {
        this.allRepairs = data;
        this.filterRepairs();
      },
      error: (error) => {
        console.error('載入報修請求失敗:', error);
        this.showMessage('載入報修請求失敗');
      }
    });
  }

  filterRepairs(): void {
    let filtered = [...this.allRepairs];

    // 過濾日期
    if (this.startDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.create_time || '');
        const searchDate = new Date(this.startDate!);
        return itemDate.toDateString() === searchDate.toDateString();
      });
    }

    // 過濾類型
    if (this.selectedType) {
      filtered = filtered.filter(item => item.sort === this.selectedType);
    }

    // 過濾狀態
    if (this.selectedStatus) {
      filtered = filtered.filter(item => item.status === this.selectedStatus);
    }

    // 過濾位置
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(searchLower)
      );
    }

    this.totalItems = filtered.length;
    
    // 分頁
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.repairs = filtered.slice(start, end);
  }

  search(): void {
    this.currentPage = 0;
    this.filterRepairs();
  }

  clearSearch(): void {
    this.startDate = null;
    this.selectedType = '';
    this.selectedStatus = '';
    this.searchText = '';
    this.search();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.filterRepairs();
  }

  getTypeClass(type: RepairSort): string {
    switch (type) {
      case '水電相關':
        return 'type-utility';
      case '設備相關':
        return 'type-equipment';
      case '結構相關':
        return 'type-structure';
      default:
        return 'type-other';
    }
  }

  getStatusClass(status: RepairStatus): string {
    switch (status) {
      case '待處理':
        return 'status-pending';
      case '處理中':
        return 'status-processing';
      case '已完成':
        return 'status-completed';
      case '已拒絕':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getImageUrl(path: string | null): string {
    if (!path) return '';
    return this.httpService.getStaticUrl(path);
  }

  openRepairDialog(repair?: RepairRequest): void {
    const dialogRef = this.dialog.open(EditRepairDialogComponent, {
      width: '600px',
      data: repair || {
        description: '',
        sort: '水電相關',
        location: '',
        status: '待處理',
        isRepaired: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRepairs();
        this.showMessage(repair ? '報修請求已更新' : '報修請求已提交');
      }
    });
  }

  openPreviewDialog(repair: RepairRequest): void {
    this.dialog.open(EditRepairDialogComponent, {
      width: '600px',
      data: { ...repair, readonly: true }
    });
  }

  deleteRepair(repair: RepairRequest): void {
    if (confirm('確定要刪除這個報修請求嗎？')) {
      this.repairService.deleteRepairRequest(repair.id!).subscribe({
        next: () => {
          this.loadRepairs();
          this.showMessage('報修請求已刪除');
        },
        error: (error) => {
          console.error('刪除報修請求失敗:', error);
          this.showMessage('刪除報修請求失敗');
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
