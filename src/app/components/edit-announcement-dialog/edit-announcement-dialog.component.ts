import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { Announcement } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-edit-announcement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatProgressBarModule
  ],
  templateUrl: './edit-announcement-dialog.component.html',
  styleUrls: ['./edit-announcement-dialog.component.scss']
})
export class EditAnnouncementDialogComponent {
  announcementForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  uploadedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private fileUploadService: FileUploadService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditAnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Announcement>
  ) {
    this.announcementForm = this.fb.group({
      title: [data.title || '', Validators.required],
      date: [data.date || new Date(), Validators.required],
      type: [data.type || '水電相關', Validators.required],
      content: [data.content || '', Validators.required],
      imageUrl: [data.imageUrl || '']
    });

    // 如果有現有的圖片URL，保存文件名
    if (data.imageUrl) {
      this.uploadedFileName = this.extractFileNameFromUrl(data.imageUrl);
    }
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      const announcement = {
        ...this.data,
        ...this.announcementForm.value
      };

      const operation = announcement.id
        ? this.announcementService.updateAnnouncement(announcement)
        : this.announcementService.createAnnouncement(announcement);

      operation.subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('保存公告失敗:', error);
          this.showMessage('保存公告失敗，請稍後再試');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // 檢查文件類型
      if (!file.type.startsWith('image/')) {
        this.showMessage('請選擇圖片文件');
        return;
      }

      // 檢查文件大小（限制為 5MB）
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('圖片大小不能超過 5MB');
        return;
      }

      this.selectedFile = file;
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    this.fileUploadService.uploadImage(this.selectedFile)
      .pipe(
        finalize(() => {
          this.isUploading = false;
          this.selectedFile = null;
        })
      )
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const response = event.body;
            if (response && response.fileName) {
              this.uploadedFileName = response.fileName;
              const imageUrl = this.fileUploadService.getImageUrl(response.fileName);
              this.announcementForm.patchValue({ imageUrl });
              this.showMessage('圖片上傳成功');
            }
          }
        },
        error: (err) => {
          console.error('圖片上傳失敗:', err);
          this.showMessage('圖片上傳失敗，請稍後再試');
        }
      });
  }

  removeImage(): void {
    // 如果有已上傳的文件名，嘗試從服務器刪除
    if (this.uploadedFileName) {
      this.fileUploadService.deleteImage(this.uploadedFileName).subscribe({
        next: () => {
          this.showMessage('圖片已刪除');
        },
        error: (err) => {
          console.error('刪除圖片失敗:', err);
          // 即使刪除失敗，也清除表單中的圖片URL
        }
      });
    }

    this.uploadedFileName = '';
    this.announcementForm.patchValue({
      imageUrl: ''
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, '關閉', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  private extractFileNameFromUrl(url: string): string {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
