import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-preview-announcement-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './preview-announcement-dialog.component.html',
  styleUrls: ['./preview-announcement-dialog.component.scss']
})
export class PreviewAnnouncementDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Announcement) {}
}
