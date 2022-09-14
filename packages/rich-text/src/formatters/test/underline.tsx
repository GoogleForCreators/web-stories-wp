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
import type { OrderedSet } from 'immutable';

/**
 * Internal dependencies
 */
import {
  getPrefixStylesInSelection,
  togglePrefixStyle,
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

const { elementToStyle, stylesToCSS, getters, setters } = formatter;

describe('Underline formatter', () => {
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

    it('should ignore span elements without underline text decoration', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should detect underline from span elements and return correct style', () => {
      const element = <span style={{ textDecoration: 'underline' }} />;
      const style = setupFormatter(element);
      expect(style).toBe(UNDERLINE);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without underline style', () => {
      const css = stylesToCSS({
        toArray: () => ['NOT-UNDERLINE', 'ALSO-NOT-UNDERLINE'],
      } as OrderedSet<string>);

      expect(css).toBeNull();
    });

    it('should return correct CSS if underline is present', () => {
      const css = stylesToCSS({
        toArray: () => [UNDERLINE],
      } as OrderedSet<string>);

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
      getters.isUnderline(state as EditorState);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, UNDERLINE);
    });

    function setupFormatter(styleArray: string[]) {
      jest
        .mocked(getPrefixStylesInSelection)
        .mockImplementationOnce(() => styleArray);
      return getters.isUnderline({} as EditorState);
    }

    it('should return false if both underline and non-underline', () => {
      const styles = [NONE, UNDERLINE];
      const result = setupFormatter(styles);
      expect(result).toBe(false);
    });

    it('should return false if no style matches', () => {
      const styles = [NONE];
      const result = setupFormatter(styles);
      expect(result).toBe(false);
    });

    it('should return true if only underline', () => {
      const styles = [UNDERLINE];
      const result = setupFormatter(styles);
      expect(result).toBe(true);
    });
  });

  describe('setters', () => {
    it('should contain toggleUnderline property with function', () => {
      expect(setters).toContainAllKeys(['toggleUnderline']);
      expect(setters.toggleUnderline).toStrictEqual(expect.any(Function));
    });

    it('should invoke togglePrefixStyle with state and prefix', () => {
      const state = {};
      setters.toggleUnderline(state as EditorState);
      expect(togglePrefixStyle).toHaveBeenCalledWith(state, UNDERLINE);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting underline to false', () => {
      const state = {};
      setters.toggleUnderline(state as EditorState, false);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        UNDERLINE,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting underline to true', () => {
      const state = {};
      setters.toggleUnderline(state as EditorState, true);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        UNDERLINE,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);
    });
  });
});
