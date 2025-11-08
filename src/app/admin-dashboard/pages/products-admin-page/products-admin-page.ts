import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from "@products/components/product-table/product-table";
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
    productsService = inject(ProductsService);
    paginationService = inject(PaginationService);

    productsPerPage = signal(10);

    productsResource = rxResource({ // Recurso reactivo para obtener la lista de productos con paginación
      params: () => ({
        page: this.paginationService.currentPage() - 1,
        limit: this.productsPerPage(),
      }),
      stream: ({ params }) => {
        return this.productsService.getProducts({
          offset: params.page * 9,
          limit: params.limit,
        });
      },
    })
}
