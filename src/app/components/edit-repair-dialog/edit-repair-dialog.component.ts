import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HttpEventType, HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { RepairRequest, RepairSort, RepairStatus } from '../../models/repair-request.model';
import { RepairService } from '../../services/repair.service';

@Component({
  selector: 'app-edit-repair-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  templateUrl: './edit-repair-dialog.component.html',
  styleUrls: ['./edit-repair-dialog.component.scss']
})
export class EditRepairDialogComponent {
  repairForm: FormGroup;
  isSubmitting = false;
  isUploading = false;
  uploadProgress = 0;
  photo1Preview: string | null = null;
  photo2Preview: string | null = null;
  
  repairSorts: RepairSort[] = ['水電相關', '設備相關', '結構相關', '其他'];
  repairStatuses: RepairStatus[] = ['待處理', '處理中', '已完成', '已拒絕'];

  constructor(
    private fb: FormBuilder,
    private repairService: RepairService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditRepairDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<RepairRequest>
  ) {
    this.repairForm = this.fb.group({
      description: [data.description || '', [Validators.required, Validators.maxLength(200)]],
      location: [data.location || '', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sort: [data.sort || '水電', Validators.required],
      photo1: [data.photo1 || ''],
      photo2: [data.photo2 || ''],
      status: [data.status || '待處理']
    });

    // 如果有現有的照片，設置預覽
    if (data.photo1) {
      this.photo1Preview = data.photo1;
    }
    if (data.photo2) {
      this.photo2Preview = data.photo2;
    }
  }

  onSubmit(): void {
    if (this.repairForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    
    const formValue = this.repairForm.value;
    const repairRequest: RepairRequest = {
      ...this.data as RepairRequest,
      description: formValue.description,
      location: formValue.location,
      sort: formValue.sort,
      status: formValue.status,
      photo1: formValue.photo1,
      photo2: formValue.photo2,
      isRepaired: formValue.status === '已完成' ? 1 : 0
    };

    const operation = repairRequest.id
      ? this.repairService.updateRepairRequest(repairRequest)
      : this.repairService.createRepairRequest(repairRequest);

    operation.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showMessage('維修申請已保存');
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('保存維修申請時發生錯誤', error);
        this.showMessage('保存維修申請時發生錯誤');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onFileSelected(event: Event, photoField: 'photo1' | 'photo2'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.showMessage('請選擇圖片文件');
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
        
        // 更新表單值和預覽，使用後端返回的URL
        this.repairForm.patchValue({ [photoField]: response.url });
        
        // 使用後端返回的URL來預覽圖片
        if (photoField === 'photo1') {
          this.photo1Preview = response.url;
        } else {
          this.photo2Preview = response.url;
        }
        
        this.showMessage('圖片上傳成功');
      },
      error: (error: any) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        console.error('圖片上傳失敗', error);
        this.showMessage('圖片上傳失敗');
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

  private showMessage(message: string): void {
    this.snackBar.open(message, '關閉', { duration: 3000 });
  }
}
