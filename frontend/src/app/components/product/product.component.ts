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
      next: (response) => {
        // Step 1: Retrieve the existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Step 2: Check if the product already exists in the cart
    const productExists = cart.some((item: Product) => item.id === this.product.id);

    if (!productExists) {
        // Step 3: Add the new product to the cart array
        cart.push(this.product);

        // Step 4: Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        console.log('Product added successfully!');
    } else {
        console.log('Product already exists in the cart.');
    }
      },
      error: (err) => console.error('Error fetching cart: ',err)
    })
  }

  
}
