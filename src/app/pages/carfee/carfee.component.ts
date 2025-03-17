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
    FloatButtonsComponent
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



}