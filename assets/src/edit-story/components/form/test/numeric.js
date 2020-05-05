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
import { Numeric } from '../';
import { renderWithTheme } from '../../../testUtils';

describe('Form/Numeric', () => {
  const arrowUp = (node) =>
    fireEvent.keyDown(node, { key: 'ArrowUp', which: 38 });
  const arrowDown = (node) =>
    fireEvent.keyDown(node, { key: 'ArrowDown', which: 40 });

  it('should render <Numeric /> form', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByTestId } = renderWithTheme(
      <Numeric
        value={0}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        data-testid="numeric"
      />
    );

    const input = getByTestId('numeric');

    expect(input).toBeDefined();
  });

  it('should increment on key up', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByTestId } = renderWithTheme(
      <Numeric
        value={0}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        data-testid="numeric"
      />
    );

    const input = getByTestId('numeric');
    arrowUp(input);

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it('should ceil float on key up', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByTestId } = renderWithTheme(
      <Numeric
        value={1.3}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        data-testid="numeric"
      />
    );

    const input = getByTestId('numeric');
    arrowUp(input);

    expect(onChangeMock).toHaveBeenCalledWith(2);
  });

  it('should decrement on key down', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByTestId } = renderWithTheme(
      <Numeric
        value={2}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        data-testid="numeric"
      />
    );

    const input = getByTestId('numeric');
    arrowDown(input);

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it('should floor float on key down', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByTestId } = renderWithTheme(
      <Numeric
        value={2.3}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        data-testid="numeric"
      />
    );

    const input = getByTestId('numeric');
    arrowDown(input);

    expect(onChangeMock).toHaveBeenCalledWith(2);
  });
});
