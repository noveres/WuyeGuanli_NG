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
  displayedColumns: string[] = ['id', 'sort', 'location', 'description', 'status', 'createTime', 'actions'];
  
  // 分頁相關
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  
  // 篩選相關
  startDate: Date | null = null;
  selectedType: string = '';
  selectedStatus: string = '';
  searchText: string = '';
  
  // 排序設定
  sortOrder: 'asc' | 'desc' = 'desc'; // 默認降序（新到舊）
  sortField: 'createTime' | 'sort' | 'status' | 'location' | 'id' = 'createTime'; // 默認按創建時間排序
  
  // Math物件用於模板中計算頁數
  Math = Math;
  
  // 定義維修類型和狀態
  repairSorts: string[] = ['水電相關', '設備相關', '結構相關', '其他'];
  repairStatuses: string[] = ['待處理', '處理中', '已完成'];
  
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
    
    // 依照創建時間排序
    this.sortRepairRequests(filtered);
    
    // 更新總計數和分頁
    this.totalItems = filtered.length;
    
    // 分頁
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.filteredRepairs = filtered.slice(start, end);
  }
  
  // 切換排序順序
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    
    // 使用動畫效果
    const column = document.querySelector(`.mat-column-${this.sortField}`);
    if (column) {
      column.classList.add('sort-changed');
      setTimeout(() => {
        column.classList.remove('sort-changed');
      }, 500);
    }
    
    this.search();
  }
  
  // 設置排序欄位
  setSortField(field: 'createTime' | 'sort' | 'status' | 'location' | 'id'): void {
    if (this.sortField === field) {
      // 如果當前已按此欄位排序，則切換順序
      this.toggleSortOrder();
    } else {
      // 切換到新的排序欄位，保持當前的排序順序
      this.sortField = field;
      
      // 使用動畫效果
      const column = document.querySelector(`.mat-column-${field}`);
      if (column) {
        column.classList.add('sort-changed');
        setTimeout(() => {
          column.classList.remove('sort-changed');
        }, 500);
      }
      
      this.search();
    }
  }
  
  // 排序維修申請
  private sortRepairRequests(repairs: RepairRequest[]): void {
    repairs.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortField) {
        case 'createTime':
          // 處理可能為空的情況
          const timeA = a.createTime ? new Date(a.createTime).getTime() : 0;
          const timeB = b.createTime ? new Date(b.createTime).getTime() : 0;
          comparison = timeA - timeB;
          break;
        
        case 'sort':
          // 按類型排序
          comparison = (a.sort || '').localeCompare(b.sort || '');
          break;
        
        case 'status':
          // 按狀態排序
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
          
        case 'location':
          // 按位置排序
          comparison = (a.location || '').localeCompare(b.location || '');
          break;
          
        case 'id':
          // 按ID排序（將ID轉為數字進行比較）
          const idA = a.id ? parseInt(a.id.toString(), 10) : 0;
          const idB = b.id ? parseInt(b.id.toString(), 10) : 0;
          comparison = idA - idB;
          break;
      }
      
      // 根據排序順序返回結果
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
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
      // case '已拒絕': return 'status-rejected';
      default: return '';
    }
  }
}
