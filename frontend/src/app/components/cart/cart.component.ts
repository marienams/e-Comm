import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { Product, User } from "../../../types";
import { CartServiceService } from "../../services/cart-service.service";
import { CommonModule } from "@angular/common";
import { ApiService } from "../../services/api.service";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { HeaderComponent } from "../../page-layout/header/header.component";
import { FooterComponent } from "../../page-layout/footer/footer.component";

@Component({
  selector: "app-cart",
  imports: [DialogModule, CommonModule],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent {
  // getting product from cart service
  product: Product = {
    id: -1,
    price: "",
    name: "",
    image: "",
    rating: "",
  };
  //get cart product array from header component

  constructor(
    private cartService: CartServiceService,
    private userService: UserService,
    private Route: Router
  ) {
    // a shared service to add products to cart
    // this.cartService.cartProduct.subscribe((cartProduct) => {
    //   this.allCartProducts.push(cartProduct);
    // });
  }
  user: User = {
    name: "",
      email: "",
      password: "",
      cart: []
  }

  userEmail: string = "Guest";
  @Input() display: boolean = false;
  allCartProducts: Product[] = [];
  @Output() displayChange = new EventEmitter<boolean>();

  onHomeClick() {
    this.display = false;
    this.displayChange.emit(this.display);
    this.Route.navigateByUrl("");
  }
  ngOnInit() {
    const localUser = localStorage.getItem('user');
    if(localUser){
      const parsedUser = localUser;
      console.log(parsedUser);
      this.userEmail = parsedUser;
      
    }
    // if local storage has a cart
    const savedCart = localStorage.getItem('cart');
    if(savedCart){
      this.allCartProducts = JSON.parse(savedCart);
      return;
    }
    // setting cart in shared service
    // this.cartService.cartProducts$.subscribe((products) => {
    //   this.allCartProducts = products.flat();

    //   //console.log("Cart in cart component ", this.allCartProducts);
    // });
    //setting current user in shared service
    // this.cartService.currentUser$.subscribe((user)=>{
    //   this.user = user;
    // })

  }
  // this has nothing to do with cartService behaviour subject
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['allCartProducts']) {
  //     console.log('ngOnChanges - allCartProducts:', changes['allCartProducts'].currentValue);
  //   }
  // }

  onProductRemove(product: Product) {
    // getting user from local storage
    const userInfo = localStorage.getItem('userInfo');
    if(!userInfo){
      return console.log("Log in");
    }
    const parsedUserInfo = JSON.parse(userInfo)
    // getting user from a shared service
    this.cartService.currentUser$.subscribe((user)=>{
      this.user = user;
    })
    // passing it to delete api
    this.deleteCartProduct(parsedUserInfo, product)
    
  }
//API call
  deleteCartProduct(user: User, product: Product) {
    
    const body = {
      email: user.email,
      product_id: product.id
    }
    // here you contact request the API
    this.userService.deleteCartProduct("http://localhost:3000/deleteCartProduct", body).subscribe({
      next: (res: any) => {
        //console.log(product.id)
        //console.log(res)
        // Remove the product from the local array
      this.allCartProducts = this.allCartProducts.filter(item => item.id !== product.id);
      
      // Update the cart service if needed
      //this.cartService.updateUserCart(this.allCartProducts);
        
      }
    });
  }
}
