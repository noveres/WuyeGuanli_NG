import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpServiceService } from '../../services/http-service.service';

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
    MatButtonModule
  ],
  templateUrl: './fee-info.component.html',
  styleUrl: './fee-info.component.scss'
})
export class FeeInfoComponent implements OnInit, AfterViewInit {
  // 控制 checkbox 欄位的顯示與隱藏
  showCheckboxColumn = true;

  // 加入 select 列
  displayedColumns: string[] = ['select', 'address', 'year', 'season', 'fee', 'remark', 'modifying'];

  // 原始表格資料
  tableData: PeriodicElement[] = [];
  dataSource = new MatTableDataSource<PeriodicElement>([]);

  // 選擇模型
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private httpService: HttpServiceService) {}

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
          this.tableData = this.transformData(response);
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

        records.forEach((record: string) => {
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
              : '尚未更新'
          });
        });
      } catch (error) {
        console.error(`解析記錄錯誤: ${item.address}`, error);
      }
    });

    return result;
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
}