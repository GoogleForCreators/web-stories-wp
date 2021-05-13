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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import DropDownSelect from '../select';

describe('DropDown <DropDownSelect />', () => {
  const onClickMock = jest.fn();

  it('should render a <DropDownSelect /> button by default', () => {
    renderWithProviders(
      <DropDownSelect
        activeItemLabel={'chosen option'}
        dropDownLabel={'my label'}
        onSelectClick={onClickMock}
        placeholder={'my placeholder'}
      />
    );

    const select = screen.getByRole('button');
    expect(select).toBeInTheDocument();
  });

  it('should not trigger onSelectClick on click if select is disabled', () => {
    renderWithProviders(
      <DropDownSelect
        activeItemLabel={'chosen option'}
        disabled
        dropDownLabel={'my label'}
        onSelectClick={onClickMock}
        placeholder={'my placeholder'}
      />
    );

    const select = screen.getByText('my label');
    fireEvent.click(select);

    expect(onClickMock).toHaveBeenCalledTimes(0);
  });
});
