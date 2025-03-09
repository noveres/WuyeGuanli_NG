import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

interface Rental {
  idrental?: number;
  item: string;
  total: number;
  remark: string;
}

@Component({
  selector: 'app-rental-dialog',
  templateUrl: './rental-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RentalDialogComponent {
  rentalForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RentalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Rental
  ) {
    this.isEdit = !!data.idrental;

    this.rentalForm = this.fb.group({
      idrental: [data.idrental],
      item: [data.item, [Validators.required]],
      total: [data.total, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      remark: [data.remark]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.rentalForm.valid) {
      this.dialogRef.close(this.rentalForm.value);
    }
  }
}
