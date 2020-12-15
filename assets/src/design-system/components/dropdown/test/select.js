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
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { DropdownSelect } from '../select';

describe('Dropdown <DropdownSelect />', () => {
  const onClickMock = jest.fn();

  it('should render a <DropdownSelect /> button by default', () => {
    const { getByRole } = renderWithProviders(
      <DropdownSelect
        activeItemLabel={'chosen option'}
        dropdownLabel={'my label'}
        onSelectClick={onClickMock}
        placeholder={'my placeholder'}
      />
    );

    const DropdownButton = getByRole('button');
    expect(DropdownButton).toBeDefined();
  });

  it('should not trigger onSelectClick on click if select is disabled', () => {
    const { getByLabelText } = renderWithProviders(
      <DropdownSelect
        activeItemLabel={'chosen option'}
        disabled={true}
        dropdownLabel={'my label'}
        onSelectClick={onClickMock}
        placeholder={'my placeholder'}
      />
    );

    const DropdownButton = getByLabelText('my label');
    fireEvent.click(DropdownButton);

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('should trigger onSelectClick on click', () => {
    const { getByLabelText } = renderWithProviders(
      <DropdownSelect
        activeItemLabel={'chosen option'}
        ariaLabel={'specific label for aria to override visible label'}
        dropdownLabel={'my label'}
        onSelectClick={onClickMock}
        placeholder={'my placeholder'}
      />
    );

    const DropdownButton = getByLabelText(
      'specific label for aria to override visible label'
    );
    fireEvent.click(DropdownButton);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
