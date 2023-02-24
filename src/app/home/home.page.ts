import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Animation, AnimationController, IonList, IonSearchbar, ModalController, RefresherCustomEvent, ToastController } from '@ionic/angular';
import { catchError, of, Subscription, take } from 'rxjs';
import { RebrickableApiKeyModalComponent } from '../components/rebrickable-api-key-modal/rebrickable-api-key-modal.component';
import { SetInventoryItem, SetInventoryPage } from '../models/setInventory';
import { RebrickableService } from '../services/rebrickable.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(IonList, { static: false }) ionList: IonList;
  @ViewChild('searchBar', { static: false }) ionSearchBar: IonSearchbar;
  @ViewChild('searchBar', { static: false }) searchBarRef: ElementRef;
  @ViewChild('titleText', { static: false }) titleTextRef: ElementRef;

  public setNumber: string;
  public parts: SetInventoryItem[] = [];
  public searching: boolean = true;
  public loading: boolean = false;

  private readonly defaultSearchBarPlaceholder = 'Set number';
  private readonly defaultHelpText = 'Search for a set number in the above search bar!';

  public searchBarPlaceholder = this.defaultSearchBarPlaceholder;

  private inProgressPartList: SetInventoryItem[] = [];

  private subscriptions: Subscription[] = [];

  private titleTextDisappear: Animation;
  private titleTextAppear: Animation;
  private searchBarDisappear: Animation;
  private searchBarAppear: Animation;

  constructor(
    private rebrickable: RebrickableService,
    private animationCtrl: AnimationController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  getHelpText(): string {
    if (!this.rebrickable.hasApiKey()) {
      return 'To get started, hit the Set API Key button above to enter your Rebrickable.com API key.';
    } else {
      return this.defaultHelpText;
    }
  }

  async showApiKeyModal() {
    const modal = await this.modalCtrl.create({
      component: RebrickableApiKeyModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      this.rebrickable.setApiKey(data);
    }
  }

  async ngOnInit() {
  }

  async showNoPartsFoundToast() {
    const toast = await this.toastCtrl.create({
      message: `Couldn't get inventory for set ${this.setNumber}; try another set number?`,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  async handleError(errorNumber: number) {
    let message = '';

    switch(errorNumber) {
      case 400: message = `Internal error 400; something's wrong with the code.`; break;
      case 401: message = `Invalid API key.`; break;
      case 403: message = `Internal error 403! Couldn't download inventory for set ${this.setNumber}.`; break;
      case 404: message = `Set ${this.setNumber} not found.`; break;
      case 429: message = `Your requests to the Rebrickable.com API are being throttled! Slow down there!`; break;
      default: message = 'Whats the deal with airline food amirite'; break;
    }

    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  async titleClick() {
    // TODO: figure out animations based on this
    // https://stackoverflow.com/questions/21853480/fade-out-element-completely-before-fading-another-in

    // if (!this.titleTextDisappear) {
    //   this.titleTextDisappear = this.animationCtrl.create()
    //     // .addElement(this.titleTextRef.nativeElement)
    //     .duration(125)
    //     .afterStyles({ 'display': 'none' })
    //     .fromTo('opacity', '1', '0');
    // }
    // this.titleTextDisappear.elements = [];
    // this.titleTextDisappear = this.titleTextDisappear.addElement(this.titleTextRef.nativeElement);
    // await this.titleTextDisappear.play();

    // this.searching = true;
    // this.changeDetectorRef.detectChanges();

    // if (!this.searchBarAppear) {
    //   this.searchBarAppear = this.animationCtrl.create()
    //     // .addElement(this.searchBarRef.nativeElement)
    //     .duration(125)
    //     // .beforeStyles({ 'visibility': 'visible' })
    //     .fromTo('opacity', '0', '1');
    // }
    // this.searchBarAppear.elements = [];
    // this.searchBarAppear = this.searchBarAppear.addElement(this.searchBarRef.nativeElement);
    // await this.searchBarAppear.play();

    this.ionSearchBar.setFocus();
  }

  async onSearch(event: Event) {
    // if (!this.searchBarDisappear) {
    //   this.searchBarDisappear = this.animationCtrl.create()
    //     // .addElement(this.searchBarRef.nativeElement)
    //     .duration(250)
    //     // .afterStyles({ 'visibility': 'hidden' })
    //     .fromTo('opacity', '1', '0');
    // }
    // this.searchBarDisappear.elements = [];
    // this.searchBarDisappear = this.searchBarDisappear.addElement(this.searchBarRef.nativeElement);
    // await this.searchBarDisappear.play();

    // this.searching = false;
    // this.changeDetectorRef.detectChanges();
    
    // if (!this.titleTextAppear) {
    //   this.titleTextAppear = this.animationCtrl.create()
    //     .addElement(this.titleTextRef.nativeElement)
    //     .duration(250)
    //     .beforeStyles({ 'display': 'inline' })
    //     .fromTo('opacity', '0', '1');
    // }
    // this.titleTextAppear.elements = [];
    // this.titleTextAppear = this.titleTextAppear.addElement(this.titleTextRef.nativeElement);
    // await this.titleTextAppear.play();

    const value = (event.target as HTMLInputElement).value;
    this.setNumber = value;
    if (value) {
      // We have a new set number; go and get the data.
      this.loading = true;

      this.searchBarPlaceholder = value;
      this.recursivelyBuildPartsList(1);
    } else {
      // No set number given; clear the list
      this.searchBarPlaceholder = this.defaultSearchBarPlaceholder;
      this.parts = [];
    }
  }

  private recursivelyBuildPartsList(pageNumber: number, page?: SetInventoryPage | HttpErrorResponse | null) {
    if (page instanceof HttpErrorResponse) {
      // It's an error!
      this.handleError((page as HttpErrorResponse).status);
      return;
    }

    if (page) {
      this.inProgressPartList.push(...page.results);
    } else {
      this.inProgressPartList = [];
    }

    if (!page || page.next) {
      // If there's no current page (indicating that we're at the first one) or if there's a next
      // page, then grab it and recurse again.
      const page$ = this.rebrickable.getSetInventoryPage(this.setNumber, pageNumber);
      const subscription = page$
        .pipe(take(1), catchError(error => of(error)))
        .subscribe(nextPage => {
          this.recursivelyBuildPartsList(pageNumber + 1, nextPage);
        });
      this.subscriptions.push(subscription);
    } 
    else if (!page.next) {
      // There is no next page, so the list is done.
      this.parts = this.inProgressPartList;

      if (this.parts.length === 0) {
        // couldn't get inventory
        this.showNoPartsFoundToast();
      }

      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  // refresh(ev: any) {
  //   setTimeout(() => {
  //     (ev as RefresherCustomEvent).detail.complete();
  //   }, 3000);
  // }

}
