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
import { fireEvent, screen } from '@testing-library/react';
import { BACKGROUND_TEXT_MODE } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import TextStyle from '../textStyle';
import {
  HIDDEN_PADDING,
  MULTIPLE_DISPLAY_VALUE,
} from '../../../../../constants';
import { renderPanel } from '../../../shared/test/_utils';
import FontContext from '../../../../../app/font/context';
import { StoryContext } from '../../../../../app/story';

let mockControls;
jest.mock('../../../../form/color/color', () => {
  const React = require('@googleforcreators/react');

  const _PropTypes = require('prop-types');
  const FakeControl = React.forwardRef(function FakeControl(props, ref) {
    mockControls[props['data-testid']] = props;
    return <div ref={ref} />;
  });
  FakeControl.propTypes = {
    'data-testid': _PropTypes.string,
  };
  return {
    __esModule: true,
    default: FakeControl,
  };
});

function Wrapper({ children }) {
  const storyContextValue = {
    state: {
      selectedElements: [
        {
          font: {
            family: 'ABeeZee',
          },
        },
      ],
      story: {
        globalStoryStyles: {
          ...{ colors: [], textStyles: [] },
        },
        currentStoryStyles: {
          colors: [],
        },
      },
    },
    actions: { updateStory: jest.fn(), updateElementsById: jest.fn() },
  };
  return (
    <StoryContext.Provider value={storyContextValue}>
      <FontContext.Provider
        value={{
          state: {
            fonts: [],
          },
          actions: {
            maybeEnqueueFontStyle: () => Promise.resolve(),
            getFontByName: jest.fn(),
            getCustomFonts: jest.fn(),
            getCuratedFonts: jest.fn(),
          },
        }}
      >
        {children}
      </FontContext.Provider>
    </StoryContext.Provider>
  );
}

Wrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const DEFAULT_PADDING = {
  horizontal: 0,
  vertical: 0,
  locked: true,
  hasHiddenPadding: false,
};

describe('panels/TextStyle/TextBox', () => {
  mockControls = {};
  let textElement, unlockPaddingTextElement;
  const paddingRatioLockLabel = 'Toggle padding ratio lock';

  beforeEach(() => {
    window.fetch.resetMocks();

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
      backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
    };

    textElement = {
      ...unlockPaddingTextElement,
      padding: DEFAULT_PADDING,
    };
  });

  function renderTextBox(selectedElements, ...args) {
    return renderPanel(TextStyle, selectedElements, Wrapper, ...args);
  }

  describe('paddingControls', () => {
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
      const updatedPropertiesWithHiddenPadding =
        pufoUpdateArg(withHiddenPadding);
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
      renderTextBox([textElement]);
      const multi = screen.getByRole('textbox', {
        name: 'Padding',
      });
      const lock = screen.getByRole('button', { name: paddingRatioLockLabel });
      expect(multi).toHaveValue('0');
      expect(lock).toHaveAttribute('aria-pressed', 'true');
    });

    it('should render specified padding controls', () => {
      renderTextBox([
        {
          ...textElement,
          padding: {
            horizontal: 11,
            vertical: 12,
            locked: false,
          },
        },
      ]);
      const horiz = screen.getByRole('textbox', { name: 'Horizontal padding' });
      const vert = screen.getByRole('textbox', { name: 'Vertical padding' });
      expect(horiz).toHaveValue('11');
      expect(vert).toHaveValue('12');
    });

    it('should update horizontal padding with lock', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([textElement]);
      const input = screen.getByRole('textbox', {
        name: 'Padding',
      });
      fireEvent.change(input, { target: { value: '20' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 20, vertical: 20 },
      });
    });

    it('should update horizontal padding without lock', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([
        unlockPaddingTextElement,
      ]);
      const input = screen.getByRole('textbox', { name: 'Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11 },
      });
    });

    it('should update vertical padding without lock', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([
        unlockPaddingTextElement,
      ]);
      const input = screen.getByRole('textbox', { name: 'Vertical padding' });
      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { vertical: 12 },
      });
    });

    it('should not update padding if empty string is submitted', () => {
      renderTextBox([
        {
          ...textSamePadding,
          padding: { ...DEFAULT_PADDING, horizontal: 10, vertical: 10 },
        },
      ]);
      const input = screen.getByRole('textbox', {
        name: 'Padding',
      });
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      fireEvent.blur(input);

      expect(input).toHaveValue('10');
    });

    it('should update multi padding with lock and same padding', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([
        textElement,
        textSamePadding,
      ]);
      const input = screen.getByRole('textbox', {
        name: 'Padding',
      });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11, vertical: 11 },
      });
    });

    it('should update multi padding with lock and different padding', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([
        textElement,
        textDifferentPadding,
      ]);
      const input = screen.getByRole('textbox', {
        name: 'Padding',
      });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      fireEvent.blur(input);

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11, vertical: 11 },
      });
    });

    it('should update multi padding without lock and same padding', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([
        unlockPaddingTextElement,
        unlockPaddingTextSamePadding,
      ]);
      const input = screen.getByRole('textbox', { name: 'Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11 },
      });
    });

    it('should update multi padding without lock and different padding', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([
        unlockPaddingTextElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = screen.getByRole('textbox', { name: 'Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11 },
      });
    });

    it('should correctly update only horizontal padding when multiple elements with different padding lock settings are selected', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([
        textElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = screen.getByRole('textbox', { name: 'Horizontal padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { horizontal: 11 },
      });
    });

    it('should correctly update only vertical padding when multiple elements with different padding lock settings are selected', () => {
      const { pushUpdateForObject, pushUpdate } = renderTextBox([
        textElement,
        unlockPaddingTextDifferentPadding,
      ]);
      const input = screen.getByRole('textbox', { name: 'Vertical padding' });
      fireEvent.change(input, { target: { value: '11' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });

      // See that updates were pushed
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function));
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );

      // See that updates are proper for element variations
      testUpdaterOnElementVariations({
        pushUpdateForObject,
        pushUpdate,
        expectedPaddingProperties: { vertical: 11 },
      });
    });

    it('should update default element lockPadding to false when padding lock clicked', () => {
      const { pushUpdateForObject } = renderTextBox([textElement]);
      fireEvent.click(screen.getByLabelText(paddingRatioLockLabel));
      const pufoUpdater = pushUpdateForObject.mock.calls[0][1];
      const el = { padding: {} };
      const updatedProperties = pufoUpdater(el);
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'padding',
        expect.any(Function),
        DEFAULT_PADDING,
        true
      );
      expect(updatedProperties).toStrictEqual({
        locked: false,
      });
    });

    it('should update unlock padding element lockPadding to true when padding lock clicked', () => {
      const { pushUpdateForObject } = renderTextBox([unlockPaddingTextElement]);
      fireEvent.click(screen.getByLabelText(paddingRatioLockLabel));
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
      const { pushUpdateForObject } = renderTextBox([
        unlockPaddingTextElement,
        textElement,
      ]);
      fireEvent.click(screen.getByLabelText(paddingRatioLockLabel));
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

  describe('mixed value multi-selection', () => {
    it('should display Mixed value in case of mixed value multi-selection', () => {
      const textElement1 = textElement;
      const textElement2 = {
        ...textElement,
        padding: {
          vertical: 1,
          horizontal: 1,
        },
      };

      renderTextBox([textElement1, textElement2]);

      const paddingH = screen.getByRole('textbox', {
        name: 'Horizontal padding',
      });
      expect(paddingH.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);

      const paddingV = screen.getByRole('textbox', {
        name: 'Vertical padding',
      });
      expect(paddingV.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
    });
  });
});
