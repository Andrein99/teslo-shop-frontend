import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import swal from 'sweetalert';

import { FormUtils } from '@utils/form-utils';
import { ProductsService } from '@products/services/products.service';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import type { Product } from '@products/interfaces/product.interface';

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  product = input.required<Product>();

  router = inject(Router);
  fb = inject(FormBuilder);

  productsService = inject(ProductsService);
  wasSaved = signal(false);

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [[''],],
    images: [[],],
    tags: ['',],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    // this.productForm.patchValue(formLike as any);
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',')
            .map((tag) => tag.trim()) ?? [],
    };

    if(this.product().id === 'new') {
      // Crear producto
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike)
      );

      swal({
        title: "¡Creado!",
        text: "Se ha creado el producto correctamente",
        icon: "success",
      });
      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike)
      );

      swal({
          title: "¡Actualizado!",
          text: "Se ha actualizado el producto correctamente",
          icon: "success",
      });
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }


}
