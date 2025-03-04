import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

//財務表格
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { HttpServiceService } from '../../services/http-service.service';

//icon
import {MatIconModule} from '@angular/material/icon';

//開關按鈕
import {MatButtonToggleModule} from '@angular/material/button-toggle';

//按鈕
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
//路由
import { RouterOutlet, RouterLinkActive, RouterLink, Router } from '@angular/router';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'app-table',
  standalone: true,
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
    SearchBoxComponent

  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements AfterViewInit{
  constructor(private http: HttpServiceService,private router:Router)  {}

  table:number=1
  showData:any=[]

  displayedColumns: string[] = ['checkbox','id', 'project', 'income', 'expenditure','date','balance','remark','receipt'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {







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
    if(value ==3){
      this.router.navigateByUrl("financial/addInfo")
    }

}



}
