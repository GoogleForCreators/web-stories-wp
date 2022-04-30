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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import ShoppingProviderDropDown from '..';
import { SHOPPING_PROVIDER_TYPE } from '../../../../constants';
import { renderWithProviders } from '../../../../testUtils';

describe('Editor Settings: Shopping provider settings <ShoppingProviderDropDown />', () => {
  let provider;
  let mockUpdate;

  beforeEach(() => {
    provider = SHOPPING_PROVIDER_TYPE.NONE;
    mockUpdate = jest.fn((id) => {
      provider = id;
    });
  });

  afterEach(() => {
    provider = SHOPPING_PROVIDER_TYPE.NONE;
  });

  it('should render shopping provider settings dropdown button', function () {
    renderWithProviders(
      <ShoppingProviderDropDown
        shoppingProvider={provider}
        handleUpdate={mockUpdate}
      />
    );

    const shoppingProviderDropdown = screen.getByRole('button');
    expect(shoppingProviderDropdown).toHaveTextContent('None');
  });
});
