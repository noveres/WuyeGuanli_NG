import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenu } from '@angular/material/menu';

import { RepairRequest } from '../../models/repair-request.model';
import { RepairService } from '../../services/repair.service';
import { EditRepairDialogComponent } from '../edit-repair-dialog/edit-repair-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { RepairDialogComponent } from '../repair-dialog/repair-dialog.component';
import { PreviewRepairDialogComponent } from '../preview-repair-dialog/preview-repair-dialog.component';

@Component({
  selector: 'app-repair-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    MatTooltipModule,
    EditRepairDialogComponent,
    ConfirmDialogComponent,
    RepairDialogComponent,
    PreviewRepairDialogComponent
  ],
  providers: [RepairService],
  templateUrl: './repair-request-list.component.html',
  styleUrls: ['./repair-request-list.component.scss']
})
export class RepairRequestListComponent implements OnInit {
  repairRequests: RepairRequest[] = [];
  filteredRepairs: RepairRequest[] = [];
  isLoading = false;
  displayedColumns: string[] = ['id', 'sort', 'location', 'status', 'createTime', 'actions'];
  
  // 分頁相關
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;
  
  // 篩選相關
  startDate: Date | null = null;
  selectedType: string = '';
  selectedStatus: string = '';
  searchText: string = '';
  
  // 定義維修類型和狀態
  repairSorts: string[] = ['水電相關', '設備相關', '結構相關', '其他'];
  repairStatuses: string[] = ['待處理', '處理中', '已完成', '已拒絕'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('statusMenu') statusMenu!: MatMenu;
  
  constructor(
    private repairService: RepairService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.loadRepairRequests();
  }
  
  loadRepairRequests(): void {
    this.isLoading = true;
    this.repairService.getAllRepairRequests().subscribe({
      next: (data: RepairRequest[]) => {
        this.repairRequests = data;
        this.search(); // 應用當前篩選條件
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('加載維修申請列表失敗', error);
        this.snackBar.open('加載維修申請列表失敗', '關閉', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  
  search(): void {
    let filtered = [...this.repairRequests];
    
    // 篩選類型
    if (this.selectedType) {
      filtered = filtered.filter(request => request.sort === this.selectedType);
    }
    
    // 篩選狀態
    if (this.selectedStatus) {
      filtered = filtered.filter(request => request.status === this.selectedStatus);
    }
    
    // 篩選日期
    if (this.startDate) {
      const filterDate = new Date(this.startDate);
      filterDate.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(request => {
        if (!request.createTime) return false;
        const createDate = new Date(request.createTime);
        createDate.setHours(0, 0, 0, 0);
        return createDate.getTime() === filterDate.getTime();
      });
    }
    
    // 搜索文本
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(request => 
        (request.description && request.description.toLowerCase().includes(searchLower)) || 
        (request.location && request.location.toLowerCase().includes(searchLower))
      );
    }
    
    // 更新總計數和分頁
    this.totalItems = filtered.length;
    this.filteredRepairs = filtered.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
  
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
  }
  
  clearFilters(): void {
    this.selectedType = '';
    this.selectedStatus = '';
    this.startDate = null;
    this.searchText = '';
    this.search();
  }
  
  openEditDialog(repair?: RepairRequest): void {
    const dialogRef = this.dialog.open(EditRepairDialogComponent, {
      width: '600px',
      data: repair || {
        sort: '水電相關',
        status: '待處理',
        description: '',
        location: '',
        isRepaired: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRepairRequests();
      }
    });
  }
  
  openRepairDialog(repair?: RepairRequest): void {
    const dialogRef = this.dialog.open(RepairDialogComponent, {
      width: '600px',
      data: repair || {
        sort: '水電相關',
        status: '待處理',
        description: '',
        location: '',
        isRepaired: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRepairRequests();
      }
    });
  }
  
  openPreviewDialog(repair: RepairRequest): void {
    this.dialog.open(PreviewRepairDialogComponent, {
      width: '600px',
      data: repair
    });
  }
  
  openDeleteConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: '確認刪除',
        message: '您確定要刪除這個維修申請嗎？此操作不可撤銷。'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRepairRequest(id);
      }
    });
  }
  
  deleteRepairRequest(id: number): void {
    this.repairService.deleteRepairRequest(id).subscribe({
      next: () => {
        this.snackBar.open('維修申請已成功刪除', '關閉', { duration: 3000 });
        this.loadRepairRequests();
      },
      error: (error: any) => {
        console.error('刪除維修申請時發生錯誤', error);
        this.snackBar.open('刪除維修申請時發生錯誤', '關閉', { duration: 3000 });
      }
    });
  }
  
  updateStatus(repair: RepairRequest, newStatus: string): void {
    const updatedRepair: RepairRequest = {
      ...repair,
      status: newStatus,
      isRepaired: newStatus === '已完成' ? 1 : 0
    };
    
    this.repairService.updateRepairRequest(updatedRepair).subscribe({
      next: () => {
        this.snackBar.open('維修申請狀態已更新', '關閉', { duration: 3000 });
        this.loadRepairRequests();
      },
      error: (error: any) => {
        console.error('更新維修申請狀態時發生錯誤', error);
        this.snackBar.open('更新維修申請狀態時發生錯誤', '關閉', { duration: 3000 });
      }
    });
  }
  
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // 格式化為 YYYY-MM-DD HH:mm:ss
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('日期格式化錯誤:', error);
      return '';
    }
  }

  getSortClass(sort: string): string {
    switch (sort) {
      case '水電相關': return 'sort-plumbing';
      case '設備相關': return 'sort-equipment';
      case '結構相關': return 'sort-structure';
      case '其他': return 'sort-other';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case '待處理': return 'status-pending';
      case '處理中': return 'status-processing';
      case '已完成': return 'status-completed';
      case '已拒絕': return 'status-rejected';
      default: return '';
    }
  }
}
