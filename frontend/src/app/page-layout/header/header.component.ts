import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserComponent } from '../../components/user/user.component';
import { LoginComponent } from '../../components/login/login.component';
import { Product, User } from '../../../types';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../../components/cart/cart.component';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartServiceService } from '../../services/cart-service.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, CartComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    private userService: UserService,
    private route: Router,
    private cartService: CartServiceService
  ) {}

  @Input() user!: User;
  @Input() cartProduct: Product = {
    id: 0,
    price: '',
    name: '',
    image: '',
    rating: '',
  };
  cart: Product[] = [];

  displayLoginPopup: boolean = false;
  isLoggedIn: boolean = false;
  displayCartPopup: boolean = false;
  cartItems: string[] = [];
  currUser: User = {
    name: '',
    email: '',
    password: '',
    cart: [],
  };
  isAuthenticated: boolean = false;

  @Output() loggedIn = new EventEmitter<User>();

  loginPage() {
    // Login/signup button click action
    //this.displayLoginPopup = true;
    this.route.navigateByUrl('login');
  }

  // OnConfirmAddUser(user: User) {
  //   this.addUser(user);
  //   this.isLoggedIn = true;
  //   this.displayLoginPopup = false;
  // }

  // OnConfirmLogin(user: User) {
  //   this.loginUser(user);
  //   this.isLoggedIn = true;
  //   this.displayLoginPopup = false;
  //   //this.getCart()
  //   this.currUser = user;

  // }

  displayCart() {
    //console.log("Cart to be displayed")
    this.getCart();
    //this.displayCartPopup = true;
    this.route.navigateByUrl('/cart');
  }

  logout() {
    this.isLoggedIn = false;
    this.route.navigateByUrl('');
    this.userService.logoutState();
    this.cartService.clearCart()
    this.cart = []
    localStorage.removeItem('cartProducts');
    
  }

  ngOnInit() {
    this.userService.checkUserSession();
    //getting is authenticated status from user service
    this.userService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  // API calls
  addUser(user: User) {
    this.userService
      .addUser('http://localhost:3000/user-register', user)
      .subscribe({
        next: (data) => {
          console.log('User Created');
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getCart() {
    // if(this.cart.length !==0) {
    //   console.log(" Cart not empty")
    //   return;
    // } 
    const params = { email: this.currUser.email };
    this.userService
      .getCart('http://localhost:3000/getCart', params)
      .subscribe({
        next: (response) => {
          //this.cart.push(response.cart);
          this.cart = response.cart;
          console.log(response.cart)
          this.cartService.updateUserCart(this.cart)
          //setting cart to loacl sotrage on getCart()
          localStorage.setItem('cart', JSON.stringify(response.cart))
        },

        error: (err) => console.error('Error fetching cart: ', err),
      });
  }
}
