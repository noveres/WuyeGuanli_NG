import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RepairRequest } from '../../models/repair-request.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-preview-repair-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './preview-repair-dialog.component.html',
  styleUrls: ['./preview-repair-dialog.component.scss']
})
export class PreviewRepairDialogComponent implements OnInit {
  apiUrl = environment.apiUrl || 'http://localhost:8585';

  constructor(
    public dialogRef: MatDialogRef<PreviewRepairDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RepairRequest
  ) {}

  ngOnInit(): void {
    console.log('預覽維修請求:', this.data);
    if (this.data.photo1) {
      console.log('照片1 URL:', this.getImageUrl(this.data.photo1));
    }
    if (this.data.photo2) {
      console.log('照片2 URL:', this.getImageUrl(this.data.photo2));
    }
    console.log('API URL:', this.apiUrl);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.error('圖片載入失敗:', img.src);
  }

  getImageUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return 'http://localhost:8585' + url;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // 格式化為 YYYY-MM-DD HH:mm:ss
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('日期格式化錯誤:', error);
      return '';
    }
  }
}
