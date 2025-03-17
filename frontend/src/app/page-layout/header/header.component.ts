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
    
  }

  ngOnInit() {
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

  // loginUser(user: User) {
  //   // here you contact request the API
  //   this.userService.login('http://localhost:3000/login', user).subscribe({
  //     next: (res: any) => {
  //       //);
  //       if (res.token) {
  //         localStorage.setItem('token', res.token);
  //         this.route.navigateByUrl('');
  //         this.userService.loginState(this.user)
  //         console.log("Logged in")
  //         this.isLoggedIn = true;
  //         this.currUser = user;
  //       }
  //     },
  //     error: (err) => {
  //       // Display error message if user not found or password is incorrect
  //       if (err.status === 404 || err.status === 401) {
  //         alert('Username or password is incorrect');
  //       } else {
  //         alert('An unexpected error occurred. Please try again.');
  //       }
  //     },
  //   });
  // }

  getCart() {
    const params = { email: this.currUser.email };
    this.userService
      .getCart('http://localhost:3000/getCart', params)
      .subscribe({
        next: (response) => {
          this.cart.push(response.cart);
          //console.log(this.cart);
          this.cartService.updateUserCart(this.cart)
        },

        error: (err) => console.error('Error fetching cart: ', err),
      });
  }
}
