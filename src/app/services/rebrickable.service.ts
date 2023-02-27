import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subscription, take } from 'rxjs';
import { SetDetails } from '../models/setDetails';
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

  private sanitizeSetNumber(setNumber: string): string {
    if (setNumber[setNumber.length - 2] != '-') {
      setNumber = setNumber + '-1';
    }
    return setNumber;
  }

  private getLocalStorageKeyForSetDetails(setNumber: string): string {
    return `set${setNumber}`;
  }

  private getLocalStorageKeyForSetAndPage(setNumber: string, pageNumber: number): string {
    return `set${setNumber}_page${pageNumber}`;
  }

  private assembleSetDetailsUrl(setNumber: string): string {
    return `https://rebrickable.com/api/v3/lego/sets/${this.sanitizeSetNumber(setNumber)}/`;
  }

  private assembleSetInventoryPageUrl(setNumber: string, pageNumber: number): string {
    return `https://rebrickable.com/api/v3/lego/sets/${this.sanitizeSetNumber(setNumber)}/parts/?page=${pageNumber}`;
  }

  getSetDetails(setNumber: string): Observable<SetDetails | HttpErrorResponse | null> {
    // If currentSubscription is something else, we can unsubscribe from that
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    setNumber = this.sanitizeSetNumber(setNumber);

    const localStorageKey = this.getLocalStorageKeyForSetDetails(setNumber);
    const fromCache = localStorage.getItem(localStorageKey);

    if (fromCache) {
      return of(JSON.parse(fromCache) as SetDetails);
    } else {
      const url = this.assembleSetDetailsUrl(setNumber);
      const obs = this.http.get<SetDetails>(url, { headers: this.headers });

      // I want to be able to unsubscribe from this later, so record it
      this.currentSubscription = obs
        .pipe(take(1), catchError(error => of(error)))
        .subscribe(result => {
          if (result instanceof HttpErrorResponse || !result) {
            return;
          }

          localStorage.setItem(localStorageKey, JSON.stringify(result));
        });

      return obs;
    }
  }

  getSetInventoryPage(setNumber: string, pageNumber: number): Observable<SetInventoryPage | HttpErrorResponse | null> {
    // If currentSubscription is something else, we can unsubscribe from that
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    setNumber = this.sanitizeSetNumber(setNumber);

    const localStorageKey = this.getLocalStorageKeyForSetAndPage(setNumber, pageNumber);
    const fromCache = localStorage.getItem(localStorageKey);

    if (fromCache) {
      // Return the page from localStorage
      return of(JSON.parse(fromCache) as SetInventoryPage);
    } else {
      // Return the page from rebrickable's API
      const url = this.assembleSetInventoryPageUrl(setNumber, pageNumber);
      const obs = this.http.get<SetInventoryPage>(url, { headers: this.headers });

      // I want to be able to unsubscribe from this later, so record it
      this.currentSubscription = obs
        .pipe(take(1), catchError(error => of(error)))
        .subscribe(result => {
          if (result instanceof HttpErrorResponse || !result) {
            return;
          }

          localStorage.setItem(localStorageKey, JSON.stringify(result));
        });

      return obs;
    }
  }
}
