import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

// 自定義分頁器文字
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = '每頁顯示:';
}

// 資料庫表結構
interface DatabaseRecord {
  address: string;
  other: string;
  modifying:string;
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

// 模擬從資料庫獲取的原始數據
const DB_DATA: DatabaseRecord[] = [
  {
    address: 'A01',
    other: '["1133否","1134是","1141是","1142是"]',
    modifying:'2025-05-02'
  },
  {
    address: 'A02',
    other: '["1134是","1141是","1142是"]',
    modifying:'2025-05-02'
  },
  {
    address: 'B01',
    other: '["1134是","1141是","1142否只繳一半"]',
    modifying:'2025-05-02'
  }
];

// 轉換資料庫數據為表格可用格式
function transformData(dbData: DatabaseRecord[]): PeriodicElement[] {
  const result: PeriodicElement[] = [];

  dbData.forEach(item => {
    try {
      // 將 other 解析為 JSON 數組
      const records = JSON.parse(item.other);

      // 處理每條記錄
      records.forEach((record: string) => {
        // 解析記錄
        const year = parseInt(record.substring(0, 3));
        const season = parseInt(record.substring(3, 4));

        let fee = '';
        let remark = '';

        // 檢查是否有繳費狀態
        if (record.length > 4) {
          fee = record.substring(4, 5);

          // 檢查是否有備註
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
          modifying:item.modifying,
        });
      });
    } catch (error) {
      console.error(`解析記錄錯誤: ${item.address}`, error);
    }
  });

  return result;
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
  displayedColumns: string[] = ['select', 'address', 'year', 'season', 'fee', 'remark','modifying'];

  // 轉換數據並創建數據源
  tableData = transformData(DB_DATA);
  dataSource = new MatTableDataSource<PeriodicElement>(this.tableData);

  // 選擇模型
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // 初始化组件
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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

  modifySelectedItems(): void { //綁update 看update API如何呈現再說 
    const selectedItems = this.getSelectedItems();
    console.log('選中的項目:', selectedItems);
    // 這裡添加修改邏輯
  }

  // 切換 checkbox 欄位的顯示與隱藏
  toggleCheckboxColumn(): void {
    this.showCheckboxColumn = !this.showCheckboxColumn;
    this.displayedColumns = this.showCheckboxColumn
      ? ['select', 'address', 'year', 'season', 'fee', 'remark','modifying']
      : ['address', 'year', 'season', 'fee', 'remark','modifying'];
  }
}
