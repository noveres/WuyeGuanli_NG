import { Component, inject, input, viewChild } from '@angular/core';
import { RouterOutlet , Router, Data} from '@angular/router';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/Api';
import { Service } from '../../services/service';
import { DiaLogAddinFoComponent } from './dia-log-addin-fo/dia-log-addin-fo.component';
import { DiaLogUpdateComponent } from './dia-log-update/dia-log-update.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-guest-login',
  imports: [RouterOutlet,MatTableModule, MatPaginatorModule, CommonModule ,FormsModule],
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
      id:0,
      visitorName:"",
      visitorPhone:"",
      visitorTime:"",
      outTime:"",
      visitorReason:"",
      visitors:"",
      tool:"",
      Residential_Zone:"",
      House_number:"",
      ai:"",
      isleav:true,
    }
  ];
    scaData =
    [
      {
        owerName:"",
        starDateTime:"",
        endDateTime:"",
      }
    ];

    Residential_Zone:string="";
    maxvalue!:string;
    minValue!:string;
    isLeave:boolean = false;

    displayedColumns: string[] = ['id', 'visitorName', 'visitorPhone', 'visitorTime',"outTime","visitorReason" ,"Residential_Zone", "House_number","visitors","tool"];
    dataSource = new MatTableDataSource(this.AllData);
    startDate =  Date();
    endDate =  Date();
    resData:any;
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

    getResidents(value:number)
    {
      console.log(value);
    }
    addInfo()
    {
      const dialogAddQues = this.dialog.open(DiaLogAddinFoComponent,{data:{name:"administrator" ,animate:"animate"},width:"500px",height:"500px"});
      dialogAddQues.afterClosed().subscribe((res:any)=>{
        this.restAlldata();
        this.getAll();
      });
    }
    upDeta(val:any)
    {
      this.service.data = val;
      const dialogAddQues = this.dialog.open(DiaLogUpdateComponent,{data:{name:"administrator" ,animate:"animate"},width:"500px",height:"500px"});
      dialogAddQues.afterClosed().subscribe((res:any)=>{
      this.restAlldata();
      this.getAll()}
      );
    }

    getAll()
    {
      this.http.getApi("http://localhost:8585/api/visitors/getAll").subscribe
      ((res:any)=>
      {
        this.restGetAll(res);
        this.initialData();
        console.log(this.AllData);
        this.service.visAllData = this.AllData;
        this.dataSource = new MatTableDataSource(this.AllData);
        this.dataSource.paginator = this.paginator();

      });
    }
  restAlldata()
  {
    this.AllData =
    [
      {
      id:0,
      visitorName:"",
      visitorPhone:"",
      visitorTime:"",
      outTime:"",
      visitorReason:"",
      visitors:"",
      tool:"",
      Residential_Zone:"",
      House_number:"",
      ai:"",
      isleav:true,
      }
    ];
  }
    restGetAll(res:any)
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
              id:0,
              visitorName:"",
              visitorPhone:"",
              visitorTime:"",
              outTime:"",
              visitorReason:"",
              visitors:"",
              tool:"",
              Residential_Zone:"",
              House_number:"",
              ai:"",
              isleav:true,
            })
          }
          getChar[i] = res.visitorRecords[i].visitors.charAt(0);
          getafter[i] = res.visitorRecords[i].visitors.match(/\d+/);
          getafterName[i] =res.visitorRecords[i].visitors.match(/[a-zA-Z\u4E00-\u9FA5]+/g);
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
          if(this.AllData[i].visitorTime === this.AllData[i].outTime)
          {
            this.AllData[i].outTime = "---------";
            this.AllData[i].isleav = false;
          }
          console.log(getafterName[i]);
        }

    }
    initialData() {
      this.AllData.sort((a, b) => {
        if (a.isleav === b.isleav) return 0;
        return a.isleav ? 1 : -1; // 将已离开的访客排在后面
      });
          let id: number = 0;
          for (let i = 0; i < this.AllData.length; i++) {
            id++;
            this.AllData[i].id = id;
          }
        }
    chickisLeave()
    {
      if(this.isLeave == true || this.isLeave == null)
        {
           this.isLeave = false;
        }
        else
        {
           this.isLeave = true;
        }
        this.inputData();
    }
    inputData()
    {

      console.log(this.isLeave)
      console.log(this.startDate);
      console.log(this.endDate);
      console.log(this.scaData);
      this.http.postAPI("http://localhost:8585/api/visitors/getbyName",this.scaData[0]).subscribe
      ((res:any)=>
      {
        this.restAlldata();
        this.restGetAll(res);
        this.inputArea();
        this.isleav();
        this.initialData();

        this.dataSource = new MatTableDataSource(this.AllData);
        this.dataSource.paginator = this.paginator();
      });

    }
    inputArea()
    {
      console.log(this.Residential_Zone);


      if(this.Residential_Zone != "" && this.Residential_Zone != null)
      {
        for(let i =this.AllData.length-1 ; i>= 0 ;i--)
          {
            if(this.AllData[i].Residential_Zone != this.Residential_Zone)
            {
                this.AllData.splice(i,1);
            }
          }
          console.log(this.AllData);
          this.dataSource = new MatTableDataSource(this.AllData);
          this.dataSource.paginator = this.paginator();
      }

     // this.inputData();
      console.log(this.AllData);
      this.rangData();
    }
    rangData()
    {
      let minV:number
      let MaxV:number
      minV = Number(this.minValue);
      MaxV = Number(this.maxvalue);
      if(minV<=0 ||minV == null ||this.minValue =="" || this.minValue == null)
        {
          minV =1;
        }
      if(MaxV==null || MaxV<0 || this.maxvalue =="" || this.maxvalue == null)
      {
        MaxV = 0;
        for (let i = this.AllData.length - 1; i >= 0; i--)
          {

            if(MaxV <= Number(this.AllData[i].House_number))
            {
              MaxV =Number(this.AllData[i].House_number)+2;
            }
          }
      }
      console.log( MaxV)
      for (let i = this.AllData.length - 1; i >= 0; i--)
        {
          console.log(Number(this.AllData[i].House_number)<= MaxV && Number(this.AllData[i].House_number)>= minV)
          if (Number(this.AllData[i].House_number)<= MaxV && Number(this.AllData[i].House_number)>= minV)
          {

          }
          else
          {
            this.AllData.splice(i,1);
          }
        }
          console.log(this.AllData)
          this.dataSource = new MatTableDataSource(this.AllData);
          this.dataSource.paginator = this.paginator();
    }
    isleav()
    {

      for (let i = this.AllData.length - 1; i >= 0; i--)
        {
          if (this.AllData[i].isleav != this.isLeave)
          {
            this.AllData.splice(i, 1);
          }
    }
    this.dataSource = new MatTableDataSource(this.AllData);
    this.dataSource.paginator = this.paginator();
    }
  }
