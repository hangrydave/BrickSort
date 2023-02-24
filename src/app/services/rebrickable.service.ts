import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription, take } from 'rxjs';
import { SetInventoryPage } from '../models/setInventory';
import { REBRICKABLE_API_KEY } from 'src/secrets';

@Injectable({
  providedIn: 'root'
})
export class RebrickableService {

  private headers: HttpHeaders;
  private currentSubscription?: Subscription;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': `key ${REBRICKABLE_API_KEY}`
    });
  }

  sanitizeSetNumber(setNumber: string): string {
    if (setNumber[setNumber.length - 2] != '-') {
      setNumber = setNumber + '-1';
    }
    return setNumber;
  }

  assembleSetInventoryPageUrl(setNumber: string, pageNumber: number): string {
    return `https://rebrickable.com/api/v3/lego/sets/${this.sanitizeSetNumber(setNumber)}/parts/?page=${pageNumber}`;
  }

  getSetInventoryPage(setNumber: string, pageNumber: number): Observable<SetInventoryPage> {
    // If currentSubscription is something else, we can unsubscribe from that
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    setNumber = this.sanitizeSetNumber(setNumber);

    const idForSetAndPage = `set${setNumber}_page${pageNumber}`;
    const partsFromCache = localStorage.getItem(idForSetAndPage);

    if (partsFromCache) {
      // Return the page from localStorage
      return of(JSON.parse(partsFromCache) as SetInventoryPage);
    } else {
      // Return the page from rebrickable's API
      const url = this.assembleSetInventoryPageUrl(setNumber, pageNumber);
      const pageObservable = this.http.get<SetInventoryPage>(url, { headers: this.headers });

      // I want to be able to unsubscribe from this later, so record it
      this.currentSubscription = pageObservable.pipe(take(1)).subscribe(page => {
        localStorage.setItem(idForSetAndPage, JSON.stringify(page));
      });

      return pageObservable;
    }
  }
}
