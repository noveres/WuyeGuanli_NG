import { Component, ElementRef, ViewChild } from '@angular/core';
//步進器
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

//按鈕
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

//date
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpServiceService } from '../../../services/http-service.service';

// import { TableComponent } from '../table/table.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';





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
    MatDialogModule,
    MatButtonToggleModule,

  ],
  standalone: true,
  templateUrl: './add-info.component.html',
  styleUrl: './add-info.component.scss',

})



export class AddInfoComponent {




  tableTitle: string[] = ["編號", "項目", "資產", "負債", "日期", "備註", "文本資料"];
  tableData: any[] = []
  switch: number = 1
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  data!: FormGroup
  alert!: string



  constructor(private formBuilder: FormBuilder, private http: HttpServiceService) { }

  @ViewChild('stepper') stepper!: MatStepper;

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });


    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.data = this.formBuilder.group({
      project: ['', Validators.required],
      income: [0, Validators.required],
      expenditure: [0, Validators.required],
      date: ['', Validators.required],
      remark: ['', Validators.required],
      receipt: ['', Validators.required],

    })


    this.http.getNum().subscribe(num => {
      if(num==1){
        this.stepper.reset()
        this.tableData=[]
      }
    })


  }

  switch_zzxc(num: number) {
    this.switch = num
    if (num == 1) {
      this.data.patchValue({
        expenditure: Number()
      })
    }
    if (num == 2) {
      this.data.patchValue({
        income: Number()
      })
    }
  }

  add() {
    this.data.get('project')?.value

    if (this.data.get('project')?.value == null || this.data.get('project')?.value == "") {

      this.alert = "未填寫項目名稱!!!"
      this.openDialog()
      return;
    }

    if (this.data.get('date')?.value == null || this.data.get('date')?.value == "") {

      this.alert = "檢查是否選擇日期!!!"
      this.openDialog()
      return;
    }
    if (this.data.get('income')?.value <= 0 && this.data.get('expenditure')?.value <= 0) {

      this.alert = "需填寫支出、收入其中一項!!!"
      this.openDialog()
      return;
    }

    if (this.data.get('receipt')?.value == null || this.data.get('receipt')?.value == "") {

      this.alert = "請上傳收據文本!!!"
      this.openDialog()
      return;
    }


    this.tableData.push({ ...this.data.value, show: 0 })
    console.log(this.data.value)



  }

  del(num: number) {

    if (num == -1) {
      for (let i = 0; i <= this.tableData.length; i++) {
        this.tableData = []
      }
    }
    this.tableData.splice(num, 1)
  }

  show() {
    // if(this.tableData[num].show==1 ){
    //   this.tableData[num].show=0
    // }
    // this.tableData[num].show=1
    // console.log(this.date)
  }

  send(num: number) {
    // this.table=num
    if (this.tableData.length >= 1) {
      for (let i = 0; i <= this.tableData.length; i++) {
        this.http.PostApi('http://localhost:8585/Financial/addInfo', this.tableData[i]).subscribe
          ((res: any) => {

            // this.showData=res.quizList
            // this.dataSource = new MatTableDataSource(res.quizList);
            // this.dataSource.paginator = this.paginator;
            // console.log(res.quizList)



          }
          );
      }
    }
    this.tableData = []
    this.http.setNum(2)
  }

  showEye(num: number) {
    if (this.tableData[num].show == 0) {
      this.tableData[num].show = 1
    }
    else {
      this.tableData[num].show = 0
    }
  }

  @ViewChild('myDialog', { static: true }) dialog!: ElementRef<HTMLDialogElement>;

  openDialog() {
    this.dialog.nativeElement.showModal();
  }

  closeDialog() {
    this.dialog.nativeElement.close();
  }








}
