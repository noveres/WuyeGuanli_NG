import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpServiceService } from '../../services/http-service.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FeedialogComponent } from './feedialog/feedialog.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FloatButtonsComponent } from '../../components/float-buttons/float-buttons.component';
import { RouterOutlet } from '@angular/router';



// 自定義分頁器文字
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = '每頁顯示:';
}

// 表格顯示用介面
export interface PeriodicElement {
  address: string;
  year: number;
  season: number;
  fee: string;
  remark: string;
  modifying: string;
}

@Component({
  selector: 'app-fee-info',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    FloatButtonsComponent,
    // RouterOutlet,
  ],
  templateUrl: './fee-info.component.html',
  styleUrl: './fee-info.component.scss'
})
export class FeeInfoComponent implements OnInit, AfterViewInit {
  // 控制 checkbox 欄位的顯示與隱藏
  showCheckboxColumn = true;

  feeStatusFilterValue: string = '';

  // 加入 select 列
  displayedColumns: string[] = ['address', 'year', 'season', 'fee', 'remark', 'modifying'];

  // 原始表格資料
  tableData: PeriodicElement[] = [];
  dataSource = new MatTableDataSource<PeriodicElement>([]);

  // 搜尋值
  yearSeasonFilterValue: string = '';
  generalFilterValue: string = '';

  // 選擇模型
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private httpService: HttpServiceService,
    public dialog: MatDialog,
    private router: Router
  ) {
    // 設置自定義過濾器
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {
    this.fetchFeeData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // 從 API 獲取資料的方法
  fetchFeeData(): void {
    this.httpService.GetApi('http://localhost:8585/fee/getall')
      .pipe(
        catchError(error => {
          console.error('獲取資料時發生錯誤', error);
          return of([]);
        })
      )
      .subscribe((response: any) => {
        if (response && Array.isArray(response)) {
          // 過濾掉包含 "nodisplay" 開頭的整個門牌資料
          const filteredResponse = response.filter(item => {
            const records = JSON.parse(item.other);
            return !records.some((record: string) => record.startsWith('nodisplay'));
          });

          this.tableData = this.transformData(filteredResponse);
          this.dataSource.data = this.tableData;
        } else {
          console.error('伺服器回傳的資料格式不正確');
        }
      });
  }

  transformData(dbData: any[]): PeriodicElement[] {
    const result: PeriodicElement[] = [];

    dbData.forEach(item => {
      try {
        // 解析記錄
        const records = JSON.parse(item.other);

        // 過濾掉 "hide" 開頭的子項目
        const visibleRecords = records.filter((record: string) => !record.startsWith('hide'));

        visibleRecords.forEach((record: string) => {
          const year = parseInt(record.substring(0, 3));
          const season = parseInt(record.substring(3, 4));

          let fee = '';
          let remark = '';

          if (record.length > 4) {
            fee = record.substring(4, 5);

            if (record.length > 5) {
              remark = record.substring(5);
            }
          }

          result.push({
            address: item.address,
            year: year,
            season: season,
            fee: fee,
            remark: remark,
            // 使用 modifyingDate 欄位
            modifying: item.modifyingDate
              ? new Date(item.modifyingDate).toLocaleString()
              : '未知時間'
          });
        });
      } catch (error) {
        console.error(`解析記錄錯誤: ${item.address}`, error);
      }
    });

    return result;
  }


  applyFeeStatusFilter(event: any): void {
    this.feeStatusFilterValue = event.value;
    this.applyFilters();
  }
  // 創建自定義過濾器
  createFilter(): (data: PeriodicElement, filter: string) => boolean {
    return (data: PeriodicElement, filter: string): boolean => {
      // 解析過濾條件
      const searchTerms = JSON.parse(filter);

      // 檢查年季搜尋條件
      let yearSeasonMatch = true;
      if (searchTerms.yearSeason) {
        // 假設輸入格式為 "年度+季" 例如 "1141"
        if (searchTerms.yearSeason.length >= 3) {
          const yearPart = searchTerms.yearSeason.substring(0, searchTerms.yearSeason.length - 1);
          const seasonPart = searchTerms.yearSeason.substring(searchTerms.yearSeason.length - 1);

          const yearMatch = data.year.toString().includes(yearPart);
          const seasonMatch = data.season.toString() === seasonPart;

          yearSeasonMatch = yearMatch && seasonMatch;
        } else {
          // 如果輸入不足以構成年+季的格式，則只按照一般方式匹配
          yearSeasonMatch =
            data.year.toString().includes(searchTerms.yearSeason) ||
            data.season.toString().includes(searchTerms.yearSeason);
        }
      }

      // 檢查繳費狀態搜尋條件
      const feeStatusMatch = !searchTerms.feeStatus ||
        data.fee === searchTerms.feeStatus;

      // 檢查模糊搜尋條件
      const generalMatch = !searchTerms.general ||
        data.address.toLowerCase().includes(searchTerms.general) ||
        data.year.toString().includes(searchTerms.general) ||
        data.season.toString().includes(searchTerms.general) ||
        data.fee.toLowerCase().includes(searchTerms.general) ||
        data.remark.toLowerCase().includes(searchTerms.general) ||
        data.modifying.toLowerCase().includes(searchTerms.general);

      // 所有條件必須匹配
      return yearSeasonMatch && feeStatusMatch && generalMatch;
    };
  }

  // 套用年季搜尋過濾器
  applyYearSeasonFilter(event: Event): void {
    this.yearSeasonFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  // 套用模糊搜尋過濾器
  applyGeneralFilter(event: Event): void {
    this.generalFilterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  // 套用所有過濾器
  applyFilters(): void {
    const filterValue = JSON.stringify({
      yearSeason: this.yearSeasonFilterValue,
      feeStatus: this.feeStatusFilterValue,
      general: this.generalFilterValue
    });

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // 重置所有過濾器
  resetFilters(): void {
    this.yearSeasonFilterValue = '';
    this.feeStatusFilterValue = '';
    this.generalFilterValue = '';

    // 更新DOM中的輸入框值
    const yearSeasonInput = document.querySelector('#yearSeasonInput') as HTMLInputElement;
    const generalInput = document.querySelector('#generalInput') as HTMLInputElement;

    if (yearSeasonInput) yearSeasonInput.value = '';
    if (generalInput) generalInput.value = '';

    // 重要：觸發 mat-select 的變更檢測
    const event = new Event('selectionChange');
    this.applyFeeStatusFilter({ value: '' } as any);
    

    this.applyFilters();
  }

  /** 是否所有行都被選中 */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** 選擇/取消選擇所有行 */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** 獲取選中的行 */
  getSelectedItems(): PeriodicElement[] {
    return this.selection.selected;
  }

  /** 原始過濾方法 - 改為維持相容性 */
  applyFilter(event: Event): void {
    // 根據目標元素的ID決定要應用哪種過濾
    const target = event.target as HTMLInputElement;
    const id = target.id;

    if (id === 'yearSeasonInput') {
      this.applyYearSeasonFilter(event);
    } else if (id === 'generalInput') {
      this.applyGeneralFilter(event);
    } else {
      // 如果沒有ID或無法識別，則應用所有過濾條件
      const value = target.value.trim().toLowerCase();
      this.yearSeasonFilterValue = value;
      this.generalFilterValue = value;
      this.applyFilters();
    }
  }

  modifySelectedItems(): void {
    const selectedItems = this.getSelectedItems();
    console.log('選中的項目:', selectedItems);
    // 這裡添加修改邏輯
  }

  // 切換 checkbox 欄位的顯示與隱藏
  toggleCheckboxColumn(): void {
    this.showCheckboxColumn = !this.showCheckboxColumn;
    this.displayedColumns = this.showCheckboxColumn
      ? ['select', 'address', 'year', 'season', 'fee', 'remark', 'modifying']
      : ['address', 'year', 'season', 'fee', 'remark', 'modifying'];
  }

  openDialog() {
    setTimeout(() => {
      this.router.navigate(['/savetab']);
    }, 250);
  }
}