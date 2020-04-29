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
import { ToggleButton } from '../';
import { renderWithTheme } from '../../../testUtils/';

describe('ToggleButton', () => {
  const buttonText = 'Some button text';
  const onClickMock = jest.fn();

  it('should render the default non cta button', () => {
    const { getByText } = renderWithTheme(
      <ToggleButton onClick={onClickMock}>{buttonText}</ToggleButton>
    );

    expect(getByText(buttonText)).toBeDefined();
  });

  it('should simulate a click on <ToggleButton />', () => {
    const { getByText } = renderWithTheme(
      <ToggleButton onClick={onClickMock}>{buttonText}</ToggleButton>
    );

    const button = getByText(buttonText);

    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
