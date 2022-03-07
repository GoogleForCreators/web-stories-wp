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
import { fireEvent, screen, waitFor } from '@testing-library/react';
import {
  createSolid,
  getPreviewText as getPreviewTextMock,
} from '@googleforcreators/patterns';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../testUtils';
import ColorInput from '../colorInput';
import getPreviewStyleMock from '../getPreviewStyle';
import { StoryContext } from '../../../../app/story';
import { ConfigContext } from '../../../../app/config';
import getDefaultConfig from '../../../../getDefaultConfig';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';

jest.mock('../getPreviewStyle', () => jest.fn());
jest.mock('@googleforcreators/patterns', () => {
  return {
    ...jest.requireActual('@googleforcreators/patterns'),
    getPreviewText: jest.fn(),
  };
});

function arrange(children = null) {
  const storyContextValue = {
    state: {
      story: {
        globalStoryStyles: {
          colors: [],
          textStyles: [],
        },
        currentStoryStyles: {
          colors: [],
        },
      },
    },
    actions: {
      updateStory: jest.fn(),
    },
  };

  renderWithTheme(
    <ConfigContext.Provider value={getDefaultConfig()}>
      <StoryContext.Provider value={storyContextValue}>
        {children}
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );
  const button = screen.getByRole('button', { name: 'Color' });
  const input = screen.queryByLabelText('Color', { selector: 'input' });
  return {
    button,
    input,
  };
}

describe('<ColorInput />', () => {
  beforeEach(() => {
    getPreviewStyleMock.mockReset();
    getPreviewTextMock.mockReset();

    getPreviewStyleMock.mockImplementation(() => {
      return { backgroundColor: 'red' };
    });
  });

  it('should render correct style and text', async () => {
    getPreviewTextMock.mockImplementation(() => {
      return 'FF0000';
    });
    const { button, input } = arrange(
      <ColorInput
        onChange={() => {}}
        value={createSolid(255, 0, 0)}
        label="Color"
      />
    );

    await waitFor(() => expect(button).toBeDefined());
    expect(button).toHaveAttribute('aria-label', 'Color');

    expect(input).toHaveValue('FF0000');
  });

  it('should render one big button if gradient', async () => {
    getPreviewTextMock.mockImplementation(() => {
      return 'Radial';
    });

    const { button, input } = arrange(
      <ColorInput
        onChange={() => {}}
        value={{
          type: 'radial',
          stops: [
            {
              ...createSolid(255, 0, 0),
              position: 0,
            },
            {
              ...createSolid(0, 255, 0),
              position: 100,
            },
          ],
        }}
        label="Color"
      />
    );

    await waitFor(() => expect(button).toBeDefined());
    expect(button).toHaveAttribute('aria-label', 'Color');
    expect(button).toHaveTextContent('Radial');

    expect(input).toBeNull();
  });

  it('should render multiple if applicable', async () => {
    getPreviewTextMock.mockImplementationOnce(() => {
      return null;
    });

    const { input } = arrange(
      <ColorInput onChange={() => {}} value={MULTIPLE_VALUE} label="Color" />
    );
    await waitFor(() => expect(input.placeholder).toBe(MULTIPLE_DISPLAY_VALUE));
    expect(input).toHaveValue('');
  });

  it('should open the color picker when clicked', async () => {
    const onChange = jest.fn();
    const onClose = jest.fn();
    const value = { color: { r: 0, g: 0, b: 0, a: 1 } };
    const { button } = arrange(
      <ColorInput
        onChange={onChange}
        value={value}
        hasGradient
        hasOpacity={false}
        onClose={onClose}
        label="Color"
      />
    );

    fireEvent.click(button);

    const pickerDialog = screen.getByLabelText(/color and gradient picker/i);
    await waitFor(() => expect(pickerDialog).toBeInTheDocument());
  });

  it('should open the color picker when clicked if multiple', async () => {
    const onChange = jest.fn();
    const onClose = jest.fn();
    const { button } = arrange(
      <ColorInput
        onChange={onChange}
        value={MULTIPLE_VALUE}
        hasGradient
        onClose={onClose}
        label="Color"
      />
    );

    fireEvent.click(button);

    const pickerDialog = screen.getByLabelText(/color and gradient picker/i);
    await waitFor(() => expect(pickerDialog).toBeInTheDocument());
  });

  it('should invoke onChange when inputting valid hex', async () => {
    getPreviewTextMock.mockImplementation(() => {
      return 'FF0000';
    });
    const onChange = jest.fn();
    const value = createSolid(255, 0, 0);
    const { input } = arrange(
      <ColorInput onChange={onChange} value={value} label="Color" />
    );

    // Only 5 digits can't be valid
    fireEvent.change(input, { target: { value: '0FF00' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    // Since saved value didn't change shouldn't trigger onChange
    await waitFor(() => expect(onChange).not.toHaveBeenCalled());
    // Input should revert to saved value
    expect(input).toHaveValue('FF0000');

    // Non-hex can't be valid
    fireEvent.change(input, { target: { value: 'COFFEE' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    // Since saved value didn't change shouldn't trigger onChange
    expect(onChange).not.toHaveBeenCalled();
    // Input should revert to saved value
    expect(input).toHaveValue('FF0000');

    // Exactly 6 hex digits is good
    fireEvent.change(input, { target: { value: '00FF00' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledWith(createSolid(0, 255, 0));
    expect(input).toHaveValue('00FF00');

    // Allow shorthand 1 digits
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledWith(createSolid(0, 0, 0));
    expect(input).toHaveValue('000000');

    // Allow shorthand 2 digits
    fireEvent.change(input, { target: { value: 'AF' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledWith(createSolid(175, 175, 175));
    expect(input).toHaveValue('AFAFAF');

    // Allow shorthand 3 digit hex
    fireEvent.change(input, { target: { value: 'F60' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledWith(createSolid(255, 102, 0));
    expect(input).toHaveValue('FF6600');

    // Allow shorthand 4 digits
    fireEvent.change(input, { target: { value: 'AAFF' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledWith(createSolid(255, 102, 0));
    expect(input).toHaveValue('AAAAFF');

    // Also validate that it'll ignore the first #
    fireEvent.change(input, { target: { value: '#0000FF' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(onChange).toHaveBeenCalledTimes(6);
    expect(onChange).toHaveBeenCalledWith(createSolid(0, 0, 255));
    expect(input).toHaveValue('0000FF');
  });

  it('should revert to last known value when blurring invalid input', async () => {
    getPreviewTextMock.mockImplementation(() => {
      return 'FF0000';
    });
    const onChange = jest.fn();
    const value = createSolid(255, 0, 0);
    const { input } = arrange(
      <ColorInput onChange={onChange} value={value} label="Color" />
    );

    // Only 5 digits can't be valid
    fireEvent.change(input, { target: { value: '0FF00' } });
    fireEvent.blur(input);

    // Reverting to already saved value, shouldn't trigger onChange
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(0));
    expect(input).toHaveValue('FF0000');
  });
});
