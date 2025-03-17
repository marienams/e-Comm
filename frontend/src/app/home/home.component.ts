import { Component, Input } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { CartComponent } from "../components/cart/cart.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}

  products: Product[] = []
  cartProducts: string[] = []
  totalRecords: number = 0;
  rows: number= 5;


  onPageChange(event: any){
    // QUESTION: where did event had a page and a rows property
    this.fetchProducts(event.page, event.rows)

  }

  fetchProducts(page: number, perPage:number){
    this.productsService
      .getProducts('http://localhost:3000/clothes', { page, perPage })
      // you are subscribing to the observable object returned from a series of functions
      .subscribe((products: Products) => {
        // you subscribe to a type of object, useful since you can  access Products properties using products.(property name list appears)
        this.products = products.items;
        // total amount of products
        this.totalRecords = products.total;
      });
  }

  ngOnInit() {
    this.fetchProducts(0,this.rows);
  }
}
