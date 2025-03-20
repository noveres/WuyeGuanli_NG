import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RentalDialogComponent } from './rental-dialog/rental-dialog.component';
import { HttpServiceService } from '../../services/http-service.service';
import { RentalByWhoComponent } from './rental-by-who/rental-by-who.component';

interface RentalResponse {
  statusCode: number;
  message: string;
  data: Rental[];
}

interface Rental {
  idrental: number;
  item: string;
  total: number;
  remark: string;
  showActions?: boolean;
}

@Component({
  selector: 'app-rental-info',
  templateUrl: './rental-info.component.html',
  styleUrl: './rental-info.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RentalByWhoComponent,
  ]
})
export class RentalInfoComponent implements OnInit {
  // 從顯示欄位中移除 idrental，但仍在資料中保留
  // 添加一個新的列 'actionToggle' 用於操作開關
  displayedColumns: string[] = ['item', 'total', 'remark', 'operations', 'actionToggle'];
  dataSource = new MatTableDataSource<Rental>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private httpService: HttpServiceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadRentals();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRentals() {
    this.httpService.GetApi<Rental[]>('http://localhost:8585/rental/getall').subscribe({
      next: (data) => {
        const dataWithActionState = data.map(item => ({
          ...item,
          showActions: false
        }));
        this.dataSource.data = dataWithActionState;
      },
      error: (error) => {
        console.error('獲取租賃數據失敗:', error);
      }
    });
  }

  toggleActions(rental: Rental) {
    rental.showActions = !rental.showActions;
  }

  deleteRental(id: number) {
    if (confirm('確定要刪除此筆租賃記錄嗎？')) {
      this.httpService.DeleteApi<any>(`http://localhost:8585/rental/delete/${id}`).subscribe({
        next: () => {
          console.log('成功刪除租賃記錄');
          this.loadRentals();
        },
        error: (error) => {
          console.error('刪除租賃記錄失敗:', error);
        }
      });
    }
  }

  openDialog(rental?: Rental) {
    const dialogRef = this.dialog.open(RentalDialogComponent, {
      width: '500px',
      data: rental ? { ...rental } : { item: '', total: 0, remark: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.idrental) {
          this.updateRental(result);
        } else {
          this.addRental(result);
        }
      }
    });
  }

  addRental(rental: Rental) {
    this.httpService.PostApi<any>('http://localhost:8585/rental/add', rental).subscribe({
      next: () => {
        console.log('成功添加租賃記錄');
        this.loadRentals();
      },
      error: (error) => {
        console.error('添加租賃記錄失敗:', error);
      }
    });
  }

  updateRental(rental: Rental) {
    this.httpService.PostApi<any>('http://localhost:8585/rental/add', rental).subscribe({
      next: () => {
        console.log('成功更新租賃記錄');
        this.loadRentals();
      },
      error: (error) => {
        console.error('更新租賃記錄失敗:', error);
      }
    });
  }
}
