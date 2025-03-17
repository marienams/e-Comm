import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product, User } from '../../../types';
import { CartServiceService } from '../../services/cart-service.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../page-layout/header/header.component";
import { FooterComponent } from "../../page-layout/footer/footer.component";

@Component({
  selector: 'app-cart',
  imports: [DialogModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  // getting product from cart service
  product: Product = {
    price: '',
    name: '',
    image: '',
    rating:'',
  };
  //get cart product array from header component
  

  constructor(private cartService: CartServiceService, private Route: Router){
    // a shared service to add products to cart
    // this.cartService.cartProduct.subscribe((cartProduct) => {
    //   this.allCartProducts.push(cartProduct);
    // });
  }

  @Input() display: boolean = false
  allCartProducts: Product[] = []
  @Output() displayChange = new EventEmitter<boolean>();

  onHomeClick(){
    this.display = false
    this.displayChange.emit(this.display)
    this.Route.navigateByUrl('')
  }
  ngOnInit(){
    this.cartService.cartProducts$.subscribe((products)=>{
      this.allCartProducts = products.flat();
      console.log('Cart in cart component ', this.allCartProducts)
    })
  }
  // this has nothing to do with cartService behaviour subject
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['allCartProducts']) {
  //     console.log('ngOnChanges - allCartProducts:', changes['allCartProducts'].currentValue);
  //   }
  // }
  
  onProductRemove(){
    console.log("Product remove clicked")
  }


}
