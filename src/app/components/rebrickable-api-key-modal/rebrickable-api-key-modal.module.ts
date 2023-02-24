import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RebrickableApiKeyModalComponent } from './rebrickable-api-key-modal.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RebrickableApiKeyModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    RebrickableApiKeyModalComponent
  ]
})
export class RebrickableApiKeyModalModule { }
