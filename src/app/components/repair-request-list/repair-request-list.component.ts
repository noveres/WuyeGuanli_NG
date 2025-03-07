import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RepairRequestService } from '../../services/repair-request.service';
import { RepairRequest, RepairStatus } from '../../models/repair-request.model';
import { EditRepairDialogComponent } from '../edit-repair-dialog/edit-repair-dialog.component';

@Component({
  selector: 'app-repair-request-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './repair-request-list.component.html',
  styleUrls: ['./repair-request-list.component.scss']
})
export class RepairRequestListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'sort', 'location', 'description', 'status', 'create_time', 'actions'];
  dataSource: RepairRequest[] = [];
  filteredData: RepairRequest[] = [];
  isLoading = true;
  filterValue = '';
  statusFilter = '';
  sortFilter = '';

  repairStatuses: RepairStatus[] = ['待處理', '處理中', '已完成', '已拒絕'];
  repairSorts = ['水電相關', '設備相關', '結構相關', '其他'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<RepairRequest>;

  constructor(
    private repairService: RepairRequestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadRepairRequests();
  }

  loadRepairRequests(): void {
    this.isLoading = true;
    this.repairService.getRepairRequests().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.filteredData = [...data];
        this.isLoading = false;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error fetching repair requests:', error);
        this.isLoading = false;
        this.showMessage('獲取維修申請列表失敗');
      }
    });
  }

  applyFilter(): void {
    let filtered = [...this.dataSource];
    
    // 文本過濾
    if (this.filterValue) {
      const filterText = this.filterValue.toLowerCase();
      filtered = filtered.filter(item => 
        item.description.toLowerCase().includes(filterText) ||
        item.location.toLowerCase().includes(filterText)
      );
    }
    
    // 狀態過濾
    if (this.statusFilter) {
      filtered = filtered.filter(item => item.status === this.statusFilter);
    }
    
    // 類型過濾
    if (this.sortFilter) {
      filtered = filtered.filter(item => item.sort === this.sortFilter);
    }
    
    this.filteredData = filtered;
  }

  resetFilters(): void {
    this.filterValue = '';
    this.statusFilter = '';
    this.sortFilter = '';
    this.applyFilter();
  }

  openEditDialog(repair: RepairRequest): void {
    const dialogRef = this.dialog.open(EditRepairDialogComponent, {
      width: '600px',
      data: { ...repair }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRepairRequests();
        this.showMessage('維修申請已更新');
      }
    });
  }

  updateStatus(request: RepairRequest, newStatus: RepairStatus): void {
    const updatedRequest = { ...request, status: newStatus };
    
    if (newStatus === '已完成') {
      updatedRequest.isRepaired = 1;
      updatedRequest.process_time = new Date().toISOString();
    }
    
    this.repairService.updateRepairRequest(request.id!, updatedRequest).subscribe({
      next: () => {
        const index = this.dataSource.findIndex(item => item.id === request.id);
        if (index !== -1) {
          this.dataSource[index] = updatedRequest;
          this.applyFilter();
        }
        this.showMessage(`維修申請狀態已更新為 ${newStatus}`);
      },
      error: (error) => {
        console.error('Error updating repair request:', error);
        this.showMessage('更新維修申請狀態失敗');
      }
    });
  }

  deleteRepairRequest(request: RepairRequest): void {
    if (confirm('確定要刪除這個維修申請嗎？')) {
      this.repairService.deleteRepairRequest(request.id!).subscribe({
        next: () => {
          this.loadRepairRequests();
          this.showMessage('維修申請已刪除');
        },
        error: (error) => {
          console.error('Error deleting repair request:', error);
          this.showMessage('刪除維修申請失敗');
        }
      });
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

  getSortClass(sort: string): string {
    switch (sort) {
      case '水電相關': return 'sort-utility';
      case '設備相關': return 'sort-equipment';
      case '結構相關': return 'sort-structure';
      case '其他': return 'sort-other';
      default: return '';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '未知';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '未知';
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('日期格式化錯誤:', error);
      return '未知';
    }
  }

  showMessage(message: string): void {
    this.snackBar.open(message, '關閉', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
