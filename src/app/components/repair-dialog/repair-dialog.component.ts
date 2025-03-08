import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RepairRequest } from '../../models/repair-request.model';
import { RepairService } from '../../services/repair.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-repair-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  providers: [RepairService],
  templateUrl: './repair-dialog.component.html',
  styleUrls: ['./repair-dialog.component.scss']
})
export class RepairDialogComponent {
  repairForm: FormGroup;
  isSubmitting = false;
  isUploading = false;
  uploadProgress = 0;
  photo1Preview: string | null = null;
  photo2Preview: string | null = null;
  
  repairSorts: string[] = ['水電相關', '設備相關', '結構相關', '其他'];
  repairStatuses: string[] = ['待處理', '處理中', '已完成', '已拒絕'];

  constructor(
    private fb: FormBuilder,
    private repairService: RepairService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<RepairDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RepairRequest
  ) {
    this.repairForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(200)]],
      location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      sort: ['水電', Validators.required],
      status: ['待處理', Validators.required],
      photo1: [''],
      photo2: ['']
    });
    
    // 如果是編輯模式，填充表單
    if (this.data && this.data.id) {
      this.repairForm.patchValue({
        description: this.data.description || '',
        location: this.data.location || '',
        sort: this.data.sort || '水電',
        status: this.data.status || '待處理',
        photo1: this.data.photo1 || '',
        photo2: this.data.photo2 || ''
      });

      // 設置圖片預覽
      if (this.data.photo1) {
        this.photo1Preview = this.data.photo1;
      }
      
      if (this.data.photo2) {
        this.photo2Preview = this.data.photo2;
      }
    }
  }

  onSubmit(): void {
    if (this.repairForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    
    const formValue = this.repairForm.value;
    const repairRequest: RepairRequest = {
      ...this.data,
      description: formValue.description,
      location: formValue.location,
      sort: formValue.sort,
      status: formValue.status,
      photo1: formValue.photo1,
      photo2: formValue.photo2,
      isRepaired: formValue.status === '已完成' ? 1 : 0
    };

    // 如果有 ID 則更新，否則創建新的
    const operation = this.data?.id
      ? this.repairService.updateRepairRequest(repairRequest)
      : this.repairService.createRepairRequest(repairRequest);

    operation.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.snackBar.open('維修申請已保存', '關閉', { duration: 3000 });
        this.dialogRef.close(response);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('保存維修申請時發生錯誤', error);
        this.snackBar.open('保存維修申請時發生錯誤', '關閉', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event, photoField: 'photo1' | 'photo2'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('請選擇圖片文件', '關閉', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    // 模擬上傳進度
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      }
    }, 200);

    this.repairService.uploadPhoto(file).subscribe({
      next: (response: { url: string }) => {
        this.isUploading = false;
        this.uploadProgress = 100;
        
        // 更新表單值和預覽
        this.repairForm.patchValue({ [photoField]: response.url });
        
        if (photoField === 'photo1') {
          this.photo1Preview = URL.createObjectURL(file);
        } else {
          this.photo2Preview = URL.createObjectURL(file);
        }
        
        this.snackBar.open('圖片上傳成功', '關閉', { duration: 3000 });
      },
      error: (error: any) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        console.error('圖片上傳失敗', error);
        this.snackBar.open('圖片上傳失敗', '關閉', { duration: 3000 });
      }
    });
  }

  removePhoto(photoField: 'photo1' | 'photo2'): void {
    this.repairForm.patchValue({ [photoField]: '' });
    
    if (photoField === 'photo1') {
      this.photo1Preview = null;
    } else {
      this.photo2Preview = null;
    }
  }
}
