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
export default [
  {
    productId: 'kt-38',
    productTitle: 'Logo Collection',
    productBrand: '',
    productPrice: 18,
    productPriceCurrency: 'USD',
    productImages: [
      {
        url: 'http://example.com/belt-2-2.jpg',
        alt: '',
      },
      {
        url: 'http://example.com/beanie-2-2.jpg',
        alt: '',
      },
      { url: false, alt: '' },
    ],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://example.com/product/logo-collection',
    },
    productDetails: 'This is a grouped product.',
    productUrl: 'http://example.com/product/logo-collection',
  },
  {
    productId: 'kt-39',
    productTitle: 'WordPress Pennant',
    productBrand: '',
    productPrice: 11.05,
    productPriceCurrency: 'USD',
    productImages: [],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://example.com/product/wordpress-pennant',
    },
    productDetails: 'This is an external product.',
    productUrl: 'http://example.com/product/wordpress-pennant',
  },
  {
    productId: 'kt-36',
    productTitle: 'T-Shirt with Logo',
    productBrand: '',
    productPrice: 18,
    productPriceCurrency: 'USD',
    productImages: [],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://example.com/product/t-shirt-with-logo',
    },
    productDetails: 'This is a simple product.',
    productUrl: 'http://example.com/product/t-shirt-with-logo',
  },
  {
    productId: 'kt-37',
    productTitle: 'Beanie with Logo',
    productBrand: '',
    productPrice: 18,
    productPriceCurrency: 'USD',
    productImages: [],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://example.com/product/beanie-with-logo',
    },
    productDetails: 'This is a simple product.',
    productUrl: 'http://example.com/product/beanie-with-logo',
  },
  {
    productId: 'kt-28',
    productTitle: 'Album',
    productBrand: '',
    productPrice: 15,
    productPriceCurrency: 'USD',
    productImages: [],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://example.com/product/album',
    },
    productDetails: 'This is a simple, virtual product.',
    productUrl: 'http://example.com//product/album',
  },
  {
    productId: 'kt-29',
    productTitle: 'Single',
    productBrand: '',
    productPrice: 2,
    productPriceCurrency: 'USD',
    productImages: [],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://example.com/product/single',
    },
    productDetails: 'This is a simple, virtual product.',
    productUrl: 'http://example.com/product/single',
  },
  {
    productId: 'kt-25',
    productTitle: 'Hoodie with Pocket',
    productBrand: '',
    productPrice: 35,
    productPriceCurrency: 'USD',
    productImages: [],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://localhost:10004/product/hoodie-with-pocket/',
    },
    productDetails: 'This is a simple product.',
    productUrl: 'http://localhost:10004/product/hoodie-with-pocket/',
  },
  {
    productId: 'kt-26',
    productTitle: 'Hoodie with Zipper',
    productBrand: '',
    productPrice: 45,
    productPriceCurrency: 'USD',
    productImages: [],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://localhost:10004/product/hoodie-with-zipper/',
    },
    productDetails: 'This is a simple product.',
    productUrl: 'http://localhost:10004/product/hoodie-with-zipper/',
  },
  {
    productId: 'kt-18',
    productTitle: 'Hoodie',
    productBrand: '',
    productPrice: 42,
    productPriceCurrency: 'USD',
    productImages: [
      {
        url: 'http://localhost:10004/wp-content/uploads/2022/04/hoodie-blue-1.jpg',
        alt: '',
      },
      {
        url: 'http://localhost:10004/wp-content/uploads/2022/04/hoodie-green-1.jpg',
        alt: '',
      },
      {
        url: 'http://localhost:10004/wp-content/uploads/2022/04/hoodie-with-logo-2.jpg',
        alt: '',
      },
    ],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://localhost:10004/product/hoodie/',
    },
    productDetails: 'This is a variable product.',
    productUrl: 'http://localhost:10004/product/hoodie/',
  },
  {
    productId: 'kt-19',
    productTitle: 'Hoodie with Logo',
    productBrand: '',
    productPrice: 45,
    productPriceCurrency: 'USD',
    productImages: [],
    aggregateRating: {
      ratingValue: 0,
      reviewCount: 0,
      reviewUrl: 'http://localhost:10004/product/hoodie-with-logo/',
    },
    productDetails: 'This is a simple product.',
    productUrl: 'http://localhost:10004/product/hoodie-with-logo/',
  },
];

function compareStrings(key, order = 'asc') {
  return (a, b) => {
    const comparison = a[key].localeCompare(b[key]);
    return order === 'desc' ? comparison * -1 : comparison;
  };
}

export const sortStrings = (obj, key, order) => {
  return obj.sort(compareStrings(key, order));
};
