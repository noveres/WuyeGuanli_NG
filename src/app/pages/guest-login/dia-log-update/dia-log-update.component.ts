
import { Component } from '@angular/core';
import { AfterViewInit,inject, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogTitle, MatDialogContent, MatDialogActions,
MatDialogRef, MAT_DIALOG_DATA,
MatDialog} from '@angular/material/dialog';
import { from, Subject } from 'rxjs';
import { Service } from '../../../services/service';
import { ApiService } from '../../../services/Api';
@Component({
  selector: 'app-dia-log-update',
  imports: [FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions,],
  templateUrl: './dia-log-update.component.html',
  styleUrl: './dia-log-update.component.scss'
})
export class DiaLogUpdateComponent {

   constructor(private service:Service ,private http:ApiService) { }
    readonly dialog_ref = inject(MatDialogRef<DiaLogUpdateComponent>);
    readonly data = inject(MAT_DIALOG_DATA);
    alldata:any ;
   ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
   }
    on_not_click():void
    {
      let retirn_data = ['status','not_click'];
      this.dialog_ref.close(retirn_data);
    }
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.alldata = this.service.data;
      console.log(this.alldata);
    }
    on_loding_click(bool : boolean):void
    {
      let putdata =
      [
        {
          "id":this.alldata.ai,
          "leave":true,
        }
      ]
      if(bool)
      {
        console.log(putdata[0]);
        this.http.putAPI("http://localhost:8585/api/visitors/leave",putdata[0]).subscribe(
          (res:any)=>
            {
              this.on_not_click();
            });
      }
      else
      {
        this.on_not_click();
      }

    }
}
