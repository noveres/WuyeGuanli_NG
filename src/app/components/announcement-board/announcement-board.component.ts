import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Announcement } from '../../models/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';
import { EditAnnouncementDialogComponent } from '../edit-announcement-dialog/edit-announcement-dialog.component';
import { PreviewAnnouncementDialogComponent } from '../preview-announcement-dialog/preview-announcement-dialog.component';

@Component({
  selector: 'app-announcement-board',
  templateUrl: './announcement-board.component.html',
  styleUrls: ['./announcement-board.component.scss']
})
export class AnnouncementBoardComponent implements OnInit {
  announcements: Announcement[] = [];

  constructor(private announcementService: AnnouncementService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe(data => {
      this.announcements = data;
    });
  }

  openEditDialog(announcement?: Announcement): void {
    const dialogRef = this.dialog.open(EditAnnouncementDialogComponent, {
      width: '600px',
      data: announcement || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAnnouncements();
      }
    });
  }

  openPreviewDialog(announcement: Announcement): void {
    this.dialog.open(PreviewAnnouncementDialogComponent, {
      width: '600px',
      data: announcement
    });
  }
}
