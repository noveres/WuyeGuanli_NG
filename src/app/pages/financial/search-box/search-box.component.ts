import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HttpServiceService } from '../../../services/http-service.service';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-box',
  imports: [
    MatIconModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent {
  constructor(private http: HttpServiceService) { }
  searchValue:any={
    name:"",
    sDate:"",
    eDate:""
  }

  ngOnInit(): void {
    this.search()

  }

  search() {
    this.http.setData(this.searchValue)

    this.http.PostApi('http://localhost:8585/Financial/search', this.searchValue).subscribe
      ((res: any) => {
        this.http.setData(res.financials)
      }
      );
  }

}
