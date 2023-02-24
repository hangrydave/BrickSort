import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subscription, take } from 'rxjs';
import { SetInventoryPage } from '../models/setInventory';

@Injectable({
  providedIn: 'root'
})
export class RebrickableService {

  private readonly localStorageKeyForApiKey = 'rebrickableApiKey';
  private headers: HttpHeaders;
  private currentSubscription?: Subscription;
  private apiKey: string | null = null;

  constructor(private http: HttpClient) {
    const key = localStorage.getItem(this.localStorageKeyForApiKey);
    if (key) {
      this.setApiKey(key);
    }
  }

  hasApiKey(): boolean {
    return this.apiKey !== null;
  }

  setApiKey(key: string) {
    this.apiKey = key;
    this.headers = new HttpHeaders({
      'Authorization': `key ${key}`
    });
    localStorage.setItem(this.localStorageKeyForApiKey, key);
  }

  private getLocalStorageKeyForSetAndPage(setNumber: string, pageNumber: number): string {
    return `set${setNumber}_page${pageNumber}`;
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

  getSetInventoryPage(setNumber: string, pageNumber: number): Observable<SetInventoryPage | HttpErrorResponse | null> {
    // If currentSubscription is something else, we can unsubscribe from that
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    setNumber = this.sanitizeSetNumber(setNumber);

    const idForSetAndPage = this.getLocalStorageKeyForSetAndPage(setNumber, pageNumber);
    const partsFromCache = localStorage.getItem(idForSetAndPage);

    if (partsFromCache) {
      // Return the page from localStorage
      return of(JSON.parse(partsFromCache) as SetInventoryPage);
    } else {
      // Return the page from rebrickable's API
      const url = this.assembleSetInventoryPageUrl(setNumber, pageNumber);
      const pageObservable = this.http.get<SetInventoryPage>(url, { headers: this.headers });

      // I want to be able to unsubscribe from this later, so record it
      this.currentSubscription = pageObservable
        .pipe(take(1), catchError(error => of(error)))
        .subscribe(page => {
          if (page instanceof HttpErrorResponse || !page) {
            return;
          }

          localStorage.setItem(idForSetAndPage, JSON.stringify(page));
        });

      return pageObservable;
    }
  }
}
