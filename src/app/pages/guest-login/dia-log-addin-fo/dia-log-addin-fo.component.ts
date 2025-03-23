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
    zoneError:string = "此區域未有人註冊"
    zoneChick:boolean = false
    resData:any
 ngAfterViewInit(): void
 {
  //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
  //Add 'implements AfterViewInit' to the class.
 }
 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
    console.log(this.service.visAllData);
    this.getResAll();
 }
 getResAll()
    {
      this.http.getApi("http://localhost:8585/api/residents/getAll").subscribe
      (
        (res:any) =>
          {
            console.log(res);
            this.resData = res.resident_Informations;
            console.log(this.resData)

          }
        )
        console.log(this.resData);
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
        alert(res.message);
        console.log(this.inputData[0]);
        if(res.message == "成功")
          {
            this.on_not_click();
          }
      });
    }
    else
    {
      this.on_not_click();
    }
  }
  chickZon():boolean
    {
      let chick
      console.log(this.resData)
      if( (this.hoous1+this.hoous2).length>=3)
      {
        return chick = this.resData.some((res:any)=>
        {
          if((this.hoous1+this.hoous2) == res.partitionhousenumber)
            {
              this.zoneChick =true;
              this.hoous3  = res.owerName;
            }
        })
      }
      this.hoous3 = "";
      chick =false;
      return chick
    }

  chickPhone():boolean
  {
    let chick
    if(this.inputData[0].visitorPhone.length >= 10)
    {
      chick =  this.service.visAllData.some((res:any)=>
        {
          return this.inputData[0].visitorPhone == res.visitorPhone && !res.isleav;
        });
      if(!this.inputData[0].visitorPhone.match(/\d/g))
        {
          this.error = "未符合格式"
          return true
        }
        if(this.inputData[0].visitorPhone.length > 10)
        {
           this.error = "未符合格式"
           return true
        }
    }
    console.log(chick)
    return chick
  }
}
