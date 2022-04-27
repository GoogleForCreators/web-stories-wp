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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import ShoppingSettings, { TEXT } from '..';
import { TEXT as SETTINGS_TEXT } from '../shopify';
import { renderWithProviders } from '../../../../testUtils';
import { SHOPPING_PROVIDER_TYPE } from '../../../../constants';

const updateSettings = jest.fn();

describe('Editor Settings: Shopping <Shopping />', function () {
  beforeEach(() => {
    updateSettings.mockReset();
  });

  it('should render Shopify inputs and helper texts', function () {
    renderWithProviders(
      <ShoppingSettings
        shoppingProvider={SHOPPING_PROVIDER_TYPE.SHOPIFY}
        shopifyHost="yourstore.myshopify.com"
        shopifyAccessToken=""
        updateSettings={updateSettings}
      />
    );

    const input = screen.getByLabelText('Shopify Domain');
    expect(input).toBeInTheDocument();
    expect(input).toBeEnabled();

    const sectionHeader = screen.getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();
  });

  it('should update settings when pressing enter', function () {
    renderWithProviders(
      <ShoppingSettings
        shoppingProvider={SHOPPING_PROVIDER_TYPE.SHOPIFY}
        shopifyHost="yourstore.myshopify.com"
        shopifyAccessToken=""
        updateSettings={updateSettings}
      />
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
      <ShoppingSettings
        shoppingProvider={SHOPPING_PROVIDER_TYPE.SHOPIFY}
        shopifyHost="yourstore.myshopify.com"
        shopifyAccessToken=""
        updateSettings={updateSettings}
      />
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
});
