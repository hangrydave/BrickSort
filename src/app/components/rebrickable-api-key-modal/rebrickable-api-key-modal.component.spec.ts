import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RebrickableApiKeyModalComponent } from './rebrickable-api-key-modal.component';

describe('RebrickableApiKeyModalComponent', () => {
  let component: RebrickableApiKeyModalComponent;
  let fixture: ComponentFixture<RebrickableApiKeyModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RebrickableApiKeyModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RebrickableApiKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
