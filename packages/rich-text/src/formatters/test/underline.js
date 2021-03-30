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
import { NONE, UNDERLINE } from '../../customConstants';
import formatter from '../underline';
import { getDOMElement } from './_utils';

jest.mock('../../styleManipulation', () => {
  return {
    togglePrefixStyle: jest.fn(),
    getPrefixStylesInSelection: jest.fn(),
  };
});

getPrefixStylesInSelection.mockImplementation(() => [NONE]);

describe('Underline formatter', () => {
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

    it('should ignore span elements without underline text decoration', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setup(element);

      expect(style).toBeNull();
    });

    it('should detect underline from span elements and return correct style', () => {
      const element = <span style={{ textDecoration: 'underline' }} />;
      const style = setup(element);
      const expected = UNDERLINE;

      expect(style).toBe(expected);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without underline style', () => {
      const css = stylesToCSS(['NOT-UNDERLINE', 'ALSO-NOT-UNDERLINE']);

      expect(css).toBeNull();
    });

    it('should return correct CSS if underline is present', () => {
      const css = stylesToCSS([UNDERLINE]);

      expect(css).toStrictEqual({ textDecoration: 'underline' });
    });
  });

  describe('getters', () => {
    it('should contain isUnderline property with getter', () => {
      expect(getters).toContainAllKeys(['isUnderline']);
      expect(getters.isUnderline).toStrictEqual(expect.any(Function));
    });

    it('should invoke getPrefixStylesInSelection with given state and correct style prefix', () => {
      const state = {};
      getters.isUnderline(state);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, UNDERLINE);
    });

    function setup(styleArray) {
      getPrefixStylesInSelection.mockImplementationOnce(() => styleArray);
      return getters.isUnderline({});
    }

    it('should return false if both underline and non-underline', () => {
      const styles = [NONE, UNDERLINE];
      const result = setup(styles);
      expect(result).toBe(false);
    });

    it('should return false if no style matches', () => {
      const styles = [NONE];
      const result = setup(styles);
      expect(result).toStrictEqual(false);
    });

    it('should return true if only underline', () => {
      const styles = [UNDERLINE];
      const result = setup(styles);
      expect(result).toStrictEqual(true);
    });
  });

  describe('setters', () => {
    it('should contain toggleUnderline property with function', () => {
      expect(setters).toContainAllKeys(['toggleUnderline']);
      expect(setters.toggleUnderline).toStrictEqual(expect.any(Function));
    });

    it('should invoke togglePrefixStyle with state and prefix', () => {
      const state = {};
      setters.toggleUnderline(state);
      expect(togglePrefixStyle).toHaveBeenCalledWith(state, UNDERLINE);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting underline to false', () => {
      const state = {};
      setters.toggleUnderline(state, false);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        UNDERLINE,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting underline to true', () => {
      const state = {};
      setters.toggleUnderline(state, true);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        UNDERLINE,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);
    });
  });
});
