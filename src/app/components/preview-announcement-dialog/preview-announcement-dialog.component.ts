import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-preview-announcement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './preview-announcement-dialog.component.html',
  styleUrls: ['./preview-announcement-dialog.component.scss']
})
export class PreviewAnnouncementDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PreviewAnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
