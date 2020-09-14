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
import ToggleButtonGroup from '../';
import { renderWithProviders } from '../../../testUtils/';

const TEST_BUTTON_GROUP = [
  { label: 'label one', value: 'label_one' },
  { label: 'label two', value: 'label_two' },
  { label: 'label three', value: 'label_three' },
];

describe('ToggleButton', () => {
  const onClickMock = jest.fn();

  it('should render a button group with three items', () => {
    const { getAllByRole } = renderWithProviders(
      <ToggleButtonGroup
        buttons={TEST_BUTTON_GROUP.map((storyStatus) => {
          return {
            handleClick: onClickMock,
            key: storyStatus.value,
            isActive: status === storyStatus.value,
            text: storyStatus.label,
          };
        })}
      />
    );

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('should simulate a click on a button in <ToggleButtonGroup />', () => {
    const { getByText } = renderWithProviders(
      <ToggleButtonGroup
        buttons={TEST_BUTTON_GROUP.map((storyStatus) => {
          return {
            handleClick: onClickMock,
            key: storyStatus.value,
            isActive: status === storyStatus.value,
            text: storyStatus.label,
          };
        })}
      />
    );

    const button = getByText('label two');

    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
