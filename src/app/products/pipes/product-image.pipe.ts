import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): string {
    /**
     * Pipe que recibe un string o un arreglo de strings (nombres de imagenes)
     * y retorna la url completa de la imagen. Si el valor es null o el arreglo
     * esta vacio, retorna una imagen por defecto.
     *
     * @param value - string | string[] | null
     * @returns string
     */

    if (value === null) {
      return './assets/images/no-image.jpg'
    }

    if (typeof value === 'string' && value.startsWith('blob:')) {
      return value;
    }

    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`
    }

    const image = value.at(0);
    if (!image) {
      return './assets/images/no-image.jpg'
    }

    return `${baseUrl}/files/product/${image}`
  }
}
