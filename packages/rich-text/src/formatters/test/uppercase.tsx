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
import type { OrderedSet } from 'immutable';
import type { EditorState } from 'draft-js';

/**
 * Internal dependencies
 */
import {
  getPrefixStylesInSelection,
  togglePrefixStyle,
} from '../../styleManipulation';
import { NONE, UPPERCASE } from '../../customConstants';
import formatter from '../uppercase';
import { getDOMElement } from './_utils';

jest.mock('../../styleManipulation', () => {
  return {
    togglePrefixStyle: jest.fn(),
    getPrefixStylesInSelection: jest.fn(),
  };
});

const { elementToStyle, stylesToCSS, getters, setters } = formatter;

describe('Uppercase formatter', () => {
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

    it('should ignore span elements without uppercase text transform', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should detect uppercase from span elements and return correct style', () => {
      const element = <span style={{ textTransform: 'uppercase' }} />;
      const style = setupFormatter(element);
      expect(style).toBe(UPPERCASE);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without uppercase style', () => {
      const css = stylesToCSS({
        toArray: () => ['NOT-UPPERCASE', 'ALSO-NOT-UPPERCASE'],
      } as OrderedSet<string>);

      expect(css).toBeNull();
    });

    it('should return correct CSS if uppercase is present', () => {
      const css = stylesToCSS({
        toArray: () => [UPPERCASE],
      } as OrderedSet<string>);

      expect(css).toStrictEqual({ textTransform: 'uppercase' });
    });
  });

  describe('getters', () => {
    it('should contain isUppercase property with getter', () => {
      expect(getters).toContainAllKeys(['isUppercase']);
      expect(getters.isUppercase).toStrictEqual(expect.any(Function));
    });

    it('should invoke getPrefixStylesInSelection with given state and correct style prefix', () => {
      const state = {};
      getters.isUppercase(state as EditorState);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, UPPERCASE);
    });

    function setupFormatter(styleArray: string[]) {
      jest
        .mocked(getPrefixStylesInSelection)
        .mockImplementationOnce(() => styleArray);
      return getters.isUppercase({} as EditorState);
    }

    it('should return false if both uppercase and non-uppercase', () => {
      const styles = [NONE, UPPERCASE];
      const result = setupFormatter(styles);
      expect(result).toBe(false);
    });

    it('should return false if no style matches', () => {
      const styles = [NONE];
      const result = setupFormatter(styles);
      expect(result).toBe(false);
    });

    it('should return true if only uppercase', () => {
      const styles = [UPPERCASE];
      const result = setupFormatter(styles);
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
      setters.toggleUppercase(state as EditorState);
      expect(togglePrefixStyle).toHaveBeenCalledWith(state, UPPERCASE);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting uppercase to false', () => {
      const state = {};
      setters.toggleUppercase(state as EditorState, false);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        UPPERCASE,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting uppercase to true', () => {
      const state = {};
      setters.toggleUppercase(state as EditorState, true);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        UPPERCASE,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);
    });
  });
});
