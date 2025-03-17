import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { User } from '../../../types';
import { FormsModule } from '@angular/forms';
import { CartServiceService } from '../../services/cart-service.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [DialogModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private cartService: CartServiceService, private route: Router, private userService: UserService){}

  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();

  @Input() user: User= {
    name:"",
    email: "",
    password: "",
    cart:[]
  }
  isAuthenticated: boolean = false;

  ngOnInit(){
    this.userService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
  }
  // When user is created
  @Output() signup = new EventEmitter<User>();
  onSignUp(){
    this.signup.emit(this.user)
    this.addUser(this.user)
    // do we need to emit?
  }

  onCancel() {
    // When user clicks cancel on login page
    this.route.navigateByUrl('')
    
  }

  //@Output() login = new EventEmitter<User>();
  onLogin(){
    console.log("Logn Click action")
    //clear cart array for new user
    //this.cartService.clearCart()
    // cart service has the user, to be used for get and add cart
    this.cartService.updateUser(this.user)
    // after login, navigate back home
    this.route.navigateByUrl('')
    this.userService.loginState(this.user)
    this.loginUser(this.user)
  }
  //API calls
  loginUser(user: User) {
    console.log("Login API called")
    // here you contact request the API
    this.userService.login('http://localhost:3000/login', user).subscribe({
      next: (res: any) => {
        //);
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.route.navigateByUrl('');
          this.userService.loginState(this.user)
          //console.log(res.token)
          
        }
      },
      error: (err) => {
        // Display error message if user not found or password is incorrect
        if (err.status === 404 || err.status === 401) {
          alert('Username or password is incorrect');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      },
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

}
