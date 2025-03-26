import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
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



  imgStr!:string
  Num!: number
  imageUrl2: string | ArrayBuffer | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  tableTitle: string[] = ["編號", "項目", "收入", "支出", "日期", "備註", "文本資料"];
  tableData: any[] = []
  switch: number = 1
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  data!: FormGroup
  alert!: string
  img!: string
  save: any[] = [{
    project: "",
    income: "",
    expenditure: "",
    date: Date(),
    remark: "",
    receipt: "",
  }
  ]



  constructor(private formBuilder: FormBuilder, private http: HttpServiceService, private ngZone: NgZone) { }

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
      income: [Number(), Validators.required],
      expenditure: [Number(), Validators.required],
      date: ['', Validators.required],
      remark: ['', Validators.required],
      receipt: ['', Validators.required],


    })


    this.http.getNum().subscribe(num => {
      if (num == 1) {
        this.stepper.reset()
        this.tableData = []
      }
    })


  }


  get() {
    let searchValue = {
      name: "",
      sDate: "",
      eDate: ""
    }
    this.http.PostApi('http://localhost:8585/Financial/search', searchValue).subscribe
      ((res: any) => {
        this.http.setData(res.financials)
      });
  }





  switch_zzxc(num: number) {
    this.switch = num
    if (num == 1) {
      this.save[0].expenditure = 0
      this.data.patchValue({
        expenditure: Number()
      })
    }
    if (num == 2) {
      this.save[0].income = 0
      this.data.patchValue({
        income: Number()
      })
    }
  }

  add() {
    //this.data.get('project')?.value

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

    if (this.data.get('expenditure')?.value == null) {
      this.data.patchValue({
        expenditure: 0
      })
    }

    if (this.data.get('receipt')?.value == null || this.data.get('receipt')?.value == "") {

      this.alert = "請上傳收據文本!!!"
      this.openDialog()
      return;
    }


    this.tableData.push({ ...this.data.value, show: 0 })
    this.data.patchValue({
      project: '',
      income: Number(),
      expenditure: Number(),
      date: '',
      remark: '',
      receipt: '',
    })




  }

  del(num: number) {

    if (num == -1) {
      for (let i = 0; i <= this.tableData.length; i++) {
        this.tableData = []
      }
    }
    this.tableData.splice(num, 1)
  }

  edit(num: number) {
    this.Num = num

    //this.save[0]=this.tableData[num] //會及時修改
    this.save[0].project = this.tableData[num].project
    this.save[0].income = this.tableData[num].income
    this.save[0].expenditure = this.tableData[num].expenditure
    this.save[0].date = this.tableData[num].date
    this.save[0].remark = this.tableData[num].remark
    this.save[0].receipt = this.tableData[num].receipt

    if (this.save[0].income == 0) {
      this.switch = 2
    } else if (this.save[0].expenditure == 0) {
      this.switch = 1
    }
    this.editopenDialog()
  }

  editSaveAndClose(num: number) {

    if (num == 0) {
      this.save[0] = []
      this.editcloseDialog()
    } else if (num == 1) {
      if (this.save[0].project == null || this.save[0].project == "") {

        this.alert = "未填寫項目名稱!!!"
        this.openDialog()
        return;
      }

      if (this.save[0].date == null || this.save[0].date == "") {

        this.alert = "檢查是否選擇日期!!!"
        this.openDialog()
        return;
      }
      if (this.save[0].income <= 0 && this.save[0].expenditure <= 0) {

        this.alert = "需填寫支出、收入其中一項!!!"
        this.openDialog()
        return;
      }

      if (this.save[0].receipt == null || this.save[0].receipt == "") {

        this.alert = "請上傳收據文本!!!"
        this.openDialog()
        return;
      }
      this.tableData[this.Num].project = this.save[0].project
      this.tableData[this.Num].income = this.save[0].income
      this.tableData[this.Num].expenditure = this.save[0].expenditure
      this.tableData[this.Num].date = this.save[0].date
      this.tableData[this.Num].remark = this.save[0].remark
      this.tableData[this.Num].receipt = this.save[0].receipt
      this.save[0] = []
      this.editcloseDialog()
    }
  }






  send(num: number) {

    if (this.tableData.length > 0) {
      for (let i = 0; i < this.tableData.length; i++) {
        this.http.PostApi('http://localhost:8585/Financial/addInfo', this.tableData[i]).subscribe
          ((res: any) => {
            this.get()
          });
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

  @ViewChild('editDialog', { static: true }) editdialog!: ElementRef<HTMLDialogElement>;

  editopenDialog() {
    this.editdialog.nativeElement.showModal();
  }

  editcloseDialog() {
    this.editdialog.nativeElement.close();
  }

  @ViewChild('imgDialog', { static: true }) imgdialog!: ElementRef<HTMLDialogElement>;

  imgopenDialog() {
    this.imgdialog.nativeElement.showModal();
  }

  imgcloseDialog() {
    this.imgdialog.nativeElement.close();
  }

  imgShow(num:number) {

    this.imgopenDialog()
    this.imgStr=this.tableData[num].receipt

  }

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // 使用 FileReader 讀取圖片內容
      const reader = new FileReader();
      // 轉換為 Base64
      this.ngZone.run(() => {
        reader.onload = () => {
          this.imageUrl = reader.result;
          this.data.patchValue
            ({ receipt: this.imageUrl });
        }
        reader.readAsDataURL(file);
      })
    }
  }

  onFileSelected2(event: Event) {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // 使用 FileReader 讀取圖片內容
      const reader = new FileReader();
      // 轉換為 Base64
      this.ngZone.run(() => {
        reader.onload = () => {
          this.imageUrl2 = reader.result;
            this.save[0].receipt=this.imageUrl2
        }
      })
      reader.readAsDataURL(file);
    }
  }
}
