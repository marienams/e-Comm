import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Options, Product, User } from '../../types';

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
    
    this.isAuthenticated.next(true);  // Update state
    this.userData.next(user);         // Store user data
    localStorage.setItem('user', JSON.stringify(user)); // Optional for persistence
  }

  logoutState() {
    this.isAuthenticated.next(false);
    this.userData.next(null);
    localStorage.removeItem('user'); // Clear storage
  }

  checkUserSession() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.isAuthenticated.next(true);
      this.userData.next(JSON.parse(storedUser));
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
  
}
