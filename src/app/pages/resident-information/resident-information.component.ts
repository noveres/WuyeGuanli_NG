
import { Component, inject, model } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import {MatIcon, MatIconModule} from '@angular/material/icon'
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-resident-information',
  imports: [RouterOutlet,MatTableModule, MatPaginatorModule,FormsModule,MatIcon,MatPaginatorModule],
  templateUrl: './resident-information.component.html',
  styleUrl: './resident-information.component.scss'
})
export class ResidentInformationComponent
{
  title = 'WuyeGuanli_NG';

    constructor(private router:Router ,private http:ApiService ,private service:Service  ){};
    readonly dialog  =inject(MatDialog);
    OwnerName:string = "房東姓名";
    OwnerPhone:string = "房東電話"
    Residential_Zone:string ="區"
    House_number:string = " 號"
    isLase:string = "無"
    LaseName:string[] = [];
    LasePhone:string[]=  [];
    LaseNameA:string = "房客姓名"
    LasePhoneA:string = "房客電話"
    sachName!:string;
    sacResidential_Zone:string = "";
    maxValue!:string;
    minValue!:string
    getId!:number;
    changChack:boolean = true;
    changCardString:string = "Resident_Information"

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
    customPaginatorIntl = new MatPaginatorIntl();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    changCard()
    {
      console.log(this.changChack)
      let setpos = document.getElementById(this.changCardString) as HTMLElement;
      let setpos2 = document.getElementById("Lase") as HTMLElement;
      if(this.changChack)
      {
        this.changCardString ="Resident_Information"

        setpos.style.transform = "translateY(100%)";
        setpos2.style.transform = "translateX(-10%) translateY(13%)";
        setTimeout(()=>
        {
          this.changChack = false;
          setpos.style.transform = "translateY(-13%) translateX(10%)"
          setpos.style.zIndex ="0";
        },100)
      }

      else
      {
        setpos2.style.transform = "translateY(100%) translateX(-10%)";
        setpos.style.transform = "translateY(0%)"
        // setpos2.style.transform = "translateY(-13%) translateX(10%)"
        setTimeout(()=>
          {
            this.changChack = true;
            setpos2.style.transform = "translateY(0%) "

            setpos.style.zIndex ="1";
          },100)
      }






      // this.element.addEventListener('mouseleave', () => {
      //   this.element.style.transform = 'translateY(0)';
      // });
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
    ngOnInit(): void
    {
      this.customPaginatorIntl.itemsPerPageLabel = '每页条目数：';
      this.customPaginatorIntl = new MatPaginatorIntl();
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.getAll();

    }
    getAll():void
    {
      this.rest_GetAll();
      this.http.getApi("http://localhost:8585/api/residents/getAll").subscribe
      (
        (res:any) =>{
          this.service.addData = res;
          this.inputData(res);
          this.inputselect();
          this.scrollToBotton();
        }
      )
    }
    getResidents(value:any)
    {
      console.log(value)
      console.log(this.Alldate)
      console.log(this.LaseName)
        this.OwnerName = value.owerName
        this.OwnerPhone = value.owerPhone
        this.Residential_Zone = value.Residential_Zone
        this.House_number = value.House_number+" 號"
        this.isLase = value.isLase
        this.getId = value.id-1;
        if(value.isLase == "有")
        {
           this.LaseNameA  = this.LaseName[this.getId];
           this.LasePhoneA = this.LasePhone[this.getId];
        }
        else
        {
          this.LaseNameA = "無";
          this.LasePhoneA ="無";
        }
        this.scrollTotop();
    }
    addInfo()
    {
      console.log(this.service.addData)
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
      this.service.update = this.Alldate[value.id-1] ;
      console.log(this.Alldate[value.id-1].isLase)
      if(this.Alldate[value.id-1].isLase == "有")
      {
        this.service.updateLNmae  = this.LaseName[value.id-1];
        this.service.updateLphone = this.LasePhone[value.id-1];
      }
      else
      {
        this.service.updateLNmae  = "";
        this.service.updateLphone ="";
      }
      console.log(this.service.update);
      dialogAddQues.afterClosed().subscribe(
        (res:any)=>
          {
            this.getAll();
            this.OwnerName = "房東姓名";
            this.OwnerPhone = "房東電話"
            this.Residential_Zone ="區"
            this.House_number = " 號"
            this.isLase= "無"
            this.LaseNameA = "房客姓名"
            this.LasePhoneA= "房客電話"
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
    serch()
    {

      this.rest_GetAll();
      if(!this.sachName)
      {
        this.getAll();
      }
      else
      {
        this.scrollToBotton();
           this.http.postAPI("http://localhost:8585/api/residents/SearchName",this.sachName).subscribe
          (
            (res:any)=>
            {
              this.inputData(res);
              this.inputselect();

            }
          )
      }
      console.log(this.sacResidential_Zone)

    }
    inputData(res:any)
    {
      let getChar:string[] = [];
      let getafter:string[] =[];
      for(let i =0 ; i<res.resident_Informations.length ; i++)
      {
        //this.zzxc [i]  = res.resident_Informations[i].partitionhousenumber;
        this.LaseName[i] =res.resident_Informations[i].residentname;
        this.LasePhone[i] = res.resident_Informations[i].residentphonenumber;
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
    rest_GetAll()
    {
      this.Alldate =
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
    }
    inputselect()
    {

      if(this.sacResidential_Zone != ""&& this.sacResidential_Zone != null )
      {
        for (let i = this.Alldate.length - 1; i >= 0; i--) {
          console.log(this.Alldate[i].Residential_Zone)
          if (this.Alldate[i].Residential_Zone != this.sacResidential_Zone)
          {
            console.log(this.Alldate[i].Residential_Zone)
            this.Alldate.splice(i,1);
          }
          this.scrollToBotton();
        }
        console.log(this.Alldate)
        this.dataSource = new MatTableDataSource(this.Alldate);
        this.dataSource.paginator = this.paginator;
      }
      this.rangData();
    }
    rangData()
    {
      let minV:number
      let MaxV:number
      minV = Number(this.minValue);
      MaxV = Number(this.maxValue);
      if(minV<=0 ||minV == null ||this.minValue =="" || this.minValue == null)
        {
          minV =0;
        }
      if(MaxV==null || MaxV<0 || this.maxValue =="" || this.maxValue == null)
      {
        MaxV = 0;
        for (let i = this.Alldate.length - 1; i >= 0; i--)
          {

            if(MaxV <Number(this.Alldate[i].House_number))
            {
              MaxV =Number(this.Alldate[i].House_number);
            }
          }

      }
      console.log( MaxV)
      for (let i = this.Alldate.length - 1; i >= 0; i--)
        {
          console.log(Number(this.Alldate[i].House_number)<= MaxV && Number(this.Alldate[i].House_number)>= minV)
          if (Number(this.Alldate[i].House_number)<= MaxV && Number(this.Alldate[i].House_number)>= minV)
          {

          }
          else
          {
            this.Alldate.splice(i,1);
          }
        }
          console.log(this.Alldate)
          this.dataSource = new MatTableDataSource(this.Alldate);
          this.dataSource.paginator = this.paginator;
    }
  scrollToBotton() {
    const mainContent = document.querySelector('.main-content');

    if (mainContent) {
      mainContent.scrollTo({
        top:mainContent.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
  scrollTotop() {
    const mainContent = document.querySelector('.main-content');

    if (mainContent) {
      mainContent.scrollTo({
        top:0,
        behavior: 'smooth'
      });
    }
  }

  }

