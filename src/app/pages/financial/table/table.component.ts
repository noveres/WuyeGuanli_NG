import { Component, ElementRef, NgZone } from '@angular/core';
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
  constructor(private http: HttpServiceService,private ngZone: NgZone) { }
  imageUrl2: string | ArrayBuffer | null = null;
  imgStr!:string
  show:number=1
  comp: number = 0
  alert!: string
  delectNum: any = []
  table: number = 1
  showData: any = []
  switch: number = 1
  Num!: number
  reqValue: any =
    {
      name: "",
      sDate: "",
      eDate: ""
    }
  save: any[] = [{
    project: "",
    income: "",
    expenditure: "",
    date: Date(),
    remark: "",
    receipt: "",
  }
  ]



  displayedColumns: string[] = ['id', 'project', 'income', 'expenditure', 'date', 'remark', 'receipt', 'delect'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {


    this.http.getNum().subscribe(num => {
      if (num == 2) {
        this.dialog?.nativeElement.close();
      }
    });


    // 取得資料

    this.http.getData().subscribe(res => {
      this.showData = Array.isArray(res) ? res : [];
      this.dataSource = new MatTableDataSource(this.showData)
      this.dataSource.paginator! = this.paginator;
      for (let i = 0; i < this.showData.length; i++) {
        this.showData[i].show = 0;
      }
      for (let i = 0; i < this.showData.length; i++) {
        this.showData[i].del = 0;
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
      }
      );
  }


  del(num: number) {
    if (this.showData[num].del == 0) {
      this.showData[num].del = 1
      this.delectNum.push(this.showData[num].id)
    }
    else if (this.showData[num].del == 1) {
      this.showData[num].del = 0
      this.delectNum.splice(this.delectNum.indexOf(this.showData[num].id), 1)
    }
  }
  del2() {
    let del = { ids: this.delectNum }
    this.http.PostApi('http://localhost:8585/Financial/delect', del).subscribe
      ((res: any) => {
        this.delectNum = []
        this.get()
      }
      );
  }

  edit(num: number) {
    this.Num = num

    //this.save[0]=this.tableData[num] //會及時修改
    this.save[0].project = this.showData[num].project
    this.save[0].income = this.showData[num].income
    this.save[0].expenditure = this.showData[num].expenditure
    this.save[0].date = this.showData[num].date
    this.save[0].remark = this.showData[num].remark
    this.save[0].receipt = this.showData[num].receipt

    if (this.save[0].income == 0) {
      this.switch = 2
    } else if (this.save[0].expenditure == 0) {
      this.switch = 1
    }
    this.editopenDialog()

  }



  switch_zzxc(num: number) {
    this.table = num
    this.switch = num
    if (num == 1) {
      this.save[0].expenditure = 0
      // this.s.patchValue({
      //   expenditure: Number()
      // })
    }
    if (num == 2) {
      this.save[0].income = 0
      // this.data.patchValue({
      //   income: Number()
      // })
    }

  }

  @ViewChild('myDialog', { static: true }) dialog?: ElementRef<HTMLDialogElement>;

  openDialog() {
    this.dialog?.nativeElement.showModal();
  }

  closeDialog() {
    this.dialog?.nativeElement.close();
    this.http.setNum(1)
  }

  @ViewChild('errDialog', { static: true }) errDialog?: ElementRef<HTMLDialogElement>;

  errOpenDialog() {
    this.errDialog?.nativeElement.showModal();
  }

  errCloseDialog() {
    this.errDialog?.nativeElement.close();
    this.http.setNum(1)
  }

  @ViewChild('editDialog', { static: true }) editdialog!: ElementRef<HTMLDialogElement>;

  editopenDialog() {
    this.editdialog.nativeElement.showModal();
  }

  editcloseDialog() {
    this.editdialog.nativeElement.close();
  }

  editSaveAndClose(num: number) {

    if (num == 0) {
      this.save[0] = []
      this.editcloseDialog()
    } else if (num == 1) {
      if (this.save[0].project == null || this.save[0].project == "") {

        this.alert = "未填寫項目名稱!!!"
        this.errOpenDialog()
        return;
      }

      if (this.save[0].date == null || this.save[0].date == "") {

        this.alert = "檢查是否選擇日期!!!"
        this.errOpenDialog()
        return;
      }
      if (this.save[0].income <= 0 && this.save[0].expenditure <= 0) {

        this.alert = "需填寫支出、收入其中一項!!!"
        this.errOpenDialog()
        return;
      }

      if (this.save[0].receipt == null || this.save[0].receipt == "") {

        this.alert = "請上傳收據文本!!!"
        this.errOpenDialog()
        return;
      }
      this.ngZone.run(()=>{
        let save = { ids: [this.showData[this.Num].id] }
      this.http.PostApi('http://localhost:8585/Financial/delect', save).subscribe
        ((res: any) => {
        });
        this.http.PostApi('http://localhost:8585/Financial/addInfo', this.save[0]).subscribe
        ((res: any) => {
          this.get();
          this.save[0] = [];
          window.location.reload();
        });
      })
      this.editcloseDialog()
    }
  }

  delect(num: number) {
    this.delectNum = new Set()
    this.delectNum.add(num)
  }

  showEye(num: number) {
    if (num == -2) {
      for (let i = 0; i < this.showData.length; i++) {
        this.showData[i].show = 1;
        this.show=0
      }
    } else if (num == -3) {
      for (let i = 0; i < this.showData.length; i++) {
        this.showData[i].show = 0;
        this.show=1
      }
    }
    if (this.showData[num].show == 0) {
      this.showData[num].show = 1
    }
    else {
      this.showData[num].show = 0
    }
  }

  //==============================
  // imageUrl: string | ArrayBuffer | null = null;

  // // 處理圖片選擇與預覽
  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[0];

  //     // 使用 FileReader 讀取圖片內容
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.imageUrl = reader.result; // 轉換為 Base64
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  @ViewChild('imgDialog', { static: true }) imgdialog!: ElementRef<HTMLDialogElement>;

  imgopenDialog() {
    this.imgdialog.nativeElement.showModal();
  }

  imgcloseDialog() {
    this.imgdialog.nativeElement.close();
  }

  imgShow(num:number) {
    this.imgopenDialog()
    this.imgStr=this.showData[num].receipt

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
        reader.readAsDataURL(file);
      })
    }
  }
}
