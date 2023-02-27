import { Component, Input, OnInit } from '@angular/core';
import { SetDetails } from 'src/app/models/setDetails';

@Component({
  selector: 'bricksort-set-details',
  templateUrl: './set-details.component.html',
  styleUrls: ['./set-details.component.scss'],
})
export class SetDetailsComponent implements OnInit {
  @Input() setDetails?: SetDetails;

  constructor() { }

  ngOnInit() {}

}
