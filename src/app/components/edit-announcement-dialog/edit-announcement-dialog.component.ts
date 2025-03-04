import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-edit-announcement-dialog',
  templateUrl: './edit-announcement-dialog.component.html',
  styleUrls: ['./edit-announcement-dialog.component.scss']
})
export class EditAnnouncementDialogComponent {
  announcementForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditAnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement,
    private fb: FormBuilder
  ) {
    this.announcementForm = this.fb.group({
      title: [data.title || '', Validators.required],
      date: [data.date || '', Validators.required],
      content: [data.content || '', Validators.required],
      imageUrl: [data.imageUrl || '']
    });
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      this.dialogRef.close(this.announcementForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
