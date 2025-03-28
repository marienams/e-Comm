import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product, User } from '../../../types';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CartServiceService } from '../../services/cart-service.service';
import { UserService } from '../../services/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-product',
  imports: [RatingModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})


export class ProductComponent {
  constructor(private cartService: CartServiceService,private userService: UserService) {
    
  }
  // the exclamation signifies that product has to be provided to this initialization
  // product is child component and will receive data from parent component, home
  @Input() product!: Product;
  currentUser: User ={
    name: '',
    email: '',
    password: '',
    cart:[]
  }


  addToCart() {
    // TO DO: add a condition to check if user is logged in
    this.cartService.updateCart(this.product)
    // getting user from cart share service
    this.cartService.currentUser$.subscribe(
      user => this.currentUser = user
      
    )
    this.sendToCart()
  }
  // API call to send product to user cart
  sendToCart(){
    const userInfo = localStorage.getItem('userInfo');
    if(!userInfo){
      return console.log("Log in");
    }
    const parsedUserInfo = JSON.parse(userInfo)
    const params = {productName: this.product.name, user: parsedUserInfo}
    this.userService.addToCart("http://localhost:3000/addToCart", params).subscribe({
      next: (response) => console.log("Added to cart as well as db"),
      error: (err) => console.error('Error fetching cart: ',err)
    })
  }

  
}
