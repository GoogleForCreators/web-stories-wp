/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import {
  type Element,
  ElementType,
  type Page,
  type ProductData,
  type ProductElement,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */

function isProduct(e: Element): e is ProductElement {
  return 'product' in e;
}
function getAllProducts(pages: Page[]): ProductData[] {
  const products: ProductData[] = [];
  const productIds: string[] = [];
  pages.forEach(({ elements }) =>
    elements.forEach((element) => {
      if (!isProduct(element)) {
        return;
      }
      const { product, type } = element;
      if (
        type === ElementType.Product &&
        product &&
        !productIds.includes(product.productId)
      ) {
        products.push(product);
        productIds.push(product.productId);
      }
    })
  );

  return products;
}

export default getAllProducts;
