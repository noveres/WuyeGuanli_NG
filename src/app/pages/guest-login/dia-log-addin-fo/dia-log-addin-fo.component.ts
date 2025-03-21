import { Service } from './../../../services/service';
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
  constructor(private http:ApiService , private service:Service) { }
  readonly dialog_ref = inject(MatDialogRef<DiaLogAddinFoComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  inputData =
    [
      {
      "visitorName": "",
      "visitorPhone": "",
      "visitorReason": "",
      "visitors": "",
      }
    ];
    hoous1!:string;
    hoous2!:string;
    hoous3!:string;
    hoous!:string;
    error:string = "還未離開手機號碼"
 ngAfterViewInit(): void
 {
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
 }
 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
    console.log(this.service.visAllData);

 }
  on_not_click():void
  {
    let retirn_data = ['status','not_click'];
    this.dialog_ref.close(retirn_data);
  }

  on_loding_click(bool : boolean):void
  {

    if(bool)
    {
      this.hoous = this.hoous1+this.hoous2+this.hoous3;
      this.inputData[0].visitors =this.hoous;
      this.http.postAPI("http://localhost:8585/api/visitors/Add",this.inputData[0]).subscribe
      ((res:any)=>
      {
        console.log(this.inputData[0]);
        this.on_not_click();
      });
    }
    else
    {
      this.on_not_click();
    }
  }
  chickPhone():boolean
  {
    let chick =  this.service.visAllData.visitorPhone.some((res:any)=>
    {
      res == this.inputData[0].visitorPhone;
    });
    return true

  }
}
