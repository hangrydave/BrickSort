import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Animation, AnimationController, IonList, IonSearchbar, LoadingController, RefresherCustomEvent, ToastController } from '@ionic/angular';
import { Subscription, take } from 'rxjs';
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

  public readonly defaultSearchBarPlaceholder = 'Set number (i.e. 7965)';
  public readonly defaultHelpText = 'Search for a set number in the above search bar!';
  public helpText = this.defaultHelpText;
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
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: `Loading parts for set ${this.setNumber}`,
    });
    await loading.present();
  }

  async showNoPartsFoundToast() {
    const toast = await this.toastCtrl.create({
      message: `Couldn't get inventory for set ${this.setNumber}; try another set number?`,
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
      await this.showLoading();

      this.searchBarPlaceholder = value;
      this.recursivelyBuildPartsList(1);
    } else {
      this.searchBarPlaceholder = this.defaultSearchBarPlaceholder;
      this.parts = [];
    }
  }

  private recursivelyBuildPartsList(pageNumber: number, page?: SetInventoryPage) {
    console.log(`page number ${pageNumber} for set number ${this.setNumber}`);

    if (page) {
      console.log(`pushing ${page.results.length} new parts to inProgressPartList`);

      this.inProgressPartList.push(...page.results);
    } else {
      console.log('page was not!');

      this.inProgressPartList = [];
    }

    if (!page || page.next) {
      console.log('trying to do a web request for the next page and then gonna subscribe');

      // If there's no current page (indicating that we're at the first one) or if there's a next
      // page, then grab it and recurse again.
      const page$ = this.rebrickable.getSetInventoryPage(this.setNumber, pageNumber);
      const sub = page$
        .pipe(take(1))
        .subscribe(nextPage => this.recursivelyBuildPartsList(pageNumber + 1, nextPage));
      this.subscriptions.push(sub);
    } 
    else if (!page.next) {
      console.log(`all ${this.parts.length} downloaded, yipee`);

      // There is no next page, so the list is done.
      this.parts = this.inProgressPartList;

      this.loadingCtrl.dismiss();
      if (this.parts.length === 0) {
        // couldn't get inventory
        this.showNoPartsFoundToast();
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

}
