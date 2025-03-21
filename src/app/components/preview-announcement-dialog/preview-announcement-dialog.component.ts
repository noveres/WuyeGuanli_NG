import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-preview-announcement-dialog',
  templateUrl: './preview-announcement-dialog.component.html',
  styleUrls: ['./preview-announcement-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class PreviewAnnouncementDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PreviewAnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  getTypeClass(type: string): string {
    switch (type) {
      case '水電相關':
        return 'utility';
      case '住戶相關':
        return 'resident';
      case '維修相關':
        return 'maintenance';
      default:
        return 'other';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case '水電相關':
        return 'water_drop';
      case '住戶相關':
        return 'people';
      case '維修相關':
        return 'build';
      default:
        return 'info';
    }
  }

  openImagePreview(imageUrl: string): void {
    window.open(imageUrl, '_blank');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
