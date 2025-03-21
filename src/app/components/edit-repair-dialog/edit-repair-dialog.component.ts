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
import { FileUploadService } from '../../services/file-upload.service';

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
  repairStatuses: RepairStatus[] = ['待處理', '處理中', '已完成'];
  repairLocations: string[] = [
    'B2 停車場',
    'B1 倉庫',
    '1F 大廳廁所',
    '1F 大廳走廊',
    '2F 員工廁所',
    '2F 會議室',
    '3F 辦公室區域',
    '3F 走廊',
    '4F 員工廁所',
    '4F 樓梯間',
    '5F 辦公室區域',
    '5F 會議室',
    '5F 員工休息區',
    '5F 空調機房',
    '5F 電梯機房',
    '5F 露天平台'
  ];
  repairDescriptions: string[] = [
    '水管漏水',
    '馬桶堵塞',
    '水龍頭壞掉',
    '燈不亮',
    '電梯故障',
    '門鎖損壞',
    '玻璃破裂',
    '牆壁剝落',
    '空調異常',
    '電線外露',
    '地板破損',
    '電路故障',
    '設備故障',
    '牆面/地面損壞',
    '門窗問題',
    '其他'
  ];

  constructor(
    private fb: FormBuilder,
    private repairService: RepairService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditRepairDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<RepairRequest>
  ) {
    this.repairForm = this.fb.group({
      description: [data.description || '', [Validators.required]],
      location: [data.location || '', [Validators.required]],
      sort: [data.sort || '水電相關', Validators.required],
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

    this.repairService.uploadPhoto(file)
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.isUploading = false;
          }, 500);
        })
      )
      .subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            // 更新上傳進度
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            // 上傳完成
            this.uploadProgress = 100;
            
            if (event.body && event.body.fileName) {
              // 從 FileUploadService 獲取圖片URL
              const fileName = event.body.fileName;
              const imageUrl = this.repairService['fileUploadService'].getImageUrl(fileName);
              const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:8585${imageUrl}`;
              
              // 更新表單值和預覽
              this.repairForm.patchValue({ [photoField]: fullImageUrl });
              
              if (photoField === 'photo1') {
                this.photo1Preview = fullImageUrl;
              } else {
                this.photo2Preview = fullImageUrl;
              }
              
              this.showMessage('圖片上傳成功');
            }
          }
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

  getRepairSortIcon(sort: string): string {
    switch (sort) {
      case '水電相關':
        return 'water_drop';
      case '設備相關':
        return 'build';
      case '結構相關':
        return 'architecture';
      default:
        return 'more_horiz';
    }
  }

  getDescriptionIcon(description: string): string {
    switch (description) {
      case '水管漏水':
      case '馬桶堵塞':
      case '水龍頭壞掉':
        return 'water_drop';
      case '燈不亮':
      case '電線外露':
      case '電路故障':
        return 'electrical_services';
      case '電梯故障':
        return 'elevator';
      case '門鎖損壞':
      case '門窗問題':
        return 'door_front';
      case '玻璃破裂':
      case '牆壁剝落':
      case '地板破損':
      case '牆面/地面損壞':
        return 'window';
      case '空調異常':
        return 'ac_unit';
      case '設備故障':
        return 'build';
      default:
        return 'warning';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case '待處理':
        return 'schedule';
      case '處理中':
        return 'engineering';
      case '已完成':
        return 'check_circle';
      case '已拒絕':
        return 'cancel';
      default:
        return 'help';
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, '關閉', { duration: 3000 });
  }
}
