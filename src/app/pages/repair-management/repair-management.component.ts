import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { RepairRequestService } from '../../services/repair-request.service';
import { RepairRequest } from '../../models/repair-request.model';
import { EditRepairDialogComponent } from '../../components/edit-repair-dialog/edit-repair-dialog.component';
import { RepairRequestListComponent } from '../../components/repair-request-list/repair-request-list.component';

@Component({
  selector: 'app-repair-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    RepairRequestListComponent
  ],
  templateUrl: './repair-management.component.html',
  styleUrls: ['./repair-management.component.scss']
})
export class RepairManagementComponent implements OnInit {
  @ViewChild(RepairRequestListComponent) repairListComponent!: RepairRequestListComponent;
  
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private repairService: RepairRequestService
  ) { }

  ngOnInit(): void {
  }

  openRepairDialog(repair?: RepairRequest): void {
    const dialogRef = this.dialog.open(EditRepairDialogComponent, {
      width: '600px',
      data: repair || {
        description: '',
        sort: '水電相關',
        where: '',
        status: '待處理',
        isRepaired: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.repairListComponent) {
        this.repairListComponent.loadRepairRequests();
        this.showMessage(repair ? '維修申請已更新' : '維修申請已提交');
      }
    });
  }

  showMessage(message: string): void {
    this.snackBar.open(message, '關閉', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
