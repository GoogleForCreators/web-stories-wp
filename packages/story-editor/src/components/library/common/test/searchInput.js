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
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import { SearchInput } from '..';

jest.useFakeTimers();

describe('SearchInput', () => {
  const pressEnter = (node) => fireEvent.submit(node.form);
  const triggerOnChange = (node) => fireEvent.change(node);

  const setInputValue = (input, value) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(input, value);
  };

  it('should render <SearchInput /> form', () => {
    renderWithTheme(
      <SearchInput
        initialValue={'dog'}
        placeholder={'Hello'}
        onSearch={() => {}}
      />
    );

    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should trigger onSearch when enter is pressed', () => {
    const onSearchMock = jest.fn();

    renderWithTheme(
      <SearchInput
        initialValue={'dog'}
        placeholder={'Hello'}
        onSearch={onSearchMock}
      />
    );

    const input = screen.getByRole('searchbox');
    setInputValue(input, 'cat');
    triggerOnChange(input);

    expect(onSearchMock).not.toHaveBeenCalled();

    pressEnter(input);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSearch when text is emptied', () => {
    const onSearchMock = jest.fn();

    renderWithTheme(
      <SearchInput
        initialValue={'d'}
        placeholder={'Hello'}
        onSearch={onSearchMock}
      />
    );

    const input = screen.getByRole('searchbox');
    setInputValue(input, '');
    triggerOnChange(input);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSearch when text changes, with some delay', () => {
    const onSearchMock = jest.fn();

    renderWithTheme(
      <SearchInput
        initialValue={'d'}
        placeholder={'Hello'}
        onSearch={onSearchMock}
        delayMs={2000}
      />
    );

    const input = screen.getByDisplayValue('d');
    setInputValue(input, 'cat');
    triggerOnChange(input);

    expect(onSearchMock).not.toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2001);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });
});
