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
import { Pill } from '../';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('Pill', () => {
  const pillText = 'Some pil text';
  const onClickMock = jest.fn();

  it('should render the default button as a pill', () => {
    const { getByRole } = renderWithProviders(
      <Pill onClick={onClickMock} isActive={false}>
        {pillText}
      </Pill>
    );

    expect(getByRole('button')).toHaveTextContent(pillText);
  });

  it('should not trigger a click on <Pill /> when disabled', () => {
    const { getByText } = renderWithProviders(
      <Pill disabled onClick={onClickMock} isActive={false}>
        {pillText}
      </Pill>
    );

    const pil = getByText(pillText);

    fireEvent.click(pil);

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should simulate a click on <Pill />', () => {
    const { getByText } = renderWithProviders(
      <Pill onClick={onClickMock} isActive={false}>
        {pillText}
      </Pill>
    );

    const pil = getByText(pillText);

    fireEvent.click(pil);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
