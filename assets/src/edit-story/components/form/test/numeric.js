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
  const arrowUp = (node) => {
    fireEvent.keyDown(node, { key: 'ArrowUp', which: 38 });
    fireEvent.keyDown(node, { key: 'Enter', which: 13 });
  };
  const altArrowUp = (node) => {
    fireEvent.keyDown(node, { key: 'ArrowUp', which: 38, altKey: true });
    fireEvent.keyDown(node, { key: 'Enter', which: 13 });
  };
  const arrowDown = (node) => {
    fireEvent.keyDown(node, { key: 'ArrowDown', which: 40 });
    fireEvent.keyDown(node, { key: 'Enter', which: 13 });
  };
  const altArrowDown = (node) => {
    fireEvent.keyDown(node, { key: 'ArrowDown', which: 40, altKey: true });
    fireEvent.keyDown(node, { key: 'Enter', which: 13 });
  };

  it('should render <Numeric /> form', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={0}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });

    expect(input).toBeInTheDocument();
  });

  it('should increment int on key up', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={0}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    arrowUp(input);

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it('should increment non-float on alt + key up', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={0}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    altArrowUp(input);

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it('should increment to full int on alt + key up', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={0.9}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        float={true}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    altArrowUp(input);

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it('should increment float point on alt + key up', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={0}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        float={true}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    altArrowUp(input);

    expect(onChangeMock).toHaveBeenCalledWith(0.1);
  });

  it('should increment long float point on alt + key up', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={0.38934985}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        float={true}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    altArrowUp(input);

    expect(onChangeMock).toHaveBeenCalledWith(0.48934985);
  });

  it('should decrement int on key down', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={2}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    arrowDown(input);

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it('should decrement non-float on alt + key down', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={2}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    altArrowDown(input);

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it('should decrement float point on alt + key down', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={2}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        float={true}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    altArrowDown(input);

    expect(onChangeMock).toHaveBeenCalledWith(1.9);
  });

  it('should decrement long float point on alt + key down', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByRole } = renderWithTheme(
      <Numeric
        value={2.34598345}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        float={true}
        aria-label="Numeric"
      />
    );

    const input = getByRole('textbox', { name: 'Numeric' });
    altArrowDown(input);

    expect(onChangeMock).toHaveBeenCalledWith(2.24598345);
  });
});
