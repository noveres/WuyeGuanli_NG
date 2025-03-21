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
  constructor(private http:ApiService, private service:Service ){}
  readonly dialog_ref = inject(MatDialogRef<DiaLogAddinFoComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  name!:string
  phone!:string
  Residential_Zone:string = ""
  House_number:string = ""
  isLase!:boolean
  Lasename!:string
  Lasephone:string = "";
  errorStr:string = "";
  errorStr1:string = "";
  errorStr2:string = "";

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
  chickPhone():boolean
  {
    let chick =  this.service.addData.resident_Informations.some(
      (res: any) =>
           res.owerName != this.name &&  res.owerPhone == this.phone,
    );

    if(chick)
    {
        this.errorStr ="此電話已經有註冊過了"
    }
    else
    {
      this.errorStr = "";
    }
    return chick
  }
  chickHouse_number():boolean
  {
        let chick =  this.service.addData.resident_Informations.some(
          (res: any) =>
          res.partitionhousenumber == this.Residential_Zone + this.House_number,
          );
          if(chick)
          {
              this.errorStr1 ="此地區已經有註冊過了"
          }
          else
          {
            this.errorStr1 = "";
          }
          return chick
  }
  chickLasephone()
  {


    let  chick =  this.service.addData.resident_Informations.some(
        (res: any) =>
          res.owerPhone ==  this.Lasephone ||res.residentphonenumber == this.Lasephone
      );
    console.log(this.phone == this.Lasephone);
    console.log(chick);
    if(this.phone == this.Lasephone && this.Lasephone != "")
    {
      console.log("zzxc")
      chick = true;
       this.errorStr2 ="此電話已經有了"
    }
    if(chick)
      {
          this.errorStr2 ="此電話已經有註冊過了(租客)"
      }
      else
      {
        this.errorStr2 = "";
      }
    return chick
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
       if(this.errorStr != "")
        {
          alert(this.errorStr)
          return;
        }
        if(this.errorStr1 !="")
        {
          alert(this.errorStr1)
          return;
        }
        if(this.errorStr2 !="")
        {
          alert(this.errorStr2)
          return;
        }
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
