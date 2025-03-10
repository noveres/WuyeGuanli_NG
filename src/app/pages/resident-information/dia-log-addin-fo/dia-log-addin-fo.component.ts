import { Component } from '@angular/core';
import { AfterViewInit,inject, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogTitle, MatDialogContent, MatDialogActions,
MatDialogRef, MAT_DIALOG_DATA,
MatDialog} from '@angular/material/dialog';
import { from, Subject } from 'rxjs';
import { ApiService } from '../../../services/Api';

@Component({
  selector: 'app-dia-log-addin-fo',
  imports: [FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions,],
  templateUrl: './dia-log-addin-fo.component.html',
  styleUrl: './dia-log-addin-fo.component.scss'
})
export class DiaLogAddinFoComponent
{
  constructor(private http:ApiService ) {}
  readonly dialog_ref = inject(MatDialogRef<DiaLogAddinFoComponent>);
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
       this.insterdate[0].partitionhousenumber = this.Residential_Zone + this.House_number;
       this.insterdate[0].owerName = this.name;
       this.insterdate[0].owerPhone =this.phone;
       this.insterdate[0].lease = this.isLase;
       this.insterdate[0].residentname = this.Lasename;
       this.insterdate[0].residentphonenumber = this.Lasephone;

       this.http.postAPI("http://localhost:8585/api/residents/Add",this.insterdate[0]).subscribe
       (
        (res:any)=>
          {
            console.log(res);
            alert(res.message);
            this.on_not_click();
         }
      );
    }
  }
}
