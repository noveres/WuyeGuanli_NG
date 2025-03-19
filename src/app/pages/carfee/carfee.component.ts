import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CarfeeService } from '../../services/carfee.service';
import { Service } from '../../services/service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CarfeechartComponent } from './carfeechart/carfeechart.component';
import { FloatButtonsComponent } from '../../components/float-buttons/float-buttons.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-carfee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule,
    CarfeechartComponent,
    FloatButtonsComponent,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './carfee.component.html',
  styleUrls: ['./carfee.component.scss']
})
export class CarfeeComponent implements OnInit, AfterViewInit {
  // 定義表格列
  displayedColumns: string[] = ['parking', 'owner', 'parkingFee', 'paid', 'receive', 'sendMoneyAccount', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  feeForm!: FormGroup;
  isEditing = false;
  currentItem: any = null;

  currentYear: number = new Date().getFullYear();  // 取得當前年份
  inputText: string = (this.currentYear + 1).toString();  // 預設為當前年份加1作為輸入框的預設值
  editableText: string = '年 停車費用管理';  // 可編輯文字內容


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  constructor(
    private carfeeService: CarfeeService,
    private service: Service,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.initForm();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // 初始化表單
  initForm(): void {
    this.feeForm = this.fb.group({
      parking: ['', Validators.required],
      parkingFee: [0, [Validators.required, Validators.min(0)]],
      owner: ['', Validators.required],
      paid: [false]
    });
  }

  // 載入資料
  loadData(): void {
    this.carfeeService.getAllFees().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('載入資料失敗', error);
        this.snackBar.open('載入資料失敗', '關閉', { duration: 3000 });
      }
    });
  }

  onInputChange(): void {
    // 當使用者更改了輸入框的值，這裡可以進行進一步處理
    console.log("當前輸入值:", this.inputText);
  }

  onEditableTextChange(event: Event): void {
    const target = event.target as HTMLElement;
    this.editableText = target.innerText;  // 這裡捕捉到用戶修改的文字
    console.log("可編輯文字內容:", this.editableText);
  }

  // 打開新增對話框
  openAddDialog(): void {
    this.isEditing = false;
    this.feeForm.reset({
      parking: '',
      parkingFee: 0,
      owner: '',
      paid: false
    });
    this.dialog.open(this.dialogTemplate);
  }

  // 編輯項目
  editItem(item: any): void {
    this.isEditing = true;
    this.currentItem = item;
    this.feeForm.patchValue({
      parking: item.parking,
      parkingFee: item.parkingFee,
      owner: item.owner,
      paid: item.paid
    });
    this.dialog.open(this.dialogTemplate);
  }

  // 刪除項目
  deleteItem(parking: string): void {
    if (confirm(`確定要刪除 ${parking} 的資料嗎？`)) {
      this.carfeeService.deleteFee(parking).subscribe({
        next: () => {
          this.snackBar.open('刪除成功', '關閉', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          console.error('刪除失敗', error);
          this.snackBar.open('刪除失敗', '關閉', { duration: 3000 });
        }
      });
    }
  }

  // 儲存項目（新增或更新）
  saveItem(): void {
    if (this.feeForm.valid) {
      const formData = this.feeForm.value;

      this.carfeeService.saveOrUpdateFee(formData).subscribe({
        next: () => {
          this.snackBar.open(this.isEditing ? '更新成功' : '新增成功', '關閉', { duration: 3000 });
          this.dialog.closeAll();
          this.loadData();
        },
        error: (error) => {
          console.error('儲存失敗', error);
          this.snackBar.open('儲存失敗', '關閉', { duration: 3000 });
        }
      });
    }
  }

  // 取消對話框
  cancelDialog(): void {
    this.dialog.closeAll();
  }

  // 更新付款狀態
  updatePaidStatus(): void {
    this.carfeeService.updatePaidStatus().subscribe({
      next: () => {
        this.snackBar.open('付款狀態更新成功', '關閉', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('更新付款狀態失敗', error);
        this.snackBar.open('更新付款狀態失敗', '關閉', { duration: 3000 });
      }
    });
  }

  // 匯出Excel功能
  exportToExcel(): void {
    try {
      // 取得當前資料
      const currentData = this.dataSource.data;
      
      // 取得標題文字 (結合輸入框和可編輯文字)
      let title = this.inputText + this.editableText;
      
      // 轉換資料格式為Excel友好格式
      const excelData = currentData.map(item => {
        return {
          '停車位': item.parking,
          '擁有者': item.owner,
          '停車費(年費)': item.parkingFee,
          '全繳清狀態': item.paid ? '是' : '否',
          '總共支付金額': item.receive || 'N/A',
          '付款帳號': item.sendMoneyAccount || '尚無付款'
        };
      });
      
      // 建立工作表
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // 建立活頁簿
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '停車費用');
      
      // 使用標題作為檔名 (移除空格和特殊字符)
      const fileName = `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`;
      
      // 保存檔案
      XLSX.writeFile(workbook, fileName);
      
      this.snackBar.open('Excel檔案已成功匯出！', '關閉', { duration: 3000 });
    } catch (error) {
      console.error('匯出Excel時發生錯誤:', error);
      this.snackBar.open('匯出Excel時發生錯誤', '關閉', { duration: 3000 });
    }
  }
}