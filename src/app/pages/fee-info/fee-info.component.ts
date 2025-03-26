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
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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
          // 過濾掉包含 "nodisplay" 開始的整個門牌資料
          const filteredResponse = response.filter(item => {
            const records = JSON.parse(item.other);
            return !records.some((record: string) => record.startsWith('nodisplay'));
          });

          this.tableData = this.transformData(filteredResponse);
          this.dataSource.data = this.tableData;
        } else {
          console.error('伺服器回傳的資料格式不正確');
        }
        console.log('資料已成功獲取:', response);
      });
  }

  transformData(dbData: any[]): PeriodicElement[] {
    const result: PeriodicElement[] = [];

    dbData.forEach(item => {
      try {
        // 解析記錄
        const records = JSON.parse(item.other);

        // 過濾掉 "hide" 開始的子項目
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

  //匯出Excel功能
  exportToExcel(): void {
    try {
      // 取得當前過濾後的資料(考慮使用者可能已經套用了過濾器)
      const currentData = this.dataSource.filteredData.length > 0
        ? this.dataSource.filteredData
        : this.dataSource.data;

      // 轉換資料格式為Excel友好格式
      const excelData = currentData.map(item => {
        return {
          '門牌': item.address,
          '年度': item.year,
          '季': item.season,
          '是否繳清費用': item.fee,
          '備註': item.remark,
          '最後操作時間': item.modifying
        };
      });

      // 建立工作表
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // 建立活頁簿
      const workbook = XLSX.utils.book_new();

      // 產生檔案標題：使用查詢內容
      let sheetName = '費用資訊';

      // 組合查詢條件作為標題
      const queryParts = [];

      // 加入年季查詢條件
      if (this.yearSeasonFilterValue) {
        queryParts.push(`年季${this.yearSeasonFilterValue}`);
      }

      // 加入繳費狀態查詢條件
      if (this.feeStatusFilterValue) {
        queryParts.push(`繳清${this.feeStatusFilterValue}`);
      }

      // 加入模糊搜尋條件
      if (this.generalFilterValue) {
        queryParts.push(`搜尋${this.generalFilterValue}`);
      }

      // 如果有查詢條件，則將其組合成標題
      if (queryParts.length > 0) {
        sheetName = queryParts.join('_');
      }

      // 工作表標題最多只能有31個字元
      if (sheetName.length > 31) {
        sheetName = sheetName.substring(0, 28) + '...';
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // 生成檔案名稱 (使用查詢條件和當前日期時間)
      const date = new Date();
      const dateString = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;

      // 檔案名稱：使用查詢條件
      let fileName = '費用資訊';
      if (queryParts.length > 0) {
        fileName = queryParts.join('_');
      }

      // 檔案名稱加上日期
      fileName = `${fileName}_${dateString}.xlsx`;

      // 保存檔案
      XLSX.writeFile(workbook, fileName);

      alert('Excel檔案已成功匯出！');
    } catch (error) {
      console.error('匯出Excel時發生錯誤:', error);
      alert('匯出Excel時發生錯誤，請檢查控制台以獲取詳細資訊。');
    }
  }

  exportToPDF(): void {
    try {
      // 取得當前過濾後的資料
      const currentData = this.dataSource.filteredData.length > 0
        ? this.dataSource.filteredData
        : this.dataSource.data;

      // 建立PDF文件 (使用正確的jsPDF導入方式)
      const doc = new jsPDF('l', 'mm', 'a4'); // 橫向(landscape)格式

      // 設定中文字體支援
      // 注意：這裡使用預設字體，如果需要完整中文支援，可能需要額外導入字體

      // 設定PDF標題
      doc.setFontSize(16);
      doc.text('費用資訊表', 14, 15);
      doc.setFontSize(10);
      const today = new Date().toLocaleDateString('zh-TW');
      doc.text(`匯出日期: ${today}`, 14, 23);

      // 準備表格資料
      const tableColumn = ['門牌', '年度', '季', '是否繳清費用', '備註', '最後操作時間'];
      const tableRows = currentData.map(item => [
        item.address,
        item.year.toString(),
        item.season.toString(),
        item.fee,
        item.remark,
        item.modifying
      ]);

      // 使用正確的方式調用autoTable
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 40 }, // 門牌
          1: { cellWidth: 20 }, // 年度
          2: { cellWidth: 15 }, // 季
          3: { cellWidth: 25 }, // 是否繳清費用
          4: { cellWidth: 50 }, // 備註
          5: { cellWidth: 40 }  // 最後操作時間
        },
        // 增加一個表格標題
        didDrawPage: function (data: any) {
          // 可以在這裡添加頁碼等頁面信息
          doc.setFontSize(8);
        }
      });

      // 生成檔案名稱
      const date = new Date();
      const fileName = `費用資訊_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}.pdf`;

      // 保存PDF檔案到桌面
      doc.save(fileName);

      alert('PDF檔案已成功匯出！');
    } catch (error) {
      console.error('匯出PDF時發生錯誤:', error);
      alert('匯出PDF時發生錯誤，請檢查控制台以獲取詳細資訊。');
    }
  }
}