import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { RepairRequest, RepairSort, RepairStatus } from '../../models/repair-request.model';
import { RepairRequestService } from '../../services/repair-request.service';
import { HttpServiceService } from '../../services/http-service.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    MatProgressBarModule
  ],
  templateUrl: './edit-repair-dialog.component.html',
  styleUrls: ['./edit-repair-dialog.component.scss']
})
export class EditRepairDialogComponent implements OnInit {
  repairForm: FormGroup;
  isSubmitting = false;
  isUploading = false;
  uploadProgress = 0;
  photo1Preview: string | null = null;
  photo2Preview: string | null = null;
  photo1File: File | null = null;
  photo2File: File | null = null;

  repairSorts: RepairSort[] = ['水電相關', '設備相關', '結構相關', '其他'];
  repairStatuses: RepairStatus[] = ['待處理', '處理中', '已完成', '已拒絕'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditRepairDialogComponent>,
    private repairService: RepairRequestService,
    private httpService: HttpServiceService,
    @Inject(MAT_DIALOG_DATA) public data: RepairRequest & { readonly?: boolean }
  ) {
    this.repairForm = this.fb.group({
      sort: [data.sort || '水電相關', Validators.required],
      location: [data.location || '', [Validators.required, Validators.minLength(2)]],
      description: [data.description || '', [Validators.required, Validators.maxLength(45)]],
      status: [data.status || '待處理'],
      photo1: [data.photo1 || ''],
      photo2: [data.photo2 || '']
    });

    if (data.readonly) {
      this.repairForm.disable();
    }

    // 如果有現有的照片，設置預覽
    if (data.photo1) {
      this.photo1Preview = this.httpService.getStaticUrl(data.photo1);
    }
    if (data.photo2) {
      this.photo2Preview = this.httpService.getStaticUrl(data.photo2);
    }
  }

  ngOnInit(): void {}

  onFileSelected(event: Event, photoField: 'photo1' | 'photo2'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        if (photoField === 'photo1') {
          this.photo1Preview = e.target.result;
          this.photo1File = file;
        } else {
          this.photo2Preview = e.target.result;
          this.photo2File = file;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  removePhoto(photoField: 'photo1' | 'photo2'): void {
    if (photoField === 'photo1') {
      this.photo1Preview = null;
      this.photo1File = null;
      this.repairForm.patchValue({ photo1: '' });
    } else {
      this.photo2Preview = null;
      this.photo2File = null;
      this.repairForm.patchValue({ photo2: '' });
    }
  }

  private uploadPhotos(): Observable<any> {
    const uploads = [];
    
    if (this.photo1File) {
      uploads.push(
        this.repairService.uploadPhoto(this.photo1File).pipe(
          switchMap(response => {
            this.repairForm.patchValue({ photo1: response.url });
            return of(response);
          })
        )
      );
    }
    
    if (this.photo2File) {
      uploads.push(
        this.repairService.uploadPhoto(this.photo2File).pipe(
          switchMap(response => {
            this.repairForm.patchValue({ photo2: response.url });
            return of(response);
          })
        )
      );
    }
    
    return uploads.length ? forkJoin(uploads) : of(null);
  }

  onSubmit(): void {
    if (this.repairForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.repairForm.value;

      // 先上傳照片（如果有的話）
      this.uploadPhotos().subscribe({
        next: () => {
          // 準備請求數據
          const repairRequest: RepairRequest = {
            ...formValue,
            isRepaired: formValue.status === '已完成' ? 1 : 0
          };

          // 發送請求
          const request = this.data.id
            ? this.repairService.updateRepairRequest(this.data.id, repairRequest)
            : this.repairService.createRepairRequest(repairRequest);

          request.subscribe({
            next: (response) => {
              this.dialogRef.close(response);
            },
            error: (error: HttpErrorResponse) => {
              console.error('提交報修請求失敗:', error);
              this.isSubmitting = false;
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('上傳照片失敗:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
