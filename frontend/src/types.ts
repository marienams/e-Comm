import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
// This looks similar to pedantic base models
export interface Options {
  headers?: HttpHeaders | Record<string, string | string[]>;
  observe?: 'body';
  context?: HttpContext;
  params?:
    | HttpParams
    | Record<
        string,
        string | number | boolean | ReadonlyArray<string | number | boolean>
      >;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
}

export interface Products{
    //how will the products we get would look like
    // probably use it for displaying
    items: Product[];
    total: number;
    page: number;
    perPage:number;
    totalpages: number;
}

export interface Product{
    // data on 1 product
    price: string;
    name: string;
    image: string;
    rating:string;
}

export interface PaginationParams{
    // these values, passed to server, to control number of pages sent, avoid high latency
    // we use the following line, because in products.service.ts, under get products, the params type should be Options but is pagination, so we ad
    //add this line to even out the type, now Pagination formatted to Options
    [params: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    page: number;
    perPage: number;
}

export interface User {
  name: string;
  email: string;
  password: string;
  cart: number[];
}
