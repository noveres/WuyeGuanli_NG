import { Component } from '@angular/core';
//步進器
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';

//按鈕
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';


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
    MatDividerModule
  ],
  standalone: true,
  templateUrl: './add-info.component.html',
  styleUrl: './add-info.component.scss'
})
export class AddInfoComponent {

  tableTitle:string[]=["編號","項目","資產","負債","日期","備註","文本資料"];
  tableData:any[]=  [
    {
      id:0,
      project:"",
      income:0,
      expenditure:0,
      date:Date(),
      remark:"",
      receipt:"",
    },
  ]
  firstFormGroup!:  FormGroup;
  secondFormGroup!: FormGroup;
  // isLinear = false;

  ngAfterContentChecked(): void {
    this.tableData
  }


  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
    });


    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  add(){
    let tableData =
      {
        id:"",
        project:"",
        income:0 ,
        expenditure:0 ,
        date: Date() ,
        remark:"",
        receipt:"",
      }


    this.tableData.push(tableData)
  }

  console()  {
    console.log(this.tableData)
  }





}
