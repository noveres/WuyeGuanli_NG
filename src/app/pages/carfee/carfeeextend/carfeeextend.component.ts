import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpServiceService } from '../../../services/http-service.service';

interface ReceiveAccount {
  receiveMoneyAccount: string;
  receive: number;
  remark: string;
  timeOfReceivingMoney: string;
  sendMoneyAccount: string;
  addressRemark: string;
  feeforRemark: string;
}

interface ApiResponse {
  records: ReceiveAccount[];
  success: boolean;
}

@Component({
  selector: 'app-carfeeextend',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './carfeeextend.component.html',
  styleUrl: './carfeeextend.component.scss'
})
export class CarfeeextendComponent implements OnInit {
  displayedColumns: string[] = ['select','feeforRemark', 'addressRemark', 'receive', 'sendMoneyAccount',
     'timeOfReceivingMoney', 'remark', 'receiveMoneyAccount'];
  dataSource: MatTableDataSource<ReceiveAccount> = new MatTableDataSource<ReceiveAccount>([]);
  selection = new SelectionModel<ReceiveAccount>(true, []);
  originalData: ReceiveAccount[] = [];

  // 搜尋條件
  filterValues: { [key: string]: string } = {
    addressRemark: '',
    sendMoneyAccount: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const url = 'http://localhost:8585/money/searchreceiveacc?receive_money_account=102420484096';
    this.httpService.GetApi<ApiResponse>(url).subscribe({
      next: (response) => {
        if (response.success) {
          this.originalData = response.records;
          this.dataSource = new MatTableDataSource(response.records);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.setupCustomFilter();

          // 監聽過濾器變化，重置選擇
          this.dataSource.connect().subscribe(() => {
            this.selection.clear();
          });
        }
      },
      error: (error) => {
        console.error('獲取資料失敗:', error);
      }
    });
  }

  // 設置自定義過濾邏輯
  setupCustomFilter(): void {
    this.dataSource.filterPredicate = (data: ReceiveAccount, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return Object.keys(searchTerms).every(key => {
        if (!searchTerms[key]) return true;
        return data[key as keyof ReceiveAccount]
          .toString()
          .toLowerCase()
          .includes(searchTerms[key].toLowerCase());
      });
    };
  }

  // 應用過濾器
  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues[column] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // 清除選擇，因為過濾條件已變更
    this.selection.clear();
  }

  // 勾選功能 - 修改為只考慮過濾後的資料
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows && numRows > 0;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    // 只選擇過濾後的資料
    this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  // 計算已選擇項目的總金額
  calculateSelectedTotal(): number {
    return this.selection.selected.reduce((total, item) => total + item.receive, 0);
  }

  // 獲取已選擇項目的數量
  getSelectedItemsCount(): number {
    return this.selection.selected.length;
  }
}