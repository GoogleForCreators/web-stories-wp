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
import { fireEvent } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { act } from 'react-dom/test-utils';
import { renderWithProviders } from '../../../testUtils/';
import Tooltip from '../';

describe('<Tooltip />', function () {
  it('should be not visible when the mouse is not hovering over the container', function () {
    const { getByText } = renderWithProviders(
      <Tooltip content="Grid View">
        <div />
      </Tooltip>
    );

    expect(getByText('Grid View')).not.toBeVisible();
  });

  it('should be visible when the mouse is hovering over the container', function () {
    const { getByTestId, getByText } = renderWithProviders(
      <Tooltip content="Grid View">
        <div />
      </Tooltip>
    );

    const mouseEvent = new MouseEvent('mouseover', {
      bubbles: true,
      cancelable: false,
    });

    act(() => {
      fireEvent(getByTestId('tooltip-container'), mouseEvent);
    });

    expect(getByText('Grid View')).toBeVisible();
  });
});
