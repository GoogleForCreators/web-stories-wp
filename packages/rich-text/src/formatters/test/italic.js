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
import { NONE, ITALIC } from '../../customConstants';
import formatter from '../italic';
import { getDOMElement } from './_utils';

jest.mock('../../styleManipulation', () => {
  return {
    togglePrefixStyle: jest.fn(),
    getPrefixStylesInSelection: jest.fn(),
  };
});

getPrefixStylesInSelection.mockImplementation(() => [NONE]);

describe('Italic formatter', () => {
  beforeEach(() => {
    togglePrefixStyle.mockClear();
    getPrefixStylesInSelection.mockClear();
  });

  const { elementToStyle, stylesToCSS, getters, setters } = formatter;

  describe('elementToStyle', () => {
    function setup(element) {
      return elementToStyle(getDOMElement(element));
    }

    it('should ignore non-span elements', () => {
      const element = <div />;
      const style = setup(element);

      expect(style).toBeNull();
    });

    it('should ignore span elements without italic font style', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setup(element);

      expect(style).toBeNull();
    });

    it('should detect italic from span elements and return correct style', () => {
      const element = <span style={{ fontStyle: 'italic' }} />;
      const style = setup(element);
      const expected = ITALIC;

      expect(style).toBe(expected);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without italic style', () => {
      const css = stylesToCSS(['NOT-ITALIC', 'ALSO-NOT-ITALIC']);

      expect(css).toBeNull();
    });

    it('should return correct CSS if italic is present', () => {
      const css = stylesToCSS([ITALIC]);

      expect(css).toStrictEqual({ fontStyle: 'italic' });
    });
  });

  describe('getters', () => {
    it('should contain isItalic property with getter', () => {
      expect(getters).toContainAllKeys(['isItalic']);
      expect(getters.isItalic).toStrictEqual(expect.any(Function));
    });

    it('should invoke getPrefixStylesInSelection with given state and correct style prefix', () => {
      const state = {};
      getters.isItalic(state);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, ITALIC);
    });

    function setup(styleArray) {
      getPrefixStylesInSelection.mockImplementationOnce(() => styleArray);
      return getters.isItalic({});
    }

    it('should return false if both italic and non-italic', () => {
      const styles = [NONE, ITALIC];
      const result = setup(styles);
      expect(result).toBe(false);
    });

    it('should return false if no style matches', () => {
      const styles = [NONE];
      const result = setup(styles);
      expect(result).toStrictEqual(false);
    });

    it('should return true if only italic', () => {
      const styles = [ITALIC];
      const result = setup(styles);
      expect(result).toStrictEqual(true);
    });
  });

  describe('setters', () => {
    it('should contain toggleItalic property with function', () => {
      expect(setters).toContainAllKeys(['toggleItalic']);
      expect(setters.toggleItalic).toStrictEqual(expect.any(Function));
    });

    it('should invoke togglePrefixStyle with state and prefix', () => {
      const state = {};
      setters.toggleItalic(state);
      expect(togglePrefixStyle).toHaveBeenCalledWith(state, ITALIC);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting italic to false', () => {
      const state = {};
      setters.toggleItalic(state, false);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        ITALIC,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting italic to true', () => {
      const state = {};
      setters.toggleItalic(state, true);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        ITALIC,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);
    });
  });
});
