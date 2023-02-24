import { Component, Input, OnInit } from '@angular/core';
import { SetInventoryItem } from 'src/app/models/setInventory';

@Component({
  selector: 'app-part-item',
  templateUrl: './part-item.component.html',
  styleUrls: ['./part-item.component.scss'],
})
export class PartItemComponent implements OnInit {
  @Input() part?: SetInventoryItem;

  constructor() { }

  ngOnInit() {}

}
