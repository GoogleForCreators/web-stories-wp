/*
 * Copyright 2020 Google LLC
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
import AdNetworkSettings from '..';
import { AD_NETWORK_TYPE } from '../../../../../constants';
import { renderWithProviders } from '../../../../../testUtils';

describe('Editor Settings: Ad network settings <AdNetworkSettings />', function () {
  let adNetwork;
  let mockUpdate;

  beforeEach(() => {
    adNetwork = AD_NETWORK_TYPE.NONE;
    mockUpdate = jest.fn((id) => {
      adNetwork = id;
    });
  });

  afterEach(() => {
    adNetwork = AD_NETWORK_TYPE.NONE;
  });

  it('should render ad network settings dropdown button', function () {
    renderWithProviders(
      <AdNetworkSettings adNetwork={adNetwork} handleUpdate={mockUpdate} />
    );

    const networkDropdown = screen.getByRole('button');
    expect(networkDropdown).toHaveTextContent('None');
  });
});
