import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, User } from '../../types';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
// FOR SENDING PRODUCTS ADDED TO CART, TO CART COMPONENT
  constructor(userService: UserService) { }
  // NEW PRODUCT
  newProduct: Product = {
    price: "",
    name: "",
    image: "",
    rating: ""
  }

   
  product = new BehaviorSubject(this.newProduct);
  currentCart$ = this.product.asObservable();
  
  // USER
  currUser: User = {
    name: "",
      email: "",
      password: "",
      cart: []
  }

  user = new BehaviorSubject(this.currUser);
  currentUser$ = this.user.asObservable();
  
  // PRODUCTS FROM CART
  cart = new BehaviorSubject<Product[]>([]);
  cartProducts$ = this.cart.asObservable()

  //function to update the cart data
  updateUserCart(products: Product[]){
    this.cart.next([...products])
  }

  // update value of cart
  updateCart(newProduct: Product){
    this.product.next(newProduct)
  }

  getCurrentUser(): User {
    return this.user.getValue(); // Retrieve the current user synchronously if needed
  }

  // update value of user
  updateUser(newUser: User){
    console.log("Login user shared")
    // clear cart
    this.cart.next([])
    console.log(this.cart, " current cart")
    // when new user logs in
    this.user.next(newUser)
  }

  clearCart(){
    console.log("Logout cart called")
    // this.cart.next([])
  }

  
}
