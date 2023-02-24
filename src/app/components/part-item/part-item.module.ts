import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PartItemComponent } from './part-item.component';

@NgModule({
  declarations: [
    PartItemComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PartItemComponent
  ]
})
export class PartItemComponentModule { }
