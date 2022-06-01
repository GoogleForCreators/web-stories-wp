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
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */

import ShoppingSettings, { TEXT } from '..';
import { TEXT as SETTINGS_TEXT } from '../shopify';
import { renderWithProviders } from '../../../../testUtils';
import { SHOPPING_PROVIDER_TYPE } from '../../../../constants';

const updateSettings = jest.fn();

const vendors = {
  none: 'None',
  shopify: 'Shopify',
  woocommerce: 'WooCommerce',
};

const woocommerceDefault = {
  installed: true,
  active: true,
  canManage: true,
  link: 'http://www.example.com',
};

const mockGetProducts = jest.fn();

const config = {
  apiCallbacks: {
    getProducts: mockGetProducts,
  },
};

describe('Editor Settings: Shopping <Shopping />', function () {
  beforeEach(() => {
    updateSettings.mockReset();
  });

  it('should render Shopify inputs and helper texts', function () {
    renderWithProviders(
      <ConfigProvider config={config}>
        <ShoppingSettings
          shoppingProvider={SHOPPING_PROVIDER_TYPE.SHOPIFY}
          shopifyHost="yourstore.myshopify.com"
          shopifyAccessToken=""
          updateSettings={updateSettings}
          vendors={vendors}
          woocommerce={woocommerceDefault}
        />
      </ConfigProvider>
    );

    const input = screen.getByLabelText('Shopify Domain');
    expect(input).toBeInTheDocument();
    expect(input).toBeEnabled();

    const sectionHeader = screen.getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();
  });

  it('should render WooCommerce inputs and helper texts', function () {
    renderWithProviders(
      <ConfigProvider config={config}>
        <ShoppingSettings
          shoppingProvider={SHOPPING_PROVIDER_TYPE.WOOCOMMERCE}
          shopifyHost=""
          shopifyAccessToken=""
          updateSettings={updateSettings}
          vendors={vendors}
          woocommerce={woocommerceDefault}
        />
      </ConfigProvider>
    );

    const element = screen.getByTestId('woocommerceMessage');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Manage products in WooCommerce to make them available in Web Stories.'
    );
  });

  it('should render WooCommerce inputs and activation message', function () {
    renderWithProviders(
      <ConfigProvider config={config}>
        <ShoppingSettings
          shoppingProvider={SHOPPING_PROVIDER_TYPE.WOOCOMMERCE}
          shopifyHost=""
          shopifyAccessToken=""
          updateSettings={updateSettings}
          vendors={vendors}
          woocommerce={{
            ...woocommerceDefault,
            active: false,
            canManage: false,
          }}
        />
      </ConfigProvider>
    );

    const element = screen.getByTestId('woocommerceMessage');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Activate WooCommerce to easily add shoppable products to Web Stories.'
    );
  });

  it('should render WooCommerce  inputs and install message', function () {
    renderWithProviders(
      <ConfigProvider config={config}>
        <ShoppingSettings
          shoppingProvider={SHOPPING_PROVIDER_TYPE.WOOCOMMERCE}
          shopifyHost=""
          shopifyAccessToken=""
          updateSettings={updateSettings}
          vendors={vendors}
          woocommerce={{
            installed: false,
            active: false,
            canManage: false,
            link: 'http://www.example.com',
          }}
        />
      </ConfigProvider>
    );

    const element = screen.getByTestId('woocommerceMessage');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent(
      'Install WooCommerce to easily add shoppable products to Web Stories.'
    );
  });

  it('should update settings when pressing enter', function () {
    renderWithProviders(
      <ConfigProvider config={config}>
        <ShoppingSettings
          shoppingProvider={SHOPPING_PROVIDER_TYPE.SHOPIFY}
          shopifyHost="yourstore.myshopify.com"
          shopifyAccessToken=""
          updateSettings={updateSettings}
          vendors={vendors}
          woocommerce={woocommerceDefault}
        />
      </ConfigProvider>
    );

    const input = screen.getByLabelText('Shopify Domain');

    fireEvent.change(input, { target: { value: 'mynewstore.myshopify.com' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(updateSettings).toHaveBeenCalledWith({
      shopifyHost: 'mynewstore.myshopify.com',
    });
  });

  it('should update settings when clicking save button', function () {
    renderWithProviders(
      <ConfigProvider config={config}>
        <ShoppingSettings
          shoppingProvider={SHOPPING_PROVIDER_TYPE.SHOPIFY}
          shopifyHost="yourstore.myshopify.com"
          shopifyAccessToken=""
          updateSettings={updateSettings}
          vendors={vendors}
          woocommerce={woocommerceDefault}
        />
      </ConfigProvider>
    );

    const input = screen.getByLabelText('Shopify Domain');
    const button = screen.getByTestId('shopifyHostButton');

    fireEvent.change(input, {
      target: { value: 'https://mynewstore.myshopify.ca' },
    });
    fireEvent.click(button);
    const errorMessage = screen.getByText(SETTINGS_TEXT.INPUT_ERROR);
    expect(errorMessage).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'mynewstore.myshopify.com' } });
    fireEvent.click(button);
    expect(updateSettings).toHaveBeenCalledWith({
      shopifyHost: 'mynewstore.myshopify.com',
    });
  });

  it('should render test api connection button', async function () {
    renderWithProviders(
      <ConfigProvider config={config}>
        <ShoppingSettings
          shoppingProvider={SHOPPING_PROVIDER_TYPE.SHOPIFY}
          shopifyHost="yourstore.myshopify.com"
          shopifyAccessToken="123"
          updateSettings={updateSettings}
          vendors={vendors}
          woocommerce={woocommerceDefault}
        />
      </ConfigProvider>
    );

    const input = screen.getByTestId('shopify-test-connection');
    expect(input).toBeInTheDocument();

    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByTestId('api-status')).toHaveTextContent(
        'Connection successful'
      );
    });

    expect(screen.getByTestId('api-status')).toHaveTextContent(
      'Connection successful'
    );
  });
});
