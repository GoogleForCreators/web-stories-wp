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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import ProductList from '../productList';
import { ConfigContext } from '../../../../../app/config';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  max-width: 350px;
`;

const products = [
  {
    productId: 'sb-36',
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
    productId: 'sb-37',
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
    productId: 'sb-38',
    productTitle: 'Hoodie',
    productBrand: '',
    productPrice: 42,
    productPriceCurrency: 'USD',
    productImages: [
      {
        url: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page1_bg-alt.png',
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
    productId: 'sb-39',
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

const configValue = {
  locale: 'en-US',
};

export default {
  title: 'Stories Editor/Components/ProductList',
  component: ProductList,
  args: {
    products,
    isMenuFocused: true,
    onPageProducts: [],
  },
  argTypes: {
    onClick: { action: 'button clicked' },
  },
};

export const PageWithProducts = (args) => {
  return (
    <ConfigContext.Provider value={configValue}>
      <Container>
        <ProductList
          {...args}
          onPageProducts={[
            { elementId: '123', product: { productId: 'sb-38' } },
          ]}
        />
      </Container>
    </ConfigContext.Provider>
  );
};

export const _default = (args) => {
  return (
    <ConfigContext.Provider value={configValue}>
      <Container>
        <ProductList {...args} />
      </Container>
    </ConfigContext.Provider>
  );
};
