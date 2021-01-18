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

/**
 * Internal dependencies
 */
import TextStyle from '../textStyle';
import FontContext from '../../../../../app/font/context';
import RichTextContext from '../../../../richText/context';
import { calculateTextHeight } from '../../../../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../../../../utils/calcRotatedResizeOffset';
import DropDown from '../../../../form/dropDown';
import AdvancedDropDown from '../../../../form/advancedDropDown';
import ColorInput from '../../../../form/color/color';
import createSolid from '../../../../../utils/createSolid';
import CanvasContext from '../../../../../app/canvas/context';
import {
  HIDDEN_PADDING,
  MULTIPLE_VALUE,
  MULTIPLE_DISPLAY_VALUE,
} from '../../../../../constants';
import { renderPanel } from '../../../shared/test/_utils';

jest.mock('../../../../../utils/textMeasurements');
jest.mock('../../../../form/dropDown');
jest.mock('../../../../form/advancedDropDown');
jest.mock('../../../../form/color/color');

const DEFAULT_PADDING = {
  horizontal: 0,
  vertical: 0,
  locked: true,
  hasHiddenPadding: false,
};

function Wrapper({ children }) {
  return (
    <CanvasContext.Provider
      value={{
        state: {},
        actions: {
          clearEditing: jest.fn(),
        },
      }}
    >
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
            addRecentFont: jest.fn(),
          },
        }}
      >
        <RichTextContext.Provider
          value={{ state: {}, actions: { selectionActions: {} } }}
        >
          {children}
        </RichTextContext.Provider>
      </FontContext.Provider>
    </CanvasContext.Provider>
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
      lineHeight: 1,
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
    AdvancedDropDown.mockImplementation(FakeControl);
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
    expect(element).toBeInTheDocument();
  });

  it('should recalculate height and offset', () => {
    const { submit } = renderTextStyle([textElement]);
    calculateTextHeight.mockImplementation(() => 171);

    const [dx, dy] = calcRotatedResizeOffset(0, 0, 0, 0, 171 - 100);
    const submits = submit({ fontSize: 70 });
    expect(submits[textElement.id]).toStrictEqual({
      fontSize: 70,
      height: 171,
      lineHeight: 1,
      padding: {
        hasHiddenPadding: false,
        horizontal: 0,
        locked: true,
        vertical: 0,
      },
      x: dx,
      y: dy,
    });
  });

  describe('PaddingControls', () => {
    let textSamePadding,
      unlockPaddingTextSamePadding,
      textDifferentPadding,
      unlockPaddingTextDifferentPadding;

    function testUpdaterOnElementVariations({
      pushUpdate,
      pushUpdateForObject,
      expectedPaddingProperties,
    }) {
      // Test that padding in closure of updater is expected
      const pufoUpdateArg = pushUpdateForObject.mock.calls[0][1];
      const padding = {};
      const updatedProperties = pufoUpdateArg(padding);
      expect(updatedProperties).toStrictEqual(expectedPaddingProperties);

      // Test that element with hidden padding retains hidden padding
      const withHiddenPadding = { hasHiddenPadding: true };
      const updatedPropertiesWithHiddenPadding = pufoUpdateArg(
        withHiddenPadding
      );
      const expectedPropertiesWithHiddenPadding = [
        'horizontal',
        'vertical',
      ].reduce((accum, key) => {
        if (key in expectedPaddingProperties) {
          accum[key] = expectedPaddingProperties[key] + HIDDEN_PADDING[key];
        }
        return accum;
      }, {});
      expect(updatedPropertiesWithHiddenPadding).toStrictEqual(
        expectedPropertiesWithHiddenPadding
      );

      // Test that element coords are updated to not move visual center
      const puUpdateArg = pushUpdate.mock.calls[0][0];
      [
        {
          x: 40,
          y: 40,
          width: 100,
          height: 100,
          padding: {},
        },
        // Test that element with hidden padding retains visual center
        {
          x: 70,
          y: 80,
          width: 90,
          height: 100,
          padding: { hasHiddenPadding: true },
        },
      ].forEach((el) => {
        const updated = puUpdateArg(el);
        const expectedPadding = el.padding.hasHiddenPadding
          ? expectedPropertiesWithHiddenPadding
          : expectedPaddingProperties;

        const expected = {};
        if ('horizontal' in expectedPadding) {
          expected.x = el.x - (expectedPadding.horizontal || 0);
          expected.width = el.width + (expectedPadding.horizontal || 0) * 2;
        }

        if ('vertical' in expectedPadding) {
          expected.y = el.y - (expectedPadding.vertical || 0);
          expected.height = el.height + (expectedPadding.vertical || 0) * 2;
        }

        expect(updated).toStrictEqual(expected);
      });
    }

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
        name: 'Horizontal & Vertical padding',
      });
      const lock = getByRole('checkbox', { name: paddingRatioLockLabel });
      expect(multi).toHaveValue('0');
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
      const horiz = getByRole('textbox', { name: 'Horizontal padding' });
      const vert = getByRole('textbox', { name: 'Vertical padding' });
      expect(horiz).toHaveValue('11');
      expect(vert).toHaveValue('12');
    });

    it('should update horizontal padding with lock', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        textElement,
      ]);
      const input = getByRole('textbox', {
        name: 'Horizontal & Vertical padding',
      });
      fireEvent.change(input, { target: { value: '20' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 20, vertical: 20 },
      });
    });

    it('should update horizontal padding without lock', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        unlockPaddingTextElement,
      ]);
      const input = getByRole('textbox', { name: 'Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11 },
      });
    });

    it('should update vertical padding without lock', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        unlockPaddingTextElement,
      ]);
      const input = getByRole('textbox', { name: 'Vertical padding' });
      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { vertical: 12 },
      });
    });

    it('should not update padding if empty string is submitted', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        textElement,
      ]);
      const input = getByRole('textbox', {
        name: 'Horizontal & Vertical padding',
      });
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: {
          horizontal: textElement.padding.horizontal,
          vertical: textElement.padding.vertical,
        },
      });
    });

    it('should update multi padding with lock and same padding', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        textElement,
        textSamePadding,
      ]);
      const input = getByRole('textbox', {
        name: 'Horizontal & Vertical padding',
      });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11, vertical: 11 },
      });
    });

    it('should update multi padding with lock and different padding', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        textElement,
        textDifferentPadding,
      ]);
      const input = getByRole('textbox', {
        name: 'Horizontal & Vertical padding',
      });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11, vertical: 11 },
      });
    });

    it('should update multi padding without lock and same padding', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        unlockPaddingTextElement,
        unlockPaddingTextSamePadding,
      ]);
      const input = getByRole('textbox', { name: 'Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11 },
      });
    });

    it('should update multi padding without lock and different padding', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        unlockPaddingTextElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = getByRole('textbox', { name: 'Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11 },
      });
    });

    it('should correctly update only horizontal padding when multiple elements with different padding lock settings are selected', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        textElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = getByRole('textbox', { name: 'Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11 },
      });
    });

    it('should correctly update only vertical padding when multiple elements with different padding lock settings are selected', () => {
      const { getByRole, pushUpdateForObject, pushUpdate } = renderTextStyle([
        textElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = getByRole('textbox', { name: 'Vertical padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );

      // See that updates are propper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { vertical: 11 },
      });
    });

    it('should update default element lockPadding to false when padding lock clicked', () => {
      const { getByLabelText, pushUpdateForObject } = renderTextStyle([
        textElement,
      ]);
      fireEvent.click(getByLabelText(paddingRatioLockLabel));
      const pufoUpdater = pushUpdateForObject.mock.calls[0][1];
      const el = { padding: {} };
      const updatedProperties = pufoUpdater(el);
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        false
      );
      expect(updatedProperties).toStrictEqual({
        locked: false,
      });
    });

    it('should update unlock padding element lockPadding to true when padding lock clicked', () => {
      const { getByLabelText, pushUpdateForObject } = renderTextStyle([
        unlockPaddingTextElement,
      ]);
      fireEvent.click(getByLabelText(paddingRatioLockLabel));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      const pufoUpdater = pushUpdateForObject.mock.calls[0][1];
      const updatedProperties = pufoUpdater({
        horizontal: 0,
      });
      expect(updatedProperties).toStrictEqual({
        horizontal: 0,
        vertical: 0,
        locked: true,
      });
    });

    it('should update multiple elements with default text element and unlock padding elements lockPadding to false when padding lock clicked', () => {
      const { getByLabelText, pushUpdateForObject } = renderTextStyle([
        unlockPaddingTextElement,
        textElement,
      ]);
      fireEvent.click(getByLabelText(paddingRatioLockLabel));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      const pufoUpdater = pushUpdateForObject.mock.calls[0][1];
      const updatedProperties = pufoUpdater({
        horizontal: 0,
      });
      expect(updatedProperties).toStrictEqual({
        horizontal: 0,
        vertical: 0,
        locked: true,
      });
    });
  });

  describe('FontControls', () => {
    it('should select font', async () => {
      const { pushUpdate } = renderTextStyle([textElement]);
      await act(() => controls.font.onChange({ id: 'Neu Font' }));
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

    it('should select font size', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Font size' });

      fireEvent.change(input, { target: { value: '32' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      expect(pushUpdate).toHaveBeenCalledWith({ fontSize: 32 });
    });

    it('should not update font size if empty string is submitted', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Font size' });
      const originalFontsize = parseInt(input.value);
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      expect(pushUpdate).toHaveBeenCalledWith({
        fontSize: originalFontsize,
      });
    });

    it('should set the text bold when the key command is pressed', () => {
      const { pushUpdate, container } = renderTextStyle([textElement]);

      fireEvent.keyDown(container, {
        key: 'b',
        which: 66,
        ctrlKey: true,
      });

      const updatingFunction = pushUpdate.mock.calls[0][0];
      const resultOfUpdating = updatingFunction({ content: 'Hello world' });
      expect(resultOfUpdating).toStrictEqual(
        {
          content: '<span style="font-weight: 700">Hello world</span>',
        },
        true
      );
    });

    it('should set the text underline when the key command is pressed', () => {
      const { pushUpdate, container } = renderTextStyle([textElement]);

      fireEvent.keyDown(container, {
        key: 'u',
        which: 85,
        ctrlKey: true,
      });

      const updatingFunction = pushUpdate.mock.calls[0][0];
      const resultOfUpdating = updatingFunction({ content: 'Hello world' });
      expect(resultOfUpdating).toStrictEqual(
        {
          content:
            '<span style="text-decoration: underline">Hello world</span>',
        },
        true
      );
    });

    it('should set the text italics when the key command is pressed', () => {
      const { pushUpdate, container } = renderTextStyle([textElement]);

      fireEvent.keyDown(container, {
        key: 'i',
        which: 73,
        ctrlKey: true,
      });

      const updatingFunction = pushUpdate.mock.calls[0][0];
      const resultOfUpdating = updatingFunction({ content: 'Hello world' });
      expect(resultOfUpdating).toStrictEqual(
        {
          content: '<span style="font-style: italic">Hello world</span>',
        },
        true
      );
    });
  });

  describe('TextStyleControls', () => {
    it('should set lineHeight', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Line-height' });
      fireEvent.change(input, { target: { value: '1.5' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      expect(pushUpdate).toHaveBeenCalledWith({ lineHeight: 1.5 });
    });

    it('should clear line height if set to empty', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Line-height' });
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      expect(pushUpdate).toHaveBeenCalledWith({ lineHeight: '' });
    });

    it('should set letterSpacing', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Letter-spacing' });
      fireEvent.change(input, { target: { value: '150' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      const updatingFunction = pushUpdate.mock.calls[0][0];
      const resultOfUpdating = updatingFunction({ content: 'Hello world' });
      expect(resultOfUpdating).toStrictEqual(
        {
          content: '<span style="letter-spacing: 1.5em">Hello world</span>',
        },
        true
      );
    });

    it('should clear letterSpacing if set to empty', () => {
      const { getByRole, pushUpdate } = renderTextStyle([textElement]);
      const input = getByRole('textbox', { name: 'Letter-spacing' });
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
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

  describe('Mixed value multi-selection', () => {
    it('should display Mixed value in case of mixed value multi-selection', () => {
      const textElement1 = {
        ...textElement,
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
      };
      const textElement2 = {
        ...textElement,
        font: {
          name: 'ABeeZee',
          value: 'ABeeZee',
          service: 'foo.bar.baz',
          weights: [400, 700],
          styles: ['italic', 'regular'],
          variants: [
            [0, 400],
            [1, 400],
            [0, 700],
          ],
          fallbacks: ['serif'],
        },
        fontSize: 36,
        padding: {
          vertical: 1,
          horizontal: 1,
        },
        lineHeight: 2.2,
        content:
          '<span style="font-weight: 700; letter-spacing: 0.2em">Hello world</span>',
      };

      const { getByRole } = renderTextStyle([textElement1, textElement2]);

      const letterSpacing = getByRole('textbox', { name: 'Letter-spacing' });
      expect(letterSpacing.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);

      const lineHeight = getByRole('textbox', { name: 'Line-height' });
      expect(lineHeight.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);

      const fontSize = getByRole('textbox', { name: 'Font size' });
      expect(fontSize.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);

      const paddingH = getByRole('textbox', {
        name: 'Horizontal padding',
      });
      expect(paddingH.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);

      const paddingV = getByRole('textbox', { name: 'Vertical padding' });
      expect(paddingV.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);

      expect(controls.font.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
      expect(controls['font.weight'].placeholder).toStrictEqual(
        MULTIPLE_DISPLAY_VALUE
      );
    });
  });
});
