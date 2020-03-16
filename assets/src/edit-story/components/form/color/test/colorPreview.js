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
import theme from '../../../../theme';
import SidebarContext from '../../../sidebar/context';
import ColorPreview from '../colorPreview';
import getPreviewStyleMock from '../getPreviewStyle';
import getPreviewTextMock from '../getPreviewText';

jest.mock('../getPreviewStyle', () => jest.fn());
jest.mock('../getPreviewText', () => jest.fn());

function arrange(children = null) {
  const sidebarContextValue = {
    actions: {
      showColorPickerAt: jest.fn(),
      hideSidebar: jest.fn(),
    },
  };
  const { getByRole, getByLabelText } = render(
    <SidebarContext.Provider value={sidebarContextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </SidebarContext.Provider>
  );
  const button = getByLabelText(/Color/);
  const swatch = getByRole('status');
  return {
    button,
    swatch,
    ...sidebarContextValue.actions,
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
    const { button, swatch } = arrange(
      <ColorPreview onChange={() => {}} label="Color" />
    );

    expect(button).toBeDefined();
    expect(button).toHaveAttribute('aria-label', 'Color: FF0000');
    expect(button).toHaveTextContent('FF0000');

    expect(swatch).toBeDefined();
    expect(swatch).toHaveStyle('background-color: red');
  });

  it('should render multiple if applicable', () => {
    getPreviewTextMock.mockImplementationOnce(() => {
      return null;
    });

    const { button } = arrange(
      <ColorPreview onChange={() => {}} isMultiple label="Color" />
    );

    expect(button).toHaveTextContent('Multiple');
  });

  it('should render none if applicable', () => {
    getPreviewTextMock.mockImplementationOnce(() => {
      return null;
    });

    const { button } = arrange(
      <ColorPreview onChange={() => {}} label="Color" />
    );

    expect(button).toHaveTextContent('None');
  });

  it('should invoke callback with proper arguments when clicked', () => {
    const onChange = jest.fn();
    const onClose = jest.fn();
    const value = { a: 1 };
    const { button, showColorPickerAt, hideSidebar } = arrange(
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

    expect(showColorPickerAt).toHaveBeenCalledWith(expect.any(Object), {
      color: value,
      onChange,
      hasGradient: true,
      hasOpacity: false,
      onClose: hideSidebar,
    });
  });
});
