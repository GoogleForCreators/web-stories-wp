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
import PropTypes from 'prop-types';
import { act, fireEvent } from '@testing-library/react';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import TextStyle from '../textStyle';
import FontContext from '../../../app/font/context';
import RichTextContext from '../../richText/context';
import { calculateTextHeight } from '../../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../../utils/calcRotatedResizeOffset';
import DropDown from '../../form/dropDown';
import FontPicker from '../../fontPicker';
import ColorInput from '../../form/color/color';
import createSolid from '../../../utils/createSolid';
import { MULTIPLE_VALUE } from '../../form';
import { renderPanel } from './_utils';

jest.mock('../../../utils/textMeasurements');
jest.mock('../../form/dropDown');
jest.mock('../../fontPicker');
jest.mock('../../form/color/color');

const DEFAULT_PADDING = { horizontal: 0, vertical: 0, locked: true };

function Wrapper({ children }) {
  return (
    <FlagsProvider features={{ newFontPicker: false }}>
      <FontContext.Provider
        value={{
          state: {
            fonts: [
              {
                name: 'ABeeZee',
                value: 'ABeeZee',
                service: 'foo.bar.baz',
                weights: [400],
                styles: ['italic', 'regular'],
                variants: [
                  [0, 400],
                  [1, 400],
                ],
                fallbacks: ['serif'],
              },
              {
                name: 'Neu Font',
                value: 'Neu Font',
                service: 'foo.bar.baz',
                weights: [400],
                styles: ['italic', 'regular'],
                variants: [
                  [0, 400],
                  [1, 400],
                ],
                fallbacks: ['fallback1'],
              },
            ],
          },
          actions: {
            maybeEnqueueFontStyle: () => Promise.resolve(),
            getFontByName: () => ({
              name: 'Neu Font',
              value: 'Neu Font',
              service: 'foo.bar.baz',
              weights: [400],
              styles: ['italic', 'regular'],
              variants: [
                [0, 400],
                [1, 400],
              ],
              fallbacks: ['fallback1'],
            }),
          },
        }}
      >
        <RichTextContext.Provider
          value={{ state: {}, actions: { selectionActions: {} } }}
        >
          {children}
        </RichTextContext.Provider>
      </FontContext.Provider>
    </FlagsProvider>
  );
}

Wrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

describe('Panels/TextStyle', () => {
  let textElement, unlockPaddingTextElement;
  let controls;
  const paddingRatioLockLabel = 'Toggle padding ratio lock';

  beforeEach(() => {
    global.fetch.resetMocks();

    unlockPaddingTextElement = {
      id: '1',
      textAlign: 'normal',
      fontSize: 30,
      font: {
        family: 'ABeeZee',
      },
      x: 0,
      y: 0,
      height: 100,
      width: 120,
      rotationAngle: 0,
      padding: { vertical: 0, horizontal: 0, locked: false },
    };

    textElement = {
      ...unlockPaddingTextElement,
      padding: DEFAULT_PADDING,
    };

    controls = {};
    DropDown.mockImplementation(FakeControl);
    FontPicker.mockImplementation(FakeControl);
    ColorInput.mockImplementation(FakeControl);
  });

  function FakeControl(props) {
    controls[props['data-testid']] = props;
    return <div />;
  }

  FakeControl.propTypes = {
    'data-testid': PropTypes.string,
  };

  function renderTextStyle(selectedElements, ...args) {
    return renderPanel(TextStyle, selectedElements, Wrapper, ...args);
  }

  it('should render <TextStyle /> panel', () => {
    const { getByRole } = renderTextStyle([textElement]);
    const element = getByRole('button', { name: 'Style' });
    expect(element).toBeDefined();
  });

  it('should recalculate height and offset', () => {
    const { submit } = renderTextStyle([textElement]);
    calculateTextHeight.mockImplementation(() => 171);

    const [dx, dy] = calcRotatedResizeOffset(0, 0, 0, 0, 171 - 100);
    const submits = submit({ fontSize: 70 });
    expect(submits[textElement.id]).toStrictEqual({
      fontSize: 70,
      height: 171,
      x: dx,
      y: dy,
    });
  });

  describe('PaddingControls', () => {
    let textSamePadding,
      unlockPaddingTextSamePadding,
      textDifferentPadding,
      unlockPaddingTextDifferentPadding;

    beforeEach(() => {
      textSamePadding = {
        ...textElement,
        id: 'textSamePadding',
        padding: DEFAULT_PADDING,
      };
      unlockPaddingTextSamePadding = {
        ...textSamePadding,
        padding: { ...DEFAULT_PADDING, locked: false },
      };
      textDifferentPadding = {
        ...textElement,
        id: 'textDifferentPadding',
        padding: { horizontal: 10, vertical: 20, locked: true },
      };
      unlockPaddingTextDifferentPadding = {
        ...textDifferentPadding,
        padding: { horizontal: 10, vertical: 20, locked: false },
      };
    });

    it('should render default padding controls', () => {
      const { getByRole } = renderTextStyle([textElement]);
      const multi = getByRole('textbox', {
        name: 'Edit: Horizontal & Vertical padding',
      });
      const lock = getByRole('checkbox', { name: paddingRatioLockLabel });
      expect(multi.value).toBe('0');
      expect(lock).toBeChecked();
    });

    it('should render specified padding controls', () => {
      const { getByRole } = renderTextStyle([
        {
          ...textElement,
          padding: {
            horizontal: 11,
            vertical: 12,
            locked: false,
          },
        },
      ]);
      const horiz = getByRole('textbox', { name: 'Edit: Horizontal padding' });
      const vert = getByRole('textbox', { name: 'Edit: Vertical padding' });
      expect(horiz.value).toBe('11');
      expect(vert.value).toBe('12');
    });

    it('should update horizontal padding with lock', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([textElement]);
      const input = getByRole('textbox', {
        name: 'Edit: Horizontal & Vertical padding',
      });
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11, vertical: 11 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update horizontal padding without lock', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([
        unlockPaddingTextElement,
      ]);
      const input = getByRole('textbox', { name: 'Edit: Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update vertical padding without lock', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([
        unlockPaddingTextElement,
      ]);
      const input = getByRole('textbox', { name: 'Edit: Vertical padding' });
      fireEvent.change(input, { target: { value: '12' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { vertical: 12 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update empty horizontal padding with lock', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([textElement]);
      const input = getByRole('textbox', {
        name: 'Edit: Horizontal & Vertical padding',
      });
      fireEvent.change(input, { target: { value: '' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: '', vertical: '' },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update multi padding with lock and same padding', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([
        textElement,
        textSamePadding,
      ]);
      const input = getByRole('textbox', {
        name: 'Edit: Horizontal & Vertical padding',
      });
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11, vertical: 11 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update multi padding with lock and different padding', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([
        textElement,
        textDifferentPadding,
      ]);
      const input = getByRole('textbox', {
        name: 'Edit: Horizontal & Vertical padding',
      });
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11, vertical: 11 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update multi padding without lock and same padding', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([
        unlockPaddingTextElement,
        unlockPaddingTextSamePadding,
      ]);
      const input = getByRole('textbox', { name: 'Edit: Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update multi padding without lock and different padding', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([
        unlockPaddingTextElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = getByRole('textbox', { name: 'Edit: Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should correctly update only horizontal padding when multiple elements with different padding lock settings are selected', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([
        textElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = getByRole('textbox', { name: 'Edit: Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should correctly update only vertical padding when multiple elements with different padding lock settings are selected', () => {
      const { getByRole, pushUpdateForObject } = renderTextStyle([
        textElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = getByRole('textbox', { name: 'Edit: Vertical padding' });
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { vertical: 11 },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update default element lockPadding to false when padding lock clicked', () => {
      const { getByLabelText, pushUpdateForObject } = renderTextStyle([
        textElement,
      ]);
      fireEvent.click(getByLabelText(paddingRatioLockLabel));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        {
          locked: false,
        },
        DEFAULT_PADDING,
        false
      );
    });

    it('should update unlock padding element lockPadding to true when padding lock clicked', () => {
      const { getByLabelText, pushUpdateForObject } = renderTextStyle([
        unlockPaddingTextElement,
      ]);
      fireEvent.click(getByLabelText(paddingRatioLockLabel));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        {
          horizontal: 0,
          vertical: 0,
          locked: true,
        },
        DEFAULT_PADDING,
        true
      );
    });

    it('should update multiple elements with default text element and unlock padding elements lockPadding to false when padding lock clicked', () => {
      const { getByLabelText, pushUpdateForObject } = renderTextStyle([
        unlockPaddingTextElement,
        textElement,
      ]);
      fireEvent.click(getByLabelText(paddingRatioLockLabel));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        {
          horizontal: 0,
          vertical: 0,
          locked: true,
        },
        DEFAULT_PADDING,
        true
      );
    });
  });

  describe('FontControls', () => {
    it('should select font', async () => {
      const { pushUpdate } = renderTextStyle([textElement]);
      await act(() => controls.font.onChange('Neu Font'));
      expect(pushUpdate).toHaveBeenCalledWith(
        {
          font: {
            family: 'Neu Font',
            service: 'foo.bar.baz',
            styles: ['italic', 'regular'],
            weights: [400],
            variants: [
              [0, 400],
              [1, 400],
            ],
            fallbacks: ['fallback1'],
          },
        },
        true
      );
    });

    it('should select font weight', async () => {
      const { pushUpdate } = renderTextStyle([textElement]);
      await act(() => controls['font.weight'].onChange('300'));
      const updatingFunction = pushUpdate.mock.calls[0][0];
      const resultOfUpdating = updatingFunction({ content: 'Hello world' });
      expect(resultOfUpdating).toStrictEqual(
        {
          content: '<span style="font-weight: 300">Hello world</span>',
        },
        true
      );
    });

    it('should select font size', async () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Font size' });

      await fireEvent.change(input, { target: { value: '32' } });
      expect(pushUpdate).toHaveBeenCalledWith({ fontSize: 32 });
    });

    it('should select font size to empty value', async () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Font size' });
      await fireEvent.change(input, { target: { value: '' } });
      expect(pushUpdate).toHaveBeenCalledWith({ fontSize: '' });
    });
  });

  describe('TextStyleControls', () => {
    it('should set lineHeight', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Line-height' });
      fireEvent.change(input, { target: { value: '1.5' } });
      expect(pushUpdate).toHaveBeenCalledWith({ lineHeight: 1.5 });
    });

    it('should set lineHeight to empty', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Line-height' });
      fireEvent.change(input, { target: { value: '' } });
      expect(pushUpdate).toHaveBeenCalledWith({ lineHeight: '' });
    });

    it('should set letterSpacing', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Letter-spacing' });
      fireEvent.change(input, { target: { value: '150' } });
      const updatingFunction = pushUpdate.mock.calls[0][0];
      const resultOfUpdating = updatingFunction({ content: 'Hello world' });
      expect(resultOfUpdating).toStrictEqual(
        {
          content: '<span style="letter-spacing: 1.5em">Hello world</span>',
        },
        true
      );
    });

    it('should set letterSpacing to empty', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Letter-spacing' });
      fireEvent.change(input, { target: { value: '' } });
      const updatingFunction = pushUpdate.mock.calls[0][0];
      const resultOfUpdating = updatingFunction({
        content: '<span style="letter-spacing: 1.5em">Hello world</span>',
      });
      expect(resultOfUpdating).toStrictEqual(
        {
          content: 'Hello world',
        },
        true
      );
    });
  });

  describe('ColorControls', () => {
    it('should render default black color', () => {
      renderTextStyle([textElement]);
      expect(controls['text.color'].value).toStrictEqual(createSolid(0, 0, 0));
    });

    it('should render a color', () => {
      const textWithColor = {
        ...textElement,
        content: '<span style="color: rgb(255, 0, 0)">Hello world</span>',
      };
      renderTextStyle([textWithColor]);
      expect(controls['text.color'].value).toStrictEqual(
        createSolid(255, 0, 0)
      );
    });

    it('should set color', () => {
      const { pushUpdate } = renderTextStyle([textElement]);
      act(() => controls['text.color'].onChange(createSolid(0, 255, 0)));
      const updatingFunction = pushUpdate.mock.calls[0][0];
      const resultOfUpdating = updatingFunction({
        content: 'Hello world',
      });
      expect(resultOfUpdating).toStrictEqual(
        {
          content: '<span style="color: #0f0">Hello world</span>',
        },
        true
      );
    });

    it('should detect color with multi selection, same values', () => {
      const textWithColor1 = {
        ...textElement,
        content: '<span style="color: rgb(0, 0, 255)">Hello world</span>',
      };
      const textWithColor2 = {
        ...textElement,
        content: '<span style="color: rgb(0, 0, 255)">Hello world</span>',
      };
      renderTextStyle([textWithColor1, textWithColor2]);
      expect(controls['text.color'].value).toStrictEqual(
        createSolid(0, 0, 255)
      );
    });

    it('should set color with multi selection, different values', () => {
      const textWithColor1 = {
        ...textElement,
        content: '<span style="color: rgb(0, 0, 255)">Hello world</span>',
      };
      const textWithColor2 = {
        ...textElement,
        content: '<span style="color: rgb(0, 255, 255)">Hello world</span>',
      };
      renderTextStyle([textWithColor1, textWithColor2]);
      expect(controls['text.color'].value).toStrictEqual(MULTIPLE_VALUE);
    });
  });
});
