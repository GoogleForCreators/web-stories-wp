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
import type { EditorState } from 'draft-js';
import { OrderedSet } from 'immutable';

/**
 * Internal dependencies
 */
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../../styleManipulation';
import { NONE, WEIGHT, MULTIPLE_VALUE } from '../../customConstants';
import formatter from '../weight';
import type { SetStyleCallback, StyleGetter } from '../../types';
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
    jest.mocked(getPrefixStylesInSelection).mockImplementation(() => [NONE]);
  });

  beforeEach(() => {
    jest.mocked(togglePrefixStyle).mockClear();
    jest.mocked(getPrefixStylesInSelection).mockClear();
  });

  describe('elementToStyle', () => {
    function setupFormatter(element: JSX.Element) {
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
      const css = stylesToCSS(OrderedSet.of('NOT-WEIGHT', 'ALSO-NOT-WEIGHT'));

      expect(css).toBeNull();
    });

    it('should ignore invalid font weight style', () => {
      const css = stylesToCSS(OrderedSet.of(`${WEIGHT}-invalid`));

      expect(css).toBeNull();
    });

    it('should return correct CSS for a valid style', () => {
      const css = stylesToCSS(OrderedSet.of(`${WEIGHT}-500`));

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
      getters.fontWeight(state as EditorState);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, WEIGHT);
    });

    function setupFontWeight(styleArray: string[]) {
      jest
        .mocked(getPrefixStylesInSelection)
        .mockImplementationOnce(() => styleArray);
      return getters.fontWeight({} as EditorState);
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

    function setupIsBold(styleArray: string[]) {
      jest
        .mocked(getPrefixStylesInSelection)
        .mockImplementationOnce(() => styleArray);
      return getters.isBold({} as EditorState);
    }

    it('should return false if mix of bold and non-bold', () => {
      const styles = [`${WEIGHT}-300`, `${WEIGHT}-700`];
      const result = setupIsBold(styles);
      expect(result).toBeFalse();
    });

    it('should return false if no style matches', () => {
      const styles = [NONE];
      const result = setupIsBold(styles);
      expect(result).toBeFalse();
    });

    it('should return true if all are bold', () => {
      const styles = [`${WEIGHT}-800`, `${WEIGHT}-600`];
      const result = setupIsBold(styles);
      expect(result).toBeTrue();
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
      setters.setFontWeight(state as EditorState, weight);
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
      setters.setFontWeight(state as EditorState, weight);

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock
        .calls[0][2] as SetStyleCallback;
      expect(shouldSetStyle()).toBeFalse();
    });

    it('should invoke togglePrefixStyle correctly for non-trivial font weight', () => {
      const state = {};
      // A non-400 font weight should be added as a style
      const weight = 900;
      setters.setFontWeight(state as EditorState, weight);

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock
        .calls[0][2] as SetStyleCallback;
      expect(shouldSetStyle()).toBeTrue();

      // Fourth argument is actual style to set
      const styleToSet = jest.mocked(togglePrefixStyle).mock
        .calls[0][3] as StyleGetter;
      expect(styleToSet()).toBe(`${WEIGHT}-900`);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting bold to false', () => {
      const state = {};
      setters.toggleBold(state as EditorState, false);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        WEIGHT,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock
        .calls[0][2] as SetStyleCallback;
      expect(shouldSetStyle()).toBeFalse();
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting bold to true', () => {
      const state = {};
      setters.toggleBold(state as EditorState, true);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        WEIGHT,
        expect.any(Function),
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock
        .calls[0][2] as SetStyleCallback;
      expect(shouldSetStyle()).toBeTrue();

      // Fourth argument is actual style to set
      const styleToSet = jest.mocked(togglePrefixStyle).mock
        .calls[0][3] as SetStyleCallback;
      expect(styleToSet()).toBe(`${WEIGHT}-700`);
    });

    it('should correctly determine if setting bold when toggling without explicit flag', () => {
      const state = {};
      setters.toggleBold(state as EditorState);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        WEIGHT,
        expect.any(Function),
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock
        .calls[0][2] as SetStyleCallback;
      expect(shouldSetStyle([NONE])).toBeTrue();
      expect(shouldSetStyle([`${WEIGHT}-300`, `${WEIGHT}-900`])).toBeTrue();
      expect(shouldSetStyle([`${WEIGHT}-600`, `${WEIGHT}-900`])).toBeFalse();

      // Fourth argument is actual style to set
      const styleToSet = jest.mocked(togglePrefixStyle).mock
        .calls[0][3] as StyleGetter;
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
