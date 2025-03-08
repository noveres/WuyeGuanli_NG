import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { RepairService } from '../../services/repair.service';
import { RepairRequest, RepairSort, RepairStatus } from '../../models/repair-request.model';

@Component({
  selector: 'app-repair-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatCardModule,
    MatDividerModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [RepairService],
  templateUrl: './repair-request-form.component.html',
  styleUrls: ['./repair-request-form.component.scss']
})
export class RepairRequestFormComponent implements OnInit {
  repairForm!: FormGroup;
  isSubmitting = false;
  isUploading = false;
  uploadProgress = 0;
  photo1Preview: string | null = null;
  photo2Preview: string | null = null;
  showPreview: boolean = false;
  
  repairSorts: RepairSort[] = ['水電相關', '設備相關', '結構相關', '其他'];
  
  constructor(
    private fb: FormBuilder,
    private repairService: RepairService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.repairForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(200)]],
      sort: ['水電', Validators.required],
      location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      photo1: [''],
      photo2: ['']
    });
  }

  onSubmit(): void {
    if (this.repairForm.invalid) {
      return;
    }

    const formValue = this.repairForm.value;
    const repairRequest: RepairRequest = {
      description: formValue.description,
      sort: formValue.sort,
      location: formValue.location,
      photo1: formValue.photo1 || '',
      photo2: formValue.photo2 || '',
      isRepaired: 0,
      status: '待處理' as RepairStatus
    };

    this.repairService.createRepairRequest(repairRequest).subscribe({
      next: (response) => {
        this.showMessage('維修申請已提交成功');
        this.resetForm();
      },
      error: (error: any) => {
        this.showMessage('提交維修申請時發生錯誤，請稍後再試');
        console.error('Error creating repair request:', error);
      }
    });
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
        this.showMessage('圖片上傳失敗，請稍後再試');
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

  resetForm(): void {
    this.repairForm.reset({
      sort: '水電',
      location: '',
      description: '',
      photo1: null,
      photo2: null
    });
    this.photo1Preview = null;
    this.photo2Preview = null;
    this.showPreview = false;
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  getSortClass(sort: string): string {
    switch (sort) {
      case '水電相關': return 'type-utility';
      case '設備相關': return 'type-resident';
      case '結構相關': return 'type-maintenance';
      case '其他': return 'type-other';
      default: return '';
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, '關閉', { duration: 3000 });
  }
}
