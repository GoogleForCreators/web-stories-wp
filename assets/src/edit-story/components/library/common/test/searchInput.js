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
import { SearchInput } from '../';
import { renderWithTheme } from '../../../../testUtils';

jest.useFakeTimers();

describe('SearchInput', () => {
  const pressEnter = (node) =>
    fireEvent.keyDown(node, { key: 'Enter', code: 'Enter' });
  const triggerOnChange = (node) => fireEvent.change(node);

  const setInputValue = (input, value) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call(input, value);
  };

  it('should render <SearchInput /> form', () => {
    const { getByRole } = renderWithTheme(
      <SearchInput
        initialValue={'dog'}
        placeholder={'Hello'}
        onSearch={() => {}}
      />
    );

    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('should not trigger onSearch when incremental is false and text changes', () => {
    const onSearchMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <SearchInput
        initialValue={'dog'}
        placeholder={'Hello'}
        onSearch={onSearchMock}
        incremental={false}
      />
    );

    const input = getByRole('textbox');
    setInputValue(input, 'cat');
    triggerOnChange(input);

    expect(onSearchMock).not.toHaveBeenCalled();
  });

  it('should trigger onSearch when incremental is false and enter is pressed', () => {
    const onSearchMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <SearchInput
        initialValue={'dog'}
        placeholder={'Hello'}
        onSearch={onSearchMock}
        incremental={false}
      />
    );

    const input = getByRole('textbox');
    setInputValue(input, 'cat');
    triggerOnChange(input);

    expect(onSearchMock).not.toHaveBeenCalled();

    pressEnter(input);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSearch when incremental is false and text is emptied', () => {
    const onSearchMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <SearchInput
        initialValue={'d'}
        placeholder={'Hello'}
        onSearch={onSearchMock}
        incremental={false}
      />
    );

    const input = getByRole('textbox');
    setInputValue(input, '');
    triggerOnChange(input);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSearch when incremental is true and text changes', () => {
    const onSearchMock = jest.fn();

    const { getByDisplayValue } = renderWithTheme(
      <SearchInput
        initialValue={'d'}
        placeholder={'Hello'}
        onSearch={onSearchMock}
        incremental={true}
        delayMs={0}
      />
    );

    const input = getByDisplayValue('d');
    setInputValue(input, 'cat');
    triggerOnChange(input);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSearch when incremental is true and text changes, with some delay', () => {
    const onSearchMock = jest.fn();

    const { getByDisplayValue } = renderWithTheme(
      <SearchInput
        initialValue={'d'}
        placeholder={'Hello'}
        onSearch={onSearchMock}
        incremental={true}
        delayMs={2000}
      />
    );

    const input = getByDisplayValue('d');
    setInputValue(input, 'cat');
    triggerOnChange(input);

    expect(onSearchMock).not.toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2001);

    expect(onSearchMock).toHaveBeenCalledTimes(1);
  });
});
