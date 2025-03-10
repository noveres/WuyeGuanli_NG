import { Component } from '@angular/core';
import { AfterViewInit,inject, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogTitle, MatDialogContent, MatDialogActions,
MatDialogRef, MAT_DIALOG_DATA,
MatDialog} from '@angular/material/dialog';
import { from, Subject } from 'rxjs';
import { ApiService } from '../../../services/Api';
import { Service } from '../../../services/service';


@Component({
  selector: 'app-dia-log-delete',
  imports: [FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions,],
  templateUrl: './dia-log-delete.component.html',
  styleUrl: './dia-log-delete.component.scss'
})
export class DiaLogDeleteComponent {
   constructor(private http:ApiService , private service:Service) {}
    readonly dialog_ref = inject(MatDialogRef<DiaLogDeleteComponent>);
    readonly data = inject(MAT_DIALOG_DATA);

    name!:string
    phone!:string
    Residential_Zone!:string
    House_number!:string
    isLase!:boolean
    Lasename!:string
    Lasephone!:string
    delatedate:any
    delatedateA = [{partitionhousenumber:""}];

   ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    //alert("確定刪除")

   }
   ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.delatedate =this.service.deleatedate;
    console.log(this.delatedate);

   }
    on_not_click():void
    {
      let retirn_data = ['status','not_click'];
      this.dialog_ref.close(retirn_data);
    }

    on_loding_click(bool : boolean):void
    {
      if(!bool)
      {
        this.on_not_click();
      }
      else
      {
        this.delatedateA[0].partitionhousenumber = this.delatedate.Residential_Zone+this.delatedate.House_number
        console.log(this.delatedateA)
         this.http.delatAPI("http://localhost:8585/api/residents/delete",this.delatedateA[0]).subscribe
         ((res:any) =>
        {
          this.on_not_click();
        });
      }
    }
  }
