import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FeedialogComponent } from '../feedialog/feedialog.component';
import { RouterOutlet } from '@angular/router';
import { AddnewComponent } from '../addnew/addnew.component';
import { FeeguidanceComponent } from '../feeguidance/feeguidance.component';



@Component({
  selector: 'app-savetab',
  standalone: true,
  imports: [MatIconModule,
     MatTabsModule, 
     FeedialogComponent,
    //  RouterOutlet,
     AddnewComponent,
     FeeguidanceComponent,
    ],
  templateUrl: './savetab.component.html',
  styleUrls: ['./savetab.component.scss']
})
export class SavetabComponent {}
