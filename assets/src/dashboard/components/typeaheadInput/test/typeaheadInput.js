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
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import TypeaheadInput from '..';
import theme from '../../../theme';

const wrapper = (children) => {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

describe('TypeaheadInput', () => {
  const demoItems = [
    { value: '1', label: 'one' },
    { value: 'foo', label: 'two' },
    { value: false, label: 'invalid option' },
    { value: 'bar', label: 'three' },
  ];
  const onClickMock = jest.fn();

  it('should render a <TypeaheadInput /> by default', () => {
    const { getByRole } = wrapper(
      <TypeaheadInput
        inputId={'demo-search-component'}
        placeholder="placeholder text"
        ariaLabel="my typeahead input label"
        value={false}
        onChange={onClickMock}
        items={demoItems}
        isOpen={false}
      />
    );

    const Input = getByRole('textbox');

    expect(Input).toBeDefined();
  });

  it('should clear input value when button is clicked', () => {
    const { getByRole, getByTestId } = wrapper(
      <TypeaheadInput
        inputId={'demo-search-component'}
        placeholder="placeholder text"
        ariaLabel="my typeahead input label"
        value={'test'}
        onChange={onClickMock}
        items={demoItems}
        isOpen={false}
      />
    );

    const Input = getByRole('textbox');
    const inputValue = Input.value;
    expect(inputValue).toContain('test');

    const ClearButton = getByTestId('clear-search');

    fireEvent.click(ClearButton);
    const inputValue2 = Input.value;
    expect(inputValue2).toBe('');
  });
});
