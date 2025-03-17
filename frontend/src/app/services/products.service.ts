import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { PaginationParams, Products } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private apiService: ApiService) {}
  // arow function, get products get the res from server
  // observable is Products type because this will return products, paginated

  getProducts = (
    url: string,
    params: PaginationParams
  ): Observable<Products> => {
    // we now cal our generic function, passing url and params
    return this.apiService.get(url, {
      // we did not just use params, because this params is pagination type, and apiservice is expecting Option type
      params,
      responseType: 'json',
    });
  };
}
