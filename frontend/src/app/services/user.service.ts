import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Options, Product, User } from '../../types';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }
  
  // checking if user is authenticated state
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();
  // storing user data
  private userData = new BehaviorSubject<User | null>(null)
  userData$ = this.userData.asObservable();

  loginState(user: User) {
    // const token = localStorage.getItem('token');
    // if(!token) {
      
    //   return ;
    // }
    // // checking if token is expired
    // const decodedJWT: any = jwtDecode(token);
    // if(decodedJWT.expired * 1000 < Date.now()){
    //   this.isAuthenticated.next(false);
    //   this.logoutState();
    //   return;
    // }
    //console.log("Logged In state updated, token updated")
    this.isAuthenticated.next(true);  // Update state
    //console.log("is authenticated ", this.isAuthenticated);
    this.userData.next(user);         // Store user data
    //.setItem('user', JSON.stringify(user)); // Optional for persistence
  }

  logoutState() {
    this.isAuthenticated.next(false);
    this.userData.next(null);
    localStorage.removeItem('user'); // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('userInfo');
  }

  checkUserSession(): any {
    const storedUser = localStorage.getItem('user') ;
    if (storedUser ) {
      this.isAuthenticated.next(true);
      //this.userData.next(storedUser);
      
    }

    
  }


  // API abstraction
  addUser = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, {});
  };

  login = (url: string, body: any): Observable<any> => {
    return this.apiService.post(url, body, {});
  };

  logout(): void {
    localStorage.removeItem('jwtToken');
  }

  getCart = (url:string, params:any = {}): Observable<any> =>{
    return this.apiService.get(url, {params});
  }

  addToCart = (Url: string, body:any):Observable<any> =>{
    return this.apiService.post(Url, body, {});
  }

  deleteCartProduct = (Url: string, body: any): Observable<any> =>{
    return this.apiService.patch(Url, body, {});
  }  
}
