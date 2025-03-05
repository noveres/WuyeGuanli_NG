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

import { Announcement } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';

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
    MatSelectModule
  ],
  templateUrl: './edit-announcement-dialog.component.html',
  styleUrls: ['./edit-announcement-dialog.component.scss']
})
export class EditAnnouncementDialogComponent {
  announcementForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
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
          // 這裡可以添加錯誤處理，比如顯示錯誤訊息
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
      // 這裡可以添加圖片上傳邏輯
      // 暫時使用本地 URL 預覽
      const reader = new FileReader();
      reader.onload = () => {
        this.announcementForm.patchValue({
          imageUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.announcementForm.patchValue({
      imageUrl: ''
    });
  }
}
