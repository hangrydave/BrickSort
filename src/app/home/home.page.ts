import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Animation, AnimationController, IonList, IonSearchbar, RefresherCustomEvent } from '@ionic/angular';
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

  public readonly defaultSearchBarPlaceholder = 'Search for set number';
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
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  public async titleClick() {
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

  public async onSearch(event: Event) {
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
      this.searchBarPlaceholder = value;
      this.recursivelyBuildPartsList(1);
    } else {
      this.searchBarPlaceholder = this.defaultSearchBarPlaceholder;
    }
  }

  private recursivelyBuildPartsList(pageNumber: number, page?: SetInventoryPage) {
    if (page) {
      this.inProgressPartList.push(...page.results);
    } else {
      this.inProgressPartList = [];
    }

    if (!page || page.next) {
      // If there's no current page (indicating that we're at the first one) or if there's a next
      // page, then grab it and recurse again.
      const page$ = this.rebrickable.getSetInventoryPage(this.setNumber, pageNumber);
      this.subscriptions.push(page$.pipe(take(1)).subscribe(nextPage => this.recursivelyBuildPartsList(pageNumber + 1, nextPage)));
    } else if (!page.next) {
      // There is no next page, so the list is done.
      this.parts = this.inProgressPartList;
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
