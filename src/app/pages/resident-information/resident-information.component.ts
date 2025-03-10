
import { Component, inject } from '@angular/core';
import { RouterOutlet , Router} from '@angular/router';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/Api';
import { Service } from '../../services/service';
import { DiaLogAddinFoComponent } from './dia-log-addin-fo/dia-log-addin-fo.component';
import { DiaLogUpdateComponent } from './dia-log-update/dia-log-update.component';
import { DiaLogDeleteComponent } from './dia-log-delete/dia-log-delete.component';

@Component({
  selector: 'app-resident-information',
  imports: [RouterOutlet,MatTableModule, MatPaginatorModule,],
  templateUrl: './resident-information.component.html',
  styleUrl: './resident-information.component.scss'
})
export class ResidentInformationComponent
{
  title = 'WuyeGuanli_NG';

    constructor(private router:Router ,private http:ApiService ,private service:Service){};
    readonly dialog  =inject(MatDialog);
    OwnerName:string = "房東姓名";
    OwnerPhone:string = "房東電話"
    Residential_Zone:string ="A區"
    House_number:string = "85號"
    isLase:string = "85號"
    getId!:number;

    Alldate =
    [
      {
        id:0,
        owerName:"",
        owerPhone:"",
        Residential_Zone:"",
        House_number:"",
        isLase:"",
        toolbar:""
      }
    ];
    //test
    zzxc:string[]  =[""];

    //--------------------------------------
    displayedColumns: string[] = ["id",'owerName', 'owerPhone', 'Residential_Zone',"House_number","isLase","toolbar"];
    dataSource = new MatTableDataSource(this.Alldate);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
    ngOnInit(): void
    {

      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.getAll();
    }
    getAll():void
    {
      this.http.getApi("http://localhost:8585/api/residents/getAll").subscribe
      (
        (res:any) =>{
          console.log(res);
          let getChar:string[] = [];
          let getafter:string[] =[];
          for(let i =0 ; i<res.resident_Informations.length ; i++)
          {
            //this.zzxc [i]  = res.resident_Informations[i].partitionhousenumber;
            console.log(res.resident_Informations[i].partitionhousenumber);
            this.zzxc[i] = res.resident_Informations[i].partitionhousenumber;
            getChar[i] = this.zzxc[i].charAt(0);
            getafter[i] = this.zzxc[i].substring(1);

            this.Alldate[i].id = i+1;
            this.Alldate[i].owerName = res.resident_Informations[i].owerName;
            this.Alldate[i].owerPhone = res.resident_Informations[i].owerPhone;
            if(res.resident_Informations[i].lease == false)
            {
              this.Alldate[i].isLase = "否";
            }
            else
            {
               this.Alldate[i].isLase = "有";
            }
            this.Alldate[i].Residential_Zone =getChar[i];
            this.Alldate[i].House_number = getafter[i];
            if(this.Alldate.length<res.resident_Informations.length)
            {
              this.Alldate.push({
                id:0,
                owerName:"",
                owerPhone:"",
                Residential_Zone:"",
                House_number:"",
                isLase:"",
                toolbar:"",
              });
            }
          }
          this.dataSource = new MatTableDataSource(this.Alldate);
          this.dataSource.paginator = this.paginator;
        }
      )

    }
    getResidents(value:number)
    {
      value = value-1;
      this.OwnerName = this.Alldate[value].owerName
      this.OwnerPhone = this.Alldate[value].owerPhone
      this.Residential_Zone = this.Alldate[value].Residential_Zone
      this.House_number = this.Alldate[value].House_number
      this.isLase = this.Alldate[value].isLase
      this.getId = value;
    }
    addInfo()
    {
      const dialogAddQues = this.dialog.open(DiaLogAddinFoComponent,{data:{name:"administrator" ,animate:"animate"},width:"500px",height:"500px"});
      dialogAddQues.afterClosed().subscribe(
        (res:any)=>
          {
            this.getAll();
          }
      );
    }
    upDeta( value:any)
    {
      const dialogAddQues = this.dialog.open(DiaLogUpdateComponent,{data:{name:"administrator" ,animate:"animate"},width:"500px",height:"500px"});
      console.log(value);
      this.service.gethousenumber = this.zzxc[value.id-1];
      console.log(this.service.gethousenumber);
      dialogAddQues.afterClosed().subscribe(
        (res:any)=>
          {
            this.getAll();
          }
      );
    }
    delete_botton(value:any)
    {
      const dialogAddQues = this.dialog.open(DiaLogDeleteComponent,{data:{name:"administrator" ,animate:"animate"},width:"500px",height:"500px"});
      console.log(value);
      this.service.deleatedate = value;
      console.log(this.service.gethousenumber);
      dialogAddQues.afterClosed().subscribe(
        (res:any)=>
        {
          this.getAll();
        });
    }

  }
