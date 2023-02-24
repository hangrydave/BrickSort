import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { PartItemComponentModule } from '../components/part-item/part-item.module';
import { RebrickableApiKeyModalModule } from '../components/rebrickable-api-key-modal/rebrickable-api-key-modal.module';

@NgModule({
    declarations: [HomePage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        PartItemComponentModule,
        RebrickableApiKeyModalModule
    ]
})
export class HomePageModule {}
