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
import { Button } from '../';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('Button', () => {
  const buttonText = 'Some button text';
  const onClickMock = jest.fn();

  it('should render the default non cta button', () => {
    const { getByText } = renderWithProviders(
      <Button onClick={onClickMock}>{buttonText}</Button>
    );

    expect(getByText(buttonText)).toBeDefined();
  });

  it('should not allow onClick action when <Button /> is disabled', () => {
    const { getByText } = renderWithProviders(
      <Button isDisabled onClick={onClickMock}>
        {buttonText}
      </Button>
    );

    const button = getByText(buttonText);
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should simulate a click on <Button />', () => {
    const { getByText } = renderWithProviders(
      <Button onClick={onClickMock}>{buttonText}</Button>
    );

    const button = getByText(buttonText);

    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
