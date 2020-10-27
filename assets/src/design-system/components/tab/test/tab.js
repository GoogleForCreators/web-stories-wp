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
import { Tab } from '../';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('Tab', () => {
  const tabText = 'Some tab text';
  const onClickMock = jest.fn();

  it('should render the default button with role of tab', () => {
    const { getByRole } = renderWithProviders(
      <Tab onClick={onClickMock}>{tabText}</Tab>
    );

    expect(getByRole('tab')).toHaveTextContent(tabText);
  });

  it('should not trigger a click on <Tab /> when disabled', () => {
    const { getByText } = renderWithProviders(
      <Tab disabled onClick={onClickMock}>
        {tabText}
      </Tab>
    );

    const tab = getByText(tabText);

    fireEvent.click(tab);

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should simulate a click on <Tab />', () => {
    const { getByText } = renderWithProviders(
      <Tab onClick={onClickMock}>{tabText}</Tab>
    );

    const tab = getByText(tabText);

    fireEvent.click(tab);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
