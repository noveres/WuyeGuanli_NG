import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

//財務表格
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { HttpServiceService } from '../../../services/http-service.service';

//icon
import {MatIconModule} from '@angular/material/icon';

//開關按鈕
import {MatButtonToggleModule} from '@angular/material/button-toggle';

//按鈕
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
//路由
import { RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { SearchBoxComponent } from '../search-box/search-box.component';
//步進器
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
//date
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
//Dialog
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddInfoComponent } from '../add-info/add-info.component';






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
    MatDialogModule



  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],

})


export class TableComponent implements AfterViewInit{
  constructor(private http: HttpServiceService,private formBuilder: FormBuilder,public dialog: MatDialog)  {
    this.data=this.formBuilder.group({
    project: ['', Validators.required],
    income: ['', Validators.required],
    expenditure: ['', Validators.required],
    date: [new Date(), Validators.required],
    remark: ['', Validators.required],
    receipt: ['', Validators.required],

  })}

  //Dialog
  openDialog() {
    let dialogRef = this.dialog.open(AddInfoComponent,{});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  table:number=1
  showData:any=[]


  //財務表格
  displayedColumns: string[] = ['checkbox','id', 'project', 'income', 'expenditure','date','balance','remark','receipt'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });


    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

  this.data=this.formBuilder.group({
    project: ['', Validators.required],
    income: ['', Validators.required],
    expenditure: ['', Validators.required],
    date: [new Date(), Validators.required],
    remark: ['', Validators.required],
    receipt: ['', Validators.required],

  })

    this.dataSource = new MatTableDataSource(this.showData);

    // 取得資料
    let reqValue:any =
    {
      name:"",
      startDate:"",
      endDate:""
    }

    this.http.PostApi('http://localhost:8080/quiz/get_quiz',reqValue).subscribe
    ((res: any) =>  {

        // this.showData=res.quizList
        this.dataSource = new MatTableDataSource(res.quizList);
        this.dataSource.paginator = this.paginator;
        console.log(res.quizList)

      }
    );
  }

  switch_zzxc(value:number){
    this.table=value
    this.tableData=[]
    console.log(this.table)

}




tableTitle: string[] = ["編號", "項目", "資產", "負債", "日期", "備註", "文本資料"];
tableData: any[] = []
firstFormGroup!: FormGroup;
secondFormGroup!: FormGroup;
data!: FormGroup
// @Input() num!:number

//上傳檔案
// uploadForm!: FormGroup;
// selectedFile: File | null = null;


}
