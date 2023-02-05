import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from './item.model';
import { Observable } from 'rxjs';

const BASE_URL = './assets/db.json';
const HEADER = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private http: HttpClient) { }

  getall(): Observable<Item> {
    return this.http.get<Item>(BASE_URL);
    
  }
 
}
