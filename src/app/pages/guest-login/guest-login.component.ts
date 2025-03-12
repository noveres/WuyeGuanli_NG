import { Component, inject, viewChild } from '@angular/core';
import { RouterOutlet , Router} from '@angular/router';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/Api';
import { Service } from '../../services/service';
import { DiaLogAddinFoComponent } from './dia-log-addin-fo/dia-log-addin-fo.component';
import { DiaLogUpdateComponent } from './dia-log-update/dia-log-update.component';
@Component({
  selector: 'app-guest-login',
  imports: [RouterOutlet,MatTableModule, MatPaginatorModule],
  templateUrl: './guest-login.component.html',
  styleUrl: './guest-login.component.scss'
})
export class GuestLoginComponent {

 title = 'WuyeGuanli_NG';

    constructor(private router:Router ,private http:ApiService , private service:Service){};
    //readonly dialog  =inject(MatDialog);
    readonly dialog = inject(MatDialog);
    AllData =
    [
      {
          'id':0,
          'visitorName':"",
          'visitorPhone':"",
          'visitorTime':"",
          "outTime":"",
          "visitorReason":"",
          "visitors":"",
          "tool":"",
          "Residential_Zone":"",
          "House_number":"",
          "ai":"",
      }
    ];
    displayedColumns: string[] = ['id', 'visitorName', 'visitorPhone', 'visitorTime',"outTime","visitorReason" ,"Residential_Zone", "House_number","visitors","tool"];
    dataSource = new MatTableDataSource(this.AllData);

    readonly paginator = viewChild.required(MatPaginator);

    ngAfterViewInit()
    {
      this.dataSource.paginator = this.paginator();
    }
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.getAll();
    }
    getAll()
    {
      this.http.getApi("http://localhost:8585/api/visitors/getAll").subscribe
      ((res:any)=>
      {
        let id:number =0;
        let getChar:string[] = [];
        let getafter:string[] =[];
        let getafterName:string[] =[];
        // for(let i =0 ;;i++)
        // {

        // }
        for(let i =0 ; i< res.visitorRecords.length;i++)
        {
          if(this.AllData.length< res.visitorRecords.length)
          {
            this.AllData.push
            ({
              'id':0,
              'visitorName':"",
              'visitorPhone':"",
              'visitorTime':"",
              "outTime":"",
              "visitorReason":"",
              "visitors":"",
              "tool":"",
              "Residential_Zone":"",
              "House_number":"",
              "ai":"",
            })
          }
          getChar[i] = res.visitorRecords[i].visitors.charAt(0);
          getafter[i] = res.visitorRecords[i].visitors.match(/\d+/);
          getafterName[i] =res.visitorRecords[i].visitors.match(/\d+(\w+)/);

          id++;
          this.AllData[i].id = id;
          this.AllData[i].visitorName = res.visitorRecords[i].visitorName;
          this.AllData[i].visitorPhone = res.visitorRecords[i].visitorPhone;
          this.AllData[i].visitorTime = res.visitorRecords[i].visitorTime;
          this.AllData[i].outTime = res.visitorRecords[i].outTime;
          this.AllData[i].visitorReason = res.visitorRecords[i].visitorReason;

          this.AllData[i].visitors = getafterName[i][1];
          this.AllData[i].Residential_Zone = getChar[i];
          this.AllData[i].House_number = getafter[i][0];
          this.AllData[i].ai =res.visitorRecords[i].ai;
        }
        this.dataSource = new MatTableDataSource(this.AllData);
        this.dataSource.paginator = this.paginator();
      });
    }
    getResidents(value:number)
    {
      console.log(value);
    }
    addInfo()
    {
      const dialogAddQues = this.dialog.open(DiaLogAddinFoComponent,{data:{name:"administrator" ,animate:"animate"},width:"500px",height:"500px"});
      dialogAddQues.afterClosed().subscribe((res:any)=>{this.getAll()});
    }
    upDeta(val:any)
    {
      this.service.data = val;
      const dialogAddQues = this.dialog.open(DiaLogUpdateComponent,{data:{name:"administrator" ,animate:"animate"},width:"500px",height:"500px"});
      dialogAddQues.afterClosed().subscribe((res:any)=>{this.getAll()});;
    }
  }
