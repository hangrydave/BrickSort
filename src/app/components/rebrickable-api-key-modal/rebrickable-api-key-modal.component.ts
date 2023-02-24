import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rebrickable-api-key-modal',
  templateUrl: './rebrickable-api-key-modal.component.html',
  styleUrls: ['./rebrickable-api-key-modal.component.scss'],
})
export class RebrickableApiKeyModalComponent implements OnInit {
  @Input() rebrickableApiKey: string;

  constructor(private modalCtrl: ModalController) { }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    this.modalCtrl.dismiss(this.rebrickableApiKey, 'save');
  }

  ngOnInit() {}

}
