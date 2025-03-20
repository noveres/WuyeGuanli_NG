import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpServiceService } from '../../../services/http-service.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, finalize, of } from 'rxjs';

interface RentalItem {
  idrental: number;
  item: string;
  total: number;
  remark: string;
}

interface WhoRentalInfo {
  statusCode: number;
  message: string;
  idwhoRental: number;
  rentalWhat: string;
  accountRental: string;
  returnYorN: boolean;
  verify: boolean;
  changeTime: string;
  total: number;
  name: string;
}

@Component({
  selector: 'app-rental-by-who',
  templateUrl: './rental-by-who.component.html',
  styleUrls: ['./rental-by-who.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class RentalByWhoComponent implements OnInit {
  rentalItems: RentalItem[] = [];
  whoRentalList: WhoRentalInfo[] = [];
  selectedItem: string = '';
  accountRental: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  searchText: string = ''; // 新增全表格模糊搜尋用

  // Mat-table 相關
  displayedColumns: string[] = ['idwhoRental', 'rentalWhat', 'accountRental', 'name', 'changeTime', 'verify', 'returnYorN', 'actions'];
  dataSource = new MatTableDataSource<WhoRentalInfo>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private apiBaseUrl = 'http://localhost:8585/rental';

  constructor(private httpService: HttpServiceService) { }

  ngOnInit(): void {
    this.loadRentalItems();
    this.loadWhoRentalInfo();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSelectedItemText(): string {
    if (!this.selectedItem) return '請選擇物品';
    const item = this.rentalItems.find(i => i.item === this.selectedItem);
    if (item) {
      return `${item.item} (可用數量: ${this.getAvailableItemCount(item)})`;
    }
    return this.selectedItem;
  }

  // 新增的方法：計算可用數量（總數減去未歸還的數量）
  getAvailableItemCount(item: RentalItem): number {
    if (!item) return 0;

    // 計算特定物品的未歸還數量
    const unreturned = this.whoRentalList.filter(rental =>
      rental.rentalWhat === item.item && !rental.returnYorN
    ).length;

    // 可用數量 = 總數 - 未歸還數量
    return Math.max(0, item.total - unreturned);
  }

  loadRentalItems(): void {
    this.loading = true;
    this.httpService.GetApi<RentalItem[]>(`${this.apiBaseUrl}/getall`)
      .pipe(
        catchError(error => {
          console.error('載入租借物品失敗:', error);
          this.errorMessage = '載入租借物品失敗';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        this.rentalItems = response;
      });
  }

  loadWhoRentalInfo(): void {
    this.loading = true;
    this.httpService.GetApi<any>(`${this.apiBaseUrl}/whorentalallinfo`)
      .pipe(
        catchError(error => {
          console.error('載入租借記錄失敗:', error);
          this.errorMessage = '載入租借記錄失敗';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (Array.isArray(response)) {
          this.whoRentalList = response;
        } else if (response) {
          // 如果回應是單一物件，轉為陣列
          this.whoRentalList = [response];
        } else {
          this.whoRentalList = [];
        }

        // 更新 MatTableDataSource
        this.dataSource.data = this.whoRentalList;
      });
  }

  getWhoRentalById(id: number): void {
    this.loading = true;
    this.httpService.GetApi<WhoRentalInfo>(`${this.apiBaseUrl}/whorentalallinfo?idwho_rental=${id}`)
      .pipe(
        catchError(error => {
          console.error(`載入租借記錄 ID ${id} 失敗:`, error);
          this.errorMessage = `載入租借記錄 ID ${id} 失敗`;
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response) {
          // 尋找並更新清單中的項目，或新增如果不存在
          const index = this.whoRentalList.findIndex(item => item.idwhoRental === id);
          if (index !== -1) {
            this.whoRentalList[index] = response;
          } else {
            this.whoRentalList.push(response);
          }

          // 更新 MatTableDataSource
          this.dataSource.data = [...this.whoRentalList];
          this.successMessage = '刷新成功';
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
  }

  // 更新 - 更新歸還狀態的方法，確保所有欄位都被保留
  updateReturnStatus(id: number): void {
    const rentalItem = this.whoRentalList.find(item => item.idwhoRental === id);
    if (!rentalItem) {
      this.errorMessage = '找不到此租借記錄';
      return;
    }

    this.loading = true;
    // 把所有資料都帶回去，只更新 returnYorN 狀態
    const updateData = {
      idwhoRental: rentalItem.idwhoRental,
      rentalWhat: rentalItem.rentalWhat,
      accountRental: rentalItem.accountRental,
      returnYorN: !rentalItem.returnYorN,
      verify: rentalItem.verify,
      name: rentalItem.name
      // 不需要帶入 changeTime，讓系統自動更新
    };

    this.httpService.PostApi<any>(`${this.apiBaseUrl}/whorental`, updateData)
      .pipe(
        catchError(error => {
          console.error('更新歸還狀態失敗:', error);
          this.errorMessage = '更新歸還狀態失敗';
          this.successMessage = '';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response) {
          console.log('更新歸還狀態成功:', response);
          this.successMessage = '更新歸還狀態成功';
          this.errorMessage = '';

          // 更新本地資料
          const index = this.whoRentalList.findIndex(item => item.idwhoRental === id);
          if (index !== -1) {
            this.whoRentalList[index].returnYorN = !rentalItem.returnYorN;
            this.dataSource.data = [...this.whoRentalList];
          }

          // 3秒後清除成功訊息
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
  }

  // 使用PUT請求驗證租借
  verifyRental(id: number, inputAmount: string): void {
    if (!inputAmount) {
      this.errorMessage = '請輸入驗證碼';
      return;
    }

    const rentalItem = this.whoRentalList.find(item => item.idwhoRental === id);
    if (!rentalItem) {
      this.errorMessage = '找不到此租借記錄';
      return;
    }

    this.loading = true;

    // 使用 PUT 請求并使用 query 參數
    this.httpService.PutApi<any>(`${this.apiBaseUrl}/verify?idwho_rental=${id}&inputAmount=${inputAmount}`, null)
      .pipe(
        catchError(error => {
          console.error('驗證失敗:', error);
          this.errorMessage = '驗證失敗';
          this.successMessage = '';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response) {
          console.log('驗證成功:', response);
          this.successMessage = '驗證成功';
          this.errorMessage = '';
          this.loadWhoRentalInfo(); // 重新載入列表
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
  }

  addRental(): void {
    if (!this.selectedItem || !this.accountRental) {
      this.errorMessage = '請選擇租借物品並輸入帳號';
      return;
    }

    this.loading = true;
    const rentalData = {
      rentalWhat: this.selectedItem,
      accountRental: this.accountRental
    };

    this.httpService.PostApi<any>(`${this.apiBaseUrl}/whorental`, rentalData)
      .pipe(
        catchError(error => {
          console.error('租借失敗:', error);
          this.errorMessage = '租借失敗';
          this.successMessage = '';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(response => {
        if (response) {
          console.log('租借成功:', response);
          this.successMessage = '租借成功';
          this.errorMessage = '';
          this.loadWhoRentalInfo(); // 重新載入列表

          // 重設表單欄位
          this.selectedItem = '';
          this.accountRental = '';

          // 3秒後清除成功訊息
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
  }

  deleteRental(id: number): void {
    if (confirm('確定要刪除這筆租借記錄嗎？')) {
      this.loading = true;
      this.httpService.DeleteApi<any>(`${this.apiBaseUrl}/delete/whorental/${id}`)
        .pipe(
          catchError(error => {
            console.error(`刪除 ID ${id} 租借記錄失敗:`, error);
            this.errorMessage = '刪除失敗';
            this.successMessage = '';
            return of(null);
          }),
          finalize(() => this.loading = false)
        )
        .subscribe(response => {
          if (response !== null) {
            console.log('刪除成功:', response);
            this.successMessage = '刪除成功';
            this.errorMessage = '';

            // 從本地陣列移除
            this.whoRentalList = this.whoRentalList.filter(item => item.idwhoRental !== id);

            // 更新 MatTableDataSource
            this.dataSource.data = [...this.whoRentalList];

            // 3秒後清除成功訊息
            setTimeout(() => this.successMessage = '', 3000);
          }
        });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW');
  }

  // 用於 mat-table 全域搜尋
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // 刷新當前頁面的方法
  refreshPage(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // 重新載入租借物品和租借記錄
    this.loadRentalItems();
    this.loadWhoRentalInfo();

    this.successMessage = '頁面已刷新';
    setTimeout(() => this.successMessage = '', 3000);
  }

}