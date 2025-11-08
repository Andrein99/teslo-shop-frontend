import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class PaginationComponent {
  pages = input<number>(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    /**
     * Getter que retorna un arreglo con los numeros de paginas
     * desde 1 hasta el numero total de paginas.
     *
     * @returns number[]
     */
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  })
}
