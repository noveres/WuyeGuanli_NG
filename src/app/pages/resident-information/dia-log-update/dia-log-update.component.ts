
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
  selector: 'app-dia-log-update',
  imports: [FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions,],
  templateUrl: './dia-log-update.component.html',
  styleUrl: './dia-log-update.component.scss'
})
export class DiaLogUpdateComponent {

  constructor(private http:ApiService , private service:Service) {}
  readonly dialog_ref = inject(MatDialogRef<DiaLogUpdateComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  name!:string
  phone!:string
  Residential_Zone!:string
  House_number!:string
  isLase!:boolean
  Lasename!:string
  Lasephone!:string
  insterdate =
  [
    {
      partitionhousenumber:"",
      owerName:"",
      owerPhone:"",
      lease:false,
      residentname:"",
      residentphonenumber:""
    }
  ]

 ngAfterViewInit(): void {
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
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
       this.insterdate[0].partitionhousenumber = this.service.gethousenumber;
       this.insterdate[0].owerName = this.name;
       this.insterdate[0].owerPhone =this.phone;
       this.insterdate[0].lease = this.isLase;
       this.insterdate[0].residentname = this.Lasename;
       this.insterdate[0].residentphonenumber = this.Lasephone;
      console.log(this.insterdate[0]);
       this.http.putAPI("http://localhost:8585/api/residents/update",this.insterdate[0]).subscribe
       (
        (res:any)=>
          {

            // console.log(res);
            // alert(res.message);
            this.on_not_click();
         }
      );
    }
  }
}
