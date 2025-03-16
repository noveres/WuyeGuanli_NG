import { Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

//財務表格
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpServiceService } from '../../../services/http-service.service';

//icon
import { MatIconModule } from '@angular/material/icon';

//開關按鈕
import { MatButtonToggleModule } from '@angular/material/button-toggle';

//按鈕
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
//路由
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { SearchBoxComponent } from '../search-box/search-box.component';
//步進器
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
//date
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
//Dialog
import { AddInfoComponent } from '../add-info/add-info.component';

import { ViewContainerRef } from '@angular/core';







@Component({
  selector: 'app-table',
  imports: [

    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    //icon
    MatIconModule,
    //開關按鈕
    MatButtonToggleModule,
    //按鈕
    MatDividerModule,
    MatButtonModule,
    //路由
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    //搜索
    SearchBoxComponent,

    MatInputModule,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    // Dialog
    MatButtonModule,

    AddInfoComponent



  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],

})


export class TableComponent {
  constructor(private http: HttpServiceService,) { }

  delectNum: any = []
  table: number = 1
  showData: any = []
  reqValue: any =
    {
      name: "",
      sDate: "",
      eDate: ""
    }



  displayedColumns: string[] = ['id', 'project', 'income', 'expenditure', 'date', 'remark', 'receipt', 'delect'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {


    this.http.getNum().subscribe(num => {
      if (num == 2) {
        this.dialog?.nativeElement.close();
      }
    });

    this.dataSource = new MatTableDataSource(this.showData);

    // 取得資料

    this.http.getData().subscribe(res => {
      this.showData.push(res)
      this.dataSource = new MatTableDataSource(res)
      console.log(this.showData)
      this.dataSource.paginator! = this.paginator;
      for(let i=0;i<= res.length;i++){
        this.showData.push({...this.showData,show:0})
      }

    })

  }

  switch_zzxc(value: number) {
    this.table = value
    console.log(this.table)

  }

  @ViewChild('myDialog', { static: true }) dialog?: ElementRef<HTMLDialogElement>;

  openDialog() {
    this.dialog?.nativeElement.showModal();
  }

  closeDialog() {
    this.dialog?.nativeElement.close();
    this.http.setNum(1)
  }

  delect(num: number) {
    this.delectNum = new Set()
    this.delectNum.add(num)
    console.log(this.delectNum)
  }

  showEye(num: number) {
    if (this.showData[num].show == 0) {
      this.showData[num].show = 1
    }
    else {
      this.showData[num].show = 0
    }
  }
}

