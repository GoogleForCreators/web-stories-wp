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
import createSolid from '../../../../utils/createSolid';
import ColorPreview from '../colorPreview';
import getPreviewStyleMock from '../getPreviewStyle';
import getPreviewTextMock from '../getPreviewText';
import MULTIPLE_VALUE from '../../multipleValue';
import { renderWithTheme } from '../../../../testUtils';

jest.mock('../getPreviewStyle', () => jest.fn());
jest.mock('../getPreviewText', () => jest.fn());

function arrange(children = null) {
  const { getByRole, getByLabelText, queryByLabelText } = renderWithTheme(
    children
  );
  const button = getByLabelText(/edit/i);
  const input = queryByLabelText(/enter/i);
  const swatch = getByRole('status');
  return {
    button,
    input,
    swatch,
    queryByLabelText,
  };
}

describe('<ColorPreview />', () => {
  beforeEach(() => {
    getPreviewStyleMock.mockReset();
    getPreviewTextMock.mockReset();

    getPreviewStyleMock.mockImplementation(() => {
      return { backgroundColor: 'red' };
    });
    getPreviewTextMock.mockImplementation(() => {
      return 'FF0000';
    });
  });

  it('should render correct style and text', () => {
    const { button, swatch, input } = arrange(
      <ColorPreview
        onChange={() => {}}
        value={createSolid(255, 0, 0)}
        label="Color"
      />
    );

    expect(button).toBeDefined();
    expect(button).toHaveAttribute('aria-label', 'Edit: Color');

    expect(input).toHaveValue('FF0000');

    expect(swatch).toBeDefined();
    expect(swatch).toHaveStyle('background-color: red');
  });

  it('should render one big button if gradient', () => {
    getPreviewTextMock.mockImplementation(() => {
      return 'Radial';
    });

    const { button, swatch, input } = arrange(
      <ColorPreview
        onChange={() => {}}
        value={{ type: 'radial' }}
        label="Color"
      />
    );

    expect(button).toBeDefined();
    expect(button).toHaveAttribute('aria-label', 'Edit: Color');
    expect(button).toHaveTextContent('Radial');

    expect(input).toBeNull();

    expect(swatch).toBeDefined();
    expect(swatch).toHaveStyle('background-color: red');
  });

  it('should render multiple if applicable', () => {
    getPreviewTextMock.mockImplementationOnce(() => {
      return null;
    });

    const { button } = arrange(
      <ColorPreview onChange={() => {}} value={MULTIPLE_VALUE} label="Color" />
    );

    expect(button).toHaveTextContent('Multiple');
  });

  it('should render none if applicable', () => {
    getPreviewTextMock.mockImplementation(() => {
      return null;
    });

    const { button, input } = arrange(
      <ColorPreview onChange={() => {}} value={null} label="Color" />
    );

    expect(button).toHaveTextContent('None');

    expect(input).toBeNull();
  });

  it('should open the color picker when clicked', () => {
    const onChange = jest.fn();
    const onClose = jest.fn();
    const value = { a: 1 };
    const { button, queryByLabelText } = arrange(
      <ColorPreview
        onChange={onChange}
        value={value}
        hasGradient
        hasOpacity={false}
        onClose={onClose}
        label="Color"
      />
    );

    fireEvent.click(button);

    const previewButton = queryByLabelText(/solid pattern/i);
    expect(previewButton).toBeDefined();
  });

  it('should open the color picker when clicked if multiple', () => {
    const onChange = jest.fn();
    const onClose = jest.fn();
    const { button, queryByLabelText } = arrange(
      <ColorPreview
        onChange={onChange}
        value={MULTIPLE_VALUE}
        hasGradient
        onClose={onClose}
        label="Color"
      />
    );

    fireEvent.click(button);

    const previewButton = queryByLabelText(/solid pattern/i);
    expect(previewButton).toBeDefined();
  });

  it('should invoke onChange when inputting valid hex', () => {
    const onChange = jest.fn();
    const value = createSolid(255, 0, 0);
    const { input } = arrange(
      <ColorPreview onChange={onChange} value={value} label="Color" />
    );

    // Only 2 digits can't be valid
    fireEvent.change(input, { target: { value: 'AF' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    // Since saved value didn't change shouldn't trigger onChagne
    expect(onChange).not.toHaveBeenCalled();
    // Input should revert to saved value
    expect(input).toHaveValue('FF0000');

    // Only 5 digits can't be valid
    fireEvent.change(input, { target: { value: '0FF00' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    // Since saved value didn't change shouldn't trigger onChagne
    expect(onChange).not.toHaveBeenCalled();
    // Input should revert to saved value
    expect(input).toHaveValue('FF0000');

    // Non-hex can't be valid
    fireEvent.change(input, { target: { value: 'COFFEE' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    // Since saved value didn't change shouldn't trigger onChagne
    expect(onChange).not.toHaveBeenCalled();
    // Input should revert to saved value
    expect(input).toHaveValue('FF0000');

    // Exactly 6 hex digits is good
    fireEvent.change(input, { target: { value: '00FF00' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledWith(createSolid(0, 255, 0));
    expect(input).toHaveValue('00FF00');

    // Allow shorthand 3 digit hex
    fireEvent.change(input, { target: { value: 'F60' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledWith(createSolid(255, 102, 0));
    expect(input).toHaveValue('FF6600');

    // Also validate that it'll ignore the first #
    fireEvent.change(input, { target: { value: '#0000FF' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenCalledWith(createSolid(0, 0, 255));
    expect(input).toHaveValue('0000FF');
  });

  it('should revert to last known value when blurring invalid input', () => {
    const onChange = jest.fn();
    const value = createSolid(255, 0, 0);
    const { input } = arrange(
      <ColorPreview onChange={onChange} value={value} label="Color" />
    );

    // Only 5 digits can't be valid
    fireEvent.change(input, { target: { value: '0FF00' } });
    fireEvent.blur(input);

    // Reverting to already saved value, shouldn't trigger onChange
    expect(onChange).toHaveBeenCalledTimes(0);
    expect(input).toHaveValue('FF0000');
  });
});
