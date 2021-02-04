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
import { renderWithTheme } from '../../../testUtils';
import { Toggle } from '../';

describe('Form/Toggle', () => {
  it('should render <Toggle /> form', () => {
    const onChangeMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Toggle value={0} onChange={onChangeMock} aria-label="Toggle" />
    );

    const toggle = getByRole('checkbox', { name: 'Toggle' });

    expect(toggle).toBeInTheDocument();
  });

  it('should simulate a change on <Toggle />', () => {
    const onChangeMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Toggle
        value={1}
        checked={false}
        onChange={onChangeMock}
        aria-label="Toggle"
      />
    );

    const toggle = getByRole('checkbox', { name: 'Toggle' });

    expect(toggle.checked).toStrictEqual(false);

    fireEvent.change(toggle, { target: { checked: 'checked' } });

    expect(toggle.checked).toStrictEqual(true);
  });
});
