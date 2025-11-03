import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  private httpClient = inject(HttpClient);

  getProducts(options: Options): Observable<ProductsResponse>{
    const { limit = 9, offset = 0, gender = ''} = options;

    return this.httpClient.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit: limit,
        offset: offset,
        gender: gender
      }
    }).pipe(
      tap((products) => console.log(products))
    );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    return this.httpClient.get<Product>(`${baseUrl}/products/${idSlug}`);
  }
}
