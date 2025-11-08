import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
    .swiper {
      width: 100%;
    }
    .swiper-slide img {
      display: block;
      width: 100%;
      height: auto; /* ensures image drives slide height */
    }

  `
})
export class ProductCarousel implements AfterViewInit, OnChanges {
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiper: Swiper | undefined = undefined;

  ngAfterViewInit(): void {
    this.swiperInit();

  }

  ngOnChanges(changes: SimpleChanges): void {
    /**
     * Funcion que detecta cambios en las imagenes del carrusel y reinicia el swiper
     * para que tome las nuevas imagenes.
     *
     * @param changes - SimpleChanges
     */
    if (changes['images'].firstChange) {
      return;
    }

    if (!this.swiper) return;
    this.swiper.destroy(true, true);

    const paginationEl: HTMLDivElement = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');
    paginationEl.innerHTML = '';

    setTimeout(() => {
      this.swiperInit();
    }, 100);
  }

  swiperInit() {
    /**
     * Funcion que inicializa el swiper
     * @returns void
     */
      const element = this.swiperDiv().nativeElement;
      if (!element) return;

      this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [
        Navigation, Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
