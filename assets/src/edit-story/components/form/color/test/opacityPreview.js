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
import { waitFor, act, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import createSolid from '../../../../utils/createSolid';
import OpacityPreview from '../opacityPreview';
import getPreviewOpacityMock from '../getPreviewOpacity';
import getPreviewTextMock from '../getPreviewText';
import { renderWithTheme } from '../../../../testUtils';

jest.mock('../getPreviewOpacity', () => jest.fn());
jest.mock('../getPreviewText', () => jest.fn());

function arrange(customProps = {}) {
  const onChange = jest.fn();
  const props = {
    onChange,
    value: createSolid(0, 0, 0),
    ...customProps,
  };
  const { queryByLabelText, rerender } = renderWithTheme(
    <OpacityPreview {...props} />
  );
  const element = queryByLabelText('Opacity');
  const wrappedRerender = (extraProps) =>
    rerender(<OpacityPreview {...props} {...extraProps} />);
  return { element, onChange, rerender: wrappedRerender };
}

describe('<OpacityPreview />', () => {
  beforeEach(() => {
    getPreviewOpacityMock.mockReset();
    getPreviewTextMock.mockReset();

    getPreviewOpacityMock.mockImplementation(() => 100);
    getPreviewTextMock.mockImplementation(() => 'FF0000');
  });

  it('should render (and rerender) correct opacity when there is a text', () => {
    const { element, rerender } = arrange({ value: createSolid(255, 0, 0) });

    expect(getPreviewOpacityMock).toHaveBeenCalledWith(createSolid(255, 0, 0));

    expect(element).toBeDefined();
    expect(element).toHaveValue('100%');

    // Try again with a different value
    getPreviewOpacityMock.mockReset();
    getPreviewOpacityMock.mockImplementation(() => 20);
    rerender({ value: createSolid(255, 0, 0, 0.2) });
    expect(getPreviewOpacityMock).toHaveBeenCalledWith(
      createSolid(255, 0, 0, 0.2)
    );
    expect(element).toBeDefined();
    expect(element).toHaveValue('20%');
  });

  it('should be hidden when no text', () => {
    getPreviewTextMock.mockImplementation(() => null);

    const { element } = arrange();
    expect(element).toHaveStyle('visibility: hidden');
  });

  it('should remove postfix when there is focus but add again when blurred', async () => {
    const { element } = arrange();

    act(() => element.focus());

    await waitFor(() => expect(element).toHaveFocus());
    expect(element).toHaveValue('100');

    document.body.tabIndex = 0; // Allow body to be focused
    act(() => document.body.focus());

    await waitFor(() => expect(element).not.toHaveFocus());
    expect(element).toHaveValue('100%');
  });

  it('should invoke callback with valid input only', () => {
    const { element, onChange } = arrange();

    fireEvent.change(element, { target: { value: '50' } });
    expect(onChange).toHaveBeenCalledWith(0.5);

    onChange.mockReset();
    fireEvent.change(element, { target: { value: 'ten' } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
