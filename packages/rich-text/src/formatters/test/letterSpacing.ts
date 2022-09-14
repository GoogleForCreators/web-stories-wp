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
import { NONE, LETTERSPACING, MULTIPLE_VALUE } from '../../customConstants';
import formatter from '../letterSpacing';
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

    it('should ignore span elements without letter spacing style property', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should extract letter spacing from span elements and return correct style', () => {
      const element = <span style={{ letterSpacing: '1.5em' }} />;
      const style = setupFormatter(element);
      const expected = `${LETTERSPACING}-150`;

      expect(style).toBe(expected);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without a letter spacing style', () => {
      const css = stylesToCSS(['NOT-LETTERSPACING', 'ALSO-NOT-LETTERSPACING']);

      expect(css).toBeNull();
    });

    it('should ignore invalid letter spacing style', () => {
      const css = stylesToCSS([`${LETTERSPACING}-invalid`]);

      expect(css).toBeNull();
    });

    it('should return correct CSS for a positive style', () => {
      const css = stylesToCSS([`${LETTERSPACING}-150`]);

      expect(css).toStrictEqual({ letterSpacing: '1.5em' });
    });

    it('should return correct CSS for a negative style', () => {
      const css = stylesToCSS([`${LETTERSPACING}-N250`]);

      expect(css).toStrictEqual({ letterSpacing: '-2.5em' });
    });
  });

  describe('getters', () => {
    it('should contain letterSpacing property with getter', () => {
      expect(getters).toContainAllKeys(['letterSpacing']);
      expect(getters.letterSpacing).toStrictEqual(expect.any(Function));
    });

    it('should invoke getPrefixStylesInSelection with given state and correct style prefix', () => {
      const state = {};
      getters.letterSpacing(state);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(
        state,
        LETTERSPACING
      );
    });

    function setupFormatter(styleArray) {
      getPrefixStylesInSelection.mockImplementationOnce(() => styleArray);
      return getters.letterSpacing({});
    }

    it('should return multiple if more than one style matches', () => {
      const styles = [`${LETTERSPACING}-150`, `${LETTERSPACING}-N100`];
      const result = setupFormatter(styles);
      expect(result).toBe(MULTIPLE_VALUE);
    });

    it('should return default 0 if no style matches', () => {
      const styles = [NONE];
      const result = setupFormatter(styles);
      expect(result).toBe(0);
    });

    it('should return parsed letter spacing if exactly one style matches', () => {
      const styles = [`${LETTERSPACING}-34`];
      const result = setupFormatter(styles);
      expect(result).toBe(34);
    });
  });

  describe('setters', () => {
    it('should contain setLetterSpacing property with function', () => {
      expect(setters).toContainAllKeys(['setLetterSpacing']);
      expect(setters.setLetterSpacing).toStrictEqual(expect.any(Function));
    });

    it('should invoke togglePrefixStyle with state and prefix', () => {
      const state = {};
      const letterSpacing = 0;
      setters.setLetterSpacing(state, letterSpacing);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        LETTERSPACING,
        expect.any(Function),
        expect.any(Function)
      );
    });

    it('should invoke togglePrefixStyle correctly for trivial letter spacing', () => {
      const state = {};
      // 0 letter spacing is the trivial case, that doesn't need to be added
      const letterSpacing = 0;
      setters.setLetterSpacing(state, letterSpacing);

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);
    });

    it('should invoke togglePrefixStyle correctly for non-trivial letter spacing', () => {
      const state = {};
      // A non-zero letter spacing should be added as a style
      const letterSpacing = -150;
      setters.setLetterSpacing(state, letterSpacing);

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);

      // Fourth argument is actual style to set
      const styleToSet = togglePrefixStyle.mock.calls[0][3];
      expect(styleToSet()).toBe(`${LETTERSPACING}-N150`);
    });
  });
});
