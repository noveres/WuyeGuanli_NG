import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    MatIconModule,
  ],
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {

}
