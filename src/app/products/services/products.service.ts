import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';

import { Gender, type Product, type ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {
  private httpClient = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse>{
    /** Función que obtiene los productos de acuerdo a las opciones
     *  dadas: limit, offset y gender.  Si los productos ya fueron
     *  obtenidos previamente con esas opciones, los retorna desde
     *  la caché.
     * @param options Opciones para filtrar los productos.
     * @return Observable<ProductsResponse> Observable que emite la respuesta con los productos.
     */
    const { limit = 9, offset = 0, gender = ''} = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.httpClient.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit: limit,
        offset: offset,
        gender: gender
      }
    }).pipe(
      // tap((products) => console.log(products)),
      tap((products) => this.productsCache.set(key, products)),
    );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    /** Función que obtiene un producto a través de su IdSlug
     * dado. Si el producto ya fue obtenido previamente, lo retorna
     * desde la caché.
     * @param idSlug IdSlug del producto a obtener.
     * @return Observable<Product> Observable que emite el producto.
     */
    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.httpClient.get<Product>(`${baseUrl}/products/${idSlug}`).
      pipe(
        tap((product) => this.productCache.set(idSlug, product)),
      );
  }

  getProductById(id: string): Observable<Product> {
    /** Función que obtiene un producto a través de su Id
     * dado. Si el producto ya fue obtenido previamente, lo retorna
     * desde la caché.
     * @param id Id del producto a obtener.
     * @return Observable<Product> Observable que emite el producto.
     */
    if (id === 'new') {
      return of(emptyProduct); // Retorna un producto vacío para creación
    }

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.httpClient.get<Product>(`${baseUrl}/products/${id}`).
      pipe(
        tap((product) => this.productCache.set(id, product)),
      );
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList ): Observable<Product> {
    /**
     * Función que crea un nuevo producto en el sistema.
     * @param productLike Objeto parcial de producto con los datos a crear.
     * @param imageFileList Lista de archivos de imagen a subir.
     * @return Observable<Product> Observable que emite el producto creado.
     */
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map(imageNames => ({
          ...productLike,
          images: [...currentImages, ...imageNames]
        }) ),
        switchMap(createdProduct => {
          return this.httpClient.post<Product>(`${baseUrl}/products`, createdProduct);
        }),
        tap((product) => this.updateProductCache(product))
      );
  }

  updateProduct(id:string, productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    /**
     * Función que actualiza un producto existente en el sistema.
     * @param id Id del producto a actualizar.
     * @param productLike Objeto parcial de producto con los datos a actualizar.
     * @param imageFileList Lista de archivos de imagen a subir.
     * @return Observable<Product> Observable que emite el producto actualizado.
     */
    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map(imageNames => ({
          ...productLike,
          images: [...currentImages, ...imageNames]
        }) ),
        switchMap(updatedProduct => {
          return this.httpClient.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct);
        }),
        tap((product) => this.updateProductCache(product))
      );
  }

  updateProductCache(product: Product) {
    /** Función que actualiza la caché del producto
     *  dado en el servicio.
     * @param product Producto con los datos actualizados.
     */
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map((currentProduct) => {
        return currentProduct.id === productId ? product : currentProduct;
      });
    });
  }

  uploadImages(images?: FileList): Observable<string[]> {
    /**
     * Función que sube múltiples imágenes al servidor.
     * @param images Lista de archivos de imagen a subir.
     * @return Observable<string[]> Observable que emite una lista de nombres
     * de archivo de las imágenes subidas.
     */
    if (!images) return of([]);

    const uploadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile));

    return forkJoin(uploadObservables); // Espera a que todos los observables emitan un valor. Si uno falla lanza una excepción.
  }

  uploadImage(imageFile: File): Observable<string> {
    /**
     * Función que sube una imagen al servidor.
     * @param imageFile Archivo de imagen a subir.
     * @return Observable<string> Observable que emite el nombre
     * de archivo de la imagen subida.
     */
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.httpClient.post<{fileName: string}>(`${baseUrl}/files/product`, formData)
      .pipe(map(resp => resp.fileName));
  }
}
