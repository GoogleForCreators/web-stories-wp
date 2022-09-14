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
 * Internal dependencies
 */
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../../styleManipulation';
import { NONE, WEIGHT, MULTIPLE_VALUE } from '../../customConstants';
import formatter from '../weight';
import { getDOMElement } from './_utils';

jest.mock('../../styleManipulation', () => {
  return {
    togglePrefixStyle: jest.fn(),
    getPrefixStylesInSelection: jest.fn(),
  };
});

const { elementToStyle, stylesToCSS, getters, setters } = formatter;

describe('Color formatter', () => {
  beforeAll(() => {
    getPrefixStylesInSelection.mockImplementation(() => [NONE]);
  });

  beforeEach(() => {
    togglePrefixStyle.mockClear();
    getPrefixStylesInSelection.mockClear();
  });

  describe('elementToStyle', () => {
    function setupFormatter(element) {
      return elementToStyle(getDOMElement(element));
    }

    it('should ignore non-span elements', () => {
      const element = <div />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should ignore span elements without font weight style property', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should extract font weight from span elements and return correct style', () => {
      const element = <span style={{ fontWeight: 600 }} />;
      const style = setupFormatter(element);
      const expected = `${WEIGHT}-600`;

      expect(style).toBe(expected);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without a font weight style', () => {
      const css = stylesToCSS(['NOT-WEIGHT', 'ALSO-NOT-WEIGHT']);

      expect(css).toBeNull();
    });

    it('should ignore invalid font weight style', () => {
      const css = stylesToCSS([`${WEIGHT}-invalid`]);

      expect(css).toBeNull();
    });

    it('should return correct CSS for a valid style', () => {
      const css = stylesToCSS([`${WEIGHT}-500`]);

      expect(css).toStrictEqual({ fontWeight: 500 });
    });
  });

  describe('getters', () => {
    it('should contain weight and isBold properties with getters', () => {
      expect(getters).toContainAllKeys(['fontWeight', 'isBold']);
      expect(getters.fontWeight).toStrictEqual(expect.any(Function));
      expect(getters.isBold).toStrictEqual(expect.any(Function));
    });

    it('should invoke getPrefixStylesInSelection with given state and correct style prefix', () => {
      const state = {};
      getters.fontWeight(state);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, WEIGHT);
    });

    function setupFontWeight(styleArray) {
      getPrefixStylesInSelection.mockImplementationOnce(() => styleArray);
      return getters.fontWeight({});
    }

    it('should return multiple if more than one style matches', () => {
      const styles = [`${WEIGHT}-400`, `${WEIGHT}-600`];
      const result = setupFontWeight(styles);
      expect(result).toBe(MULTIPLE_VALUE);
    });

    it('should return default 400 if no style matches', () => {
      const styles = [NONE];
      const result = setupFontWeight(styles);
      expect(result).toBe(400);
    });

    it('should return parsed font weight if exactly one style matches', () => {
      const styles = [`${WEIGHT}-700`];
      const result = setupFontWeight(styles);
      expect(result).toBe(700);
    });

    function setupIsBold(styleArray) {
      getPrefixStylesInSelection.mockImplementationOnce(() => styleArray);
      return getters.isBold({});
    }

    it('should return false if mix of bold and non-bold', () => {
      const styles = [`${WEIGHT}-300`, `${WEIGHT}-700`];
      const result = setupIsBold(styles);
      expect(result).toBe(false);
    });

    it('should return false if no style matches', () => {
      const styles = [NONE];
      const result = setupIsBold(styles);
      expect(result).toBe(false);
    });

    it('should return true if all are bold', () => {
      const styles = [`${WEIGHT}-800`, `${WEIGHT}-600`];
      const result = setupIsBold(styles);
      expect(result).toBe(true);
    });
  });

  describe('setters', () => {
    it('should contain setWeight and toggleBold properties with functions', () => {
      expect(setters).toContainAllKeys(['setFontWeight', 'toggleBold']);
      expect(setters.setFontWeight).toStrictEqual(expect.any(Function));
      expect(setters.toggleBold).toStrictEqual(expect.any(Function));
    });

    it('should invoke togglePrefixStyle with state and prefix', () => {
      const state = {};
      const weight = 0;
      setters.setFontWeight(state, weight);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        WEIGHT,
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('should invoke togglePrefixStyle correctly for trivial font weight', () => {
      const state = {};
      // 400 font weight is the trivial case, that doesn't need to be added
      const weight = 400;
      setters.setFontWeight(state, weight);

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);
    });

    it('should invoke togglePrefixStyle correctly for non-trivial font weight', () => {
      const state = {};
      // A non-400 font weight should be added as a style
      const weight = 900;
      setters.setFontWeight(state, weight);

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);

      // Fourth argument is actual style to set
      const styleToSet = togglePrefixStyle.mock.calls[0][3];
      expect(styleToSet()).toBe(`${WEIGHT}-900`);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting bold to false', () => {
      const state = {};
      setters.toggleBold(state, false);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        WEIGHT,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting bold to true', () => {
      const state = {};
      setters.toggleBold(state, true);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        WEIGHT,
        expect.any(Function),
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);

      // Fourth argument is actual style to set
      const styleToSet = togglePrefixStyle.mock.calls[0][3];
      expect(styleToSet()).toBe(`${WEIGHT}-700`);
    });

    it('should correctly determine if setting bold when toggling without explicit flag', () => {
      const state = {};
      setters.toggleBold(state);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        WEIGHT,
        expect.any(Function),
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle([NONE])).toBe(true);
      expect(shouldSetStyle([`${WEIGHT}-300`, `${WEIGHT}-900`])).toBe(true);
      expect(shouldSetStyle([`${WEIGHT}-600`, `${WEIGHT}-900`])).toBe(false);

      // Fourth argument is actual style to set
      const styleToSet = togglePrefixStyle.mock.calls[0][3];
      expect(styleToSet([NONE])).toBe(`${WEIGHT}-700`);
      expect(styleToSet([`${WEIGHT}-300`, `${WEIGHT}-600`])).toBe(
        `${WEIGHT}-700`
      );
      expect(styleToSet([`${WEIGHT}-300`, `${WEIGHT}-900`])).toBe(
        `${WEIGHT}-900`
      );
    });
  });
});
