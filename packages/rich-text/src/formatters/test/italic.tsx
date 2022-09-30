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
import { ITALIC, NONE } from '../../customConstants';
import formatter from '../italic';
import type { SetStyleCallback } from '../../types';
import { getDOMElement } from './_utils';

jest.mock('../../styleManipulation', () => {
  return {
    togglePrefixStyle: jest.fn(),
    getPrefixStylesInSelection: jest.fn(),
  };
});

const { elementToStyle, stylesToCSS, getters, setters } = formatter;

describe('Italic formatter', () => {
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

    it('should ignore span elements without italic font style', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should detect italic from span elements and return correct style', () => {
      const element = <span style={{ fontStyle: 'italic' }} />;
      const style = setupFormatter(element);
      expect(style).toBe(ITALIC);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without italic style', () => {
      const css = stylesToCSS({
        toArray: () => ['NOT-ITALIC', 'ALSO-NOT-ITALIC'],
      } as OrderedSet<string>);

      expect(css).toBeNull();
    });

    it('should return correct CSS if italic is present', () => {
      const css = stylesToCSS({
        toArray: () => [ITALIC],
      } as OrderedSet<string>);

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
      getters.isItalic(state as EditorState);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, ITALIC);
    });

    function setupFormatter(styleArray: string[]) {
      jest
        .mocked(getPrefixStylesInSelection)
        .mockImplementationOnce(() => styleArray);
      return getters.isItalic({} as EditorState);
    }

    it('should return false if both italic and non-italic', () => {
      const styles = [NONE, ITALIC];
      const result = setupFormatter(styles);
      expect(result).toBeFalse();
    });

    it('should return false if no style matches', () => {
      const styles = [NONE];
      const result = setupFormatter(styles);
      expect(result).toBeFalse();
    });

    it('should return true if only italic', () => {
      const styles = [ITALIC];
      const result = setupFormatter(styles);
      expect(result).toBeTrue();
    });
  });

  describe('setters', () => {
    it('should contain toggleItalic property with function', () => {
      expect(setters).toContainAllKeys(['toggleItalic']);
      expect(setters.toggleItalic).toStrictEqual(expect.any(Function));
    });

    it('should invoke togglePrefixStyle with state and prefix', () => {
      const state = {};
      setters.toggleItalic(state as EditorState);
      expect(togglePrefixStyle).toHaveBeenCalledWith(state, ITALIC);
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting italic to false', () => {
      const state = {};
      setters.toggleItalic(state as EditorState, false);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        ITALIC,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock
        .calls[0][2] as SetStyleCallback;
      expect(shouldSetStyle()).toBeFalse();
    });

    it('should invoke togglePrefixStyle correctly for explicitly setting italic to true', () => {
      const state = {};
      setters.toggleItalic(state as EditorState, true);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        ITALIC,
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock
        .calls[0][2] as SetStyleCallback;
      expect(shouldSetStyle()).toBeTrue();
    });
  });
});
