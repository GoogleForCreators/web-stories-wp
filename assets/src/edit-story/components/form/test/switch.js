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
import '@testing-library/jest-dom/extend-expect';

/**
 * Internal dependencies
 */
import Switch from '../switch';
import { renderWithTheme } from '../../../testUtils';

describe('Switch', () => {
  it('should render with default state that can be updated', () => {
    const onLabel = 'On';
    const offLabel = 'Off';
    const onChange = jest.fn();

    const { getByText, getByRole } = renderWithTheme(
      <Switch onChange={onChange} />
    );

    const onLabelEl = getByText(onLabel);
    const onLabelRadio = getByRole('radio', { name: onLabel });
    const offLabelEl = getByText(offLabel);
    const offLabelRadio = getByRole('radio', { name: offLabel });

    expect(onLabelEl).toBeInTheDocument();
    expect(offLabelEl).toBeInTheDocument();

    expect(onLabelRadio.checked).toStrictEqual(false);
    expect(offLabelRadio.checked).toStrictEqual(true);

    fireEvent.click(onLabelEl);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should render with passed default value', () => {
    const onLabel = 'On';
    const offLabel = 'Off';
    const onChange = jest.fn();

    const { getByText, getByRole } = renderWithTheme(
      <Switch
        onChange={onChange}
        onLabel={onLabel}
        offLabel={offLabel}
        value={true}
      />
    );

    const onLabelEl = getByText(onLabel);
    const onLabelRadio = getByRole('radio', { name: onLabel });
    const offLabelEl = getByText(offLabel);
    const offLabelRadio = getByRole('radio', { name: offLabel });

    expect(onLabelRadio.checked).toStrictEqual(true);
    expect(offLabelRadio.checked).toStrictEqual(false);

    fireEvent.click(onLabelEl);

    expect(onChange).toHaveBeenCalledTimes(0);

    fireEvent.click(offLabelEl);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('should render as disabled', () => {
    const onLabel = 'On';
    const offLabel = 'Off';
    const onChange = jest.fn();

    const { getByText } = renderWithTheme(
      <Switch onChange={onChange} disabled />
    );

    fireEvent.click(getByText(onLabel));
    fireEvent.click(getByText(offLabel));

    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
