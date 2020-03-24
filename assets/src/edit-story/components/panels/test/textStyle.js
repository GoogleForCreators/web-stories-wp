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
import FontContext from '../../../app/font/context';
import { calculateTextHeight } from '../../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../../utils/calcRotatedResizeOffset';
import DropDown from '../../dropDown';
import ColorInput from '../../form/color/color';
import createSolid from '../../../utils/createSolid';
import { MULTIPLE_VALUE } from '../../form';
import { renderPanel } from './_utils';

jest.mock('../../../utils/textMeasurements');
jest.mock('../../dropDown');
jest.mock('../../form/color/color');

const DEFAULT_PADDING = { horizontal: 0, vertical: 0 };

function Wrapper({ children }) {
  return (
    <FontContext.Provider
      value={{
        state: { fonts: [{ name: 'ABeeZee', value: 'ABeeZee' }] },
        actions: {
          getFontWeight: () => [{ name: 'Normal1', value: '400' }],
          getFontFallback: () => 'fallback1',
        },
      }}
    >
      {children}
    </FontContext.Provider>
  );
}

Wrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

describe('Panels/TextStyle', () => {
  let textElement;
  let controls;

  beforeEach(() => {
    global.fetch.resetMocks();

    textElement = {
      id: '1',
      textAlign: 'normal',
      fontSize: 30,
      fontFamily: 'ABeeZee',
      fontWeight: 400,
      x: 0,
      y: 0,
      height: 100,
      width: 120,
      rotationAngle: 0,
    };

    controls = {};
    DropDown.mockImplementation(FakeControl);
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
    const { getByText } = renderTextStyle([textElement]);
    const element = getByText('Style');
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
    let textSamePadding, textDifferentPadding;

    beforeEach(() => {
      textSamePadding = {
        ...textElement,
        id: 'textSamePadding',
        padding: DEFAULT_PADDING,
      };
      textDifferentPadding = {
        ...textElement,
        id: 'textDifferentPadding',
        padding: { horizontal: 10, vertical: 20 },
      };
    });

    it('should render default padding controls', () => {
      const { getByTestId } = renderTextStyle([textElement]);
      const horiz = getByTestId('padding.horizontal');
      const vert = getByTestId('padding.vertical');
      const lock = getByTestId('padding.lock');
      expect(horiz.value).toBe('0');
      expect(vert.value).toBe('0');
      expect(lock).toBeChecked();
    });

    it('should render specified padding controls', () => {
      const { getByTestId } = renderTextStyle([
        {
          ...textElement,
          padding: {
            horizontal: 11,
            vertical: 12,
          },
        },
      ]);
      const horiz = getByTestId('padding.horizontal');
      const vert = getByTestId('padding.vertical');
      expect(horiz.value).toBe('11');
      expect(vert.value).toBe('12');
    });

    it('should update horizontal padding with lock', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
      ]);
      const input = getByTestId('padding.horizontal');
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11, vertical: 11 },
        DEFAULT_PADDING
      );
    });

    it('should update vertical padding with lock', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
      ]);
      const input = getByTestId('padding.vertical');
      fireEvent.change(input, { target: { value: '12' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { vertical: 12, horizontal: 12 },
        DEFAULT_PADDING
      );
    });

    it('should update horizontal padding without lock', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
      ]);
      fireEvent.click(getByTestId('padding.lock'));
      const input = getByTestId('padding.horizontal');
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11 },
        DEFAULT_PADDING
      );
    });

    it('should update vertical padding without lock', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
      ]);
      fireEvent.click(getByTestId('padding.lock'));
      const input = getByTestId('padding.vertical');
      fireEvent.change(input, { target: { value: '12' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { vertical: 12 },
        DEFAULT_PADDING
      );
    });

    it('should update empty horizontal padding with lock', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
      ]);
      const input = getByTestId('padding.horizontal');
      fireEvent.change(input, { target: { value: '' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: '', vertical: '' },
        DEFAULT_PADDING
      );
    });

    it('should update multi padding with lock and same padding', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
        textSamePadding,
      ]);
      const input = getByTestId('padding.horizontal');
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11, vertical: 11 },
        DEFAULT_PADDING
      );
    });

    it('should update multi padding with lock and different padding', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
        textDifferentPadding,
      ]);
      const input = getByTestId('padding.horizontal');
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11, vertical: 11 },
        DEFAULT_PADDING
      );
    });

    it('should update multi padding without lock and same padding', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
        textSamePadding,
      ]);
      fireEvent.click(getByTestId('padding.lock'));
      const input = getByTestId('padding.horizontal');
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11 },
        DEFAULT_PADDING
      );
    });

    it('should update multi padding without lock and different padding', () => {
      const { getByTestId, pushUpdateForObject } = renderTextStyle([
        textElement,
        textDifferentPadding,
      ]);
      fireEvent.click(getByTestId('padding.lock'));
      const input = getByTestId('padding.horizontal');
      fireEvent.change(input, { target: { value: '11' } });
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        { horizontal: 11 },
        DEFAULT_PADDING
      );
    });
  });

  describe('FontControls', () => {
    it('should select font', () => {
      const { pushUpdate } = renderTextStyle([textElement]);
      act(() => controls.font.onChange('Neu Font'));
      expect(pushUpdate).toHaveBeenCalledWith(
        {
          fontFamily: 'Neu Font',
          fontFallback: 'fallback1',
          fontWeight: 400,
        },
        true
      );
    });

    it('should select font weight', () => {
      const { pushUpdate } = renderTextStyle([textElement]);
      act(() => controls['font.weight'].onChange('300'));
      expect(pushUpdate).toHaveBeenCalledWith({ fontWeight: 300 }, true);
    });

    it('should select font size', () => {
      const { getByTestId, pushUpdate } = renderTextStyle([textElement]);
      const input = getByTestId('font.size');
      fireEvent.change(input, { target: { value: '32' } });
      expect(pushUpdate).toHaveBeenCalledWith({ fontSize: 32 });
    });

    it('should select font size to empty value', () => {
      const { getByTestId, pushUpdate } = renderTextStyle([textElement]);
      const input = getByTestId('font.size');
      fireEvent.change(input, { target: { value: '' } });
      expect(pushUpdate).toHaveBeenCalledWith({ fontSize: '' });
    });
  });

  describe('TextStyleControls', () => {
    it('should set lineHeight', () => {
      const { getByTestId, pushUpdate } = renderTextStyle([textElement]);
      const input = getByTestId('text.lineHeight');
      fireEvent.change(input, { target: { value: '1.5' } });
      expect(pushUpdate).toHaveBeenCalledWith({ lineHeight: 1.5 });
    });

    it('should set lineHeight to empty', () => {
      const { getByTestId, pushUpdate } = renderTextStyle([textElement]);
      const input = getByTestId('text.lineHeight');
      fireEvent.change(input, { target: { value: '' } });
      expect(pushUpdate).toHaveBeenCalledWith({ lineHeight: '' });
    });

    it('should set letterSpacing', () => {
      const { getByTestId, pushUpdate } = renderTextStyle([textElement]);
      const input = getByTestId('text.letterSpacing');
      fireEvent.change(input, { target: { value: '150' } });
      expect(pushUpdate).toHaveBeenCalledWith({ letterSpacing: 1.5 });
    });

    it('should set letterSpacing to empty', () => {
      const { getByTestId, pushUpdate } = renderTextStyle([textElement]);
      const input = getByTestId('text.letterSpacing');
      fireEvent.change(input, { target: { value: '' } });
      expect(pushUpdate).toHaveBeenCalledWith({ letterSpacing: '' });
    });
  });

  describe('ColorControls', () => {
    it('should render no color', () => {
      renderTextStyle([textElement]);
      expect(controls['text.color'].value).toBeNull();
    });

    it('should render a color', () => {
      const textWithColor = {
        ...textElement,
        color: createSolid(255, 0, 0),
      };
      renderTextStyle([textWithColor]);
      expect(controls['text.color'].value).toStrictEqual(
        createSolid(255, 0, 0)
      );
    });

    it('should set color', () => {
      const { pushUpdate } = renderTextStyle([textElement]);
      act(() => controls['text.color'].onChange(createSolid(0, 255, 0)));
      expect(pushUpdate).toHaveBeenCalledWith(
        { color: createSolid(0, 255, 0) },
        true
      );
    });

    it('should set color with multi selection, same values', () => {
      const textWithColor1 = {
        ...textElement,
        color: createSolid(0, 0, 255),
      };
      const textWithColor2 = {
        ...textElement,
        color: createSolid(0, 0, 255),
      };
      renderTextStyle([textWithColor1, textWithColor2]);
      expect(controls['text.color'].value).toStrictEqual(
        createSolid(0, 0, 255)
      );
    });

    it('should set color with multi selection, different values', () => {
      const textWithColor1 = {
        ...textElement,
        color: createSolid(255, 0, 0),
      };
      const textWithColor2 = {
        ...textElement,
        color: createSolid(0, 255, 0),
      };
      renderTextStyle([textWithColor1, textWithColor2]);
      expect(controls['text.color'].value).toStrictEqual(MULTIPLE_VALUE);
    });
  });
});
