import { Component } from '@angular/core';
//步進器
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

//按鈕
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

//date
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpServiceService } from '../../../services/financial-service.service';

// import { TableComponent } from '../table/table.component';




@Component({
  selector: 'app-add-info',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule
  ],
  standalone: true,
  templateUrl: './add-info.component.html',
  styleUrl: './add-info.component.scss',

  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},
  ],
})

// @NgModule({
//   providers: [
//     {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},
//   ],
// })


export class AddInfoComponent {




  tableTitle: string[] = ["編號", "項目", "資產", "負債", "日期", "備註", "文本資料"];
  tableData: any[] = []
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  data!: FormGroup
  // @Input() num!:number

  //上傳檔案
  // uploadForm!: FormGroup;
  // selectedFile: File | null = null;



  constructor(private formBuilder: FormBuilder,private http: HttpServiceService) {
    // registerLocaleData(localeZh, 'zh');
    // this.uploadForm = this.formBuilder.group({});

    this.data=this.formBuilder.group({
      project: ['', Validators.required],
      income: ['', Validators.required],
      expenditure: ['', Validators.required],
      date: [new Date(), Validators.required],
      remark: ['', Validators.required],
      receipt: ['', Validators.required],

    })
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
  }

  add() {

    this.tableData.push(this.data.value)
    console.log(this.tableData)
    for(let i =0;i <= this.tableData.length;i++){
      if(this.tableData[i].project == ""){
        this.tableData[i].project = "未命名項目"
      }
      if(this.tableData[i].income < 0 || this.tableData[i].income == null || this.tableData[i].income == ""){
        this.tableData[i].income = 0
      }
      if(this.tableData[i].expenditure < 0 || this.tableData[i].expenditure == null || this.tableData[i].expenditure == ""){
        this.tableData[i].expenditure = 0
      }
      if(this.tableData[i].date == null){
        this.tableData[i].date = Date()
      }

    }
  }

  del(num:number){

    if(num ==-1){
      for(let i =0;i<=this.tableData.length;i++){
        this.tableData=[]
      }
    }
    this.tableData.splice(num,1)
  }

  send(num:number){
    // this.table=num
    if(this.tableData.length>=1){
    for(let i = 0;i<=this.tableData.length;i++){
      this.http.PostApi('http://localhost:8585/Financial/addInfo',this.tableData[i]).subscribe
      ((res: any) =>  {

          // this.showData=res.quizList
          // this.dataSource = new MatTableDataSource(res.quizList);
          // this.dataSource.paginator = this.paginator;
          // console.log(res.quizList)

        }
      );
    }}
  }






}
