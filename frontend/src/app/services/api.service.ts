import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Options, User } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
      // contains methods to make api calls
      //when api service class object is created, I guess http clinent is
      // is initiated
    
  ) { }
  // SUPER ABSTRACTION
  get<T> (url:string, options: Options): Observable<T> {
    return this.httpClient.get<T>(url,options) as Observable<T>;
  }

  // Used to make a POST request to the API
  post<T>(url: string, body: User, options: Options): Observable<T> {
    return this.httpClient.post<T>(url, body, options) as Observable<T>;
  }
}
