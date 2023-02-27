import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SetDetailsComponent } from './set-details.component';

@NgModule({
  declarations: [
    SetDetailsComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    SetDetailsComponent
  ]
})
export class SetDetailsModule { }
