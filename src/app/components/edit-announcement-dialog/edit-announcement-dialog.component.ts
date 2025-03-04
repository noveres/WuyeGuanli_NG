import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Announcement } from '../../models/announcement.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-announcement-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
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
