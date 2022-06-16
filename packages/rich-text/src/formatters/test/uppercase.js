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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../../styleManipulation';
import { NONE, UPPERCASE } from '../../customConstants';
import formatter from '../uppercase';

jest.mock('../../styleManipulation', () => {
  return {
    togglePrefixStyle: jest.fn(),
    getPrefixStylesInSelection: jest.fn(),
  };
});

const { elementToStyle, stylesToCSS, getters, setters } = formatter;

function setupFormatter(element) {
  const { container } = render(element);
  return elementToStyle(container.firstChild);
}

describe('Uppercase formatter', () => {
  beforeAll(() => {
    getPrefixStylesInSelection.mockImplementation(() => [NONE]);
  });

  beforeEach(() => {
    togglePrefixStyle.mockClear();
    getPrefixStylesInSelection.mockClear();
  });

  describe('elementToStyle', () => {
    it('should ignore non-span elements', () => {
      const element = <div />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should ignore span elements without uppercase text transform', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should detect uppercase from span elements and return correct style', () => {
      const element = <span style={{ textTransform: 'uppercase' }} />;
      const style = setupFormatter(element);
      const expected = UPPERCASE;

      expect(style).toBe(expected);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without uppercase style', () => {
      const css = stylesToCSS(['NOT-UPPERCASE', 'ALSO-NOT-UPPERCASE']);

      expect(css).toBeNull();
    });

    it('should return correct CSS if uppercase is present', () => {
      const css = stylesToCSS([UPPERCASE]);

      expect(css).toStrictEqual({ textTransform: 'uppercase' });
    });
  });

  describe('getters', () => {
    function setupGetter(styleArray) {
      getPrefixStylesInSelection.mockImplementationOnce(() => styleArray);
      return getters.isUppercase({});
    }

    it('should contain isUppercase property with getter', () => {
      expect(getters).toContainAllKeys(['isUppercase']);
      expect(getters.isUppercase).toStrictEqual(expect.any(Function));
    });

    it('should invoke getPrefixStylesInSelection with given state and correct style prefix', () => {
      const state = {};
      getters.isUppercase(state);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, UPPERCASE);
    });

    it('should return false if both uppercase and non-uppercase', () => {
      const styles = [NONE, UPPERCASE];
      const result = setupGetter(styles);
      expect(result).toBe(false);
    });

    it('should return false if no style matches', () => {
      const styles = [NONE];
      const result = setupGetter(styles);
      expect(result).toBe(false);
    });

    it('should return true if only uppercase', () => {
      const styles = [UPPERCASE];
      const result = setupGetter(styles);
      expect(result).toBe(true);
    });
  });

  describe('setters', () => {
    it('should contain toggleUppercase property with function', () => {
      expect(setters).toContainAllKeys(['toggleUppercase']);
      expect(setters.toggleUppercase).toStrictEqual(expect.any(Function));
    });

    it('should invoke togglePrefixStyle with state and prefix', () => {
      const state = {};
      setters.toggleUppercase(state);
      expect(togglePrefixStyle).toHaveBeenCalledWith(state, UPPERCASE);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting uppercase to false', () => {
      const state = {};
      setters.toggleUppercase(state, false);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        UPPERCASE,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting uppercase to true', () => {
      const state = {};
      setters.toggleUppercase(state, true);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        UPPERCASE,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = togglePrefixStyle.mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);
    });
  });
});
