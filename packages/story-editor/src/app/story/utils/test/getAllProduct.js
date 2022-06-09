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
import { ELEMENT_TYPES } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import getAllProducts from '../getAllProducts';

describe('getAllProducts', () => {
  it('should return empty', () => {
    expect(getAllProducts([])).toStrictEqual([]);
  });

  it('should return a product', () => {
    expect(
      getAllProducts([
        {
          elements: [
            {
              type: ELEMENT_TYPES.PRODUCT,
              product: { productId: 'b' },
            },
          ],
        },
      ])
    ).toStrictEqual([{ productId: 'b' }]);
  });

  it('should return unique products', () => {
    expect(
      getAllProducts([
        {
          elements: [
            {
              type: ELEMENT_TYPES.PRODUCT,
              product: { productId: 'a' },
            },
            {
              type: ELEMENT_TYPES.PRODUCT,
              product: { productId: 'b' },
            },
          ],
        },
        {
          elements: [
            {
              type: ELEMENT_TYPES.PRODUCT,
              product: { productId: 'b' },
            },
          ],
        },
      ])
    ).toStrictEqual([{ productId: 'a' }, { productId: 'b' }]);
  });
});
