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
import '@testing-library/jest-dom/extend-expect';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import Switch from '../switch';

describe('Switch', () => {
  it('should render with passed default value', () => {
    const onLabel = 'On';
    const offLabel = 'Off';
    const onChange = jest.fn();

    renderWithTheme(
      <Switch
        groupLabel="Switch"
        name="test-switch"
        onChange={onChange}
        onLabel={onLabel}
        offLabel={offLabel}
        value
      />
    );

    const onLabelEl = screen.getByText(onLabel);
    const onLabelRadio = screen.getByRole('radio', { name: onLabel });
    const offLabelEl = screen.getByText(offLabel);
    const offLabelRadio = screen.getByRole('radio', { name: offLabel });

    expect(onLabelRadio).toBeChecked();
    expect(offLabelRadio).not.toBeChecked();

    fireEvent.click(onLabelEl);

    expect(onChange).toHaveBeenCalledTimes(0);

    fireEvent.click(offLabelEl);

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith(expect.any(Object), false);
  });

  it('should render as disabled', () => {
    const onLabel = 'On';
    const offLabel = 'Off';
    const onChange = jest.fn();

    renderWithTheme(
      <Switch
        groupLabel="Switch"
        name="test-switch"
        onChange={onChange}
        onLabel={onLabel}
        offLabel={offLabel}
        disabled
      />
    );

    fireEvent.click(screen.getByText(onLabel));
    fireEvent.click(screen.getByText(offLabel));

    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
