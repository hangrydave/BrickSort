import { Component } from '@angular/core';
import { RebrickableService } from './services/rebrickable.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private rebrickable: RebrickableService) {
    
  }
}
