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
import { createSolid } from '@googleforcreators/patterns';
import type { EditorState } from 'draft-js';
import type { OrderedSet } from 'immutable';

/**
 * Internal dependencies
 */
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../../styleManipulation';
import { NONE, COLOR, MULTIPLE_VALUE } from '../../customConstants';
import formatter from '../color';
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

    it('should ignore span elements without color style property', () => {
      const element = <span style={{ backgroundColor: 'red' }} />;
      const style = setupFormatter(element);

      expect(style).toBeNull();
    });

    it('should extract color without opacity from span elements and return correct style', () => {
      const element = <span style={{ color: 'red' }} />;
      const style = setupFormatter(element);
      const expected = `${COLOR}-ff000064`;

      expect(style).toBe(expected);
    });

    it('should extract color with opacity from span elements and return correct style', () => {
      const element = <span style={{ color: 'rgba(0, 255, 0, 0.5)' }} />;
      const style = setupFormatter(element);
      const expected = `${COLOR}-00ff0032`;

      expect(style).toBe(expected);
    });
  });

  describe('stylesToCSS', () => {
    it('should ignore styles without a color style', () => {
      const css = stylesToCSS();

      expect(css).toBeNull();
    });

    it('should ignore invalid color style', () => {
      const css = stylesToCSS({
        toArray: () => [`${COLOR}-invalid`],
      } as OrderedSet<string>);

      expect(css).toBeNull();
    });

    it('should return correct CSS for a valid color style', () => {
      const css = stylesToCSS({
        toArray: () => [`${COLOR}-ff000032`],
      } as OrderedSet<string>);

      expect(css).toStrictEqual({ color: 'rgba(255,0,0,0.5)' });
    });
  });

  describe('getters', () => {
    it('should contain color property with getter', () => {
      expect(getters).toContainAllKeys(['color']);
      expect(getters.color).toStrictEqual(expect.any(Function));
    });

    it('should invoke getPrefixStylesInSelection with given state and correct style prefix', () => {
      const state = {};
      getters.color(state as EditorState);
      expect(getPrefixStylesInSelection).toHaveBeenCalledWith(state, COLOR);
    });

    function setupFormatter(styleArray: string[]) {
      jest.mocked(getPrefixStylesInSelection).mockImplementationOnce(() => styleArray);
      return getters.color({} as EditorState);
    }

    it('should return multiple if more than one style matches', () => {
      const styles = [`${COLOR}-ff000064`, `${COLOR}-ffff0064`];
      const result = setupFormatter(styles);
      expect(result).toBe(MULTIPLE_VALUE);
    });

    it('should return default black if no style matches', () => {
      const styles = [NONE];
      const result = setupFormatter(styles);
      expect(result).toStrictEqual(createSolid(0, 0, 0));
    });

    it('should return parsed color if exactly one style matches', () => {
      const styles = [`${COLOR}-ffff0032`];
      const result = setupFormatter(styles);
      expect(result).toStrictEqual(createSolid(255, 255, 0, 0.5));
    });
  });

  describe('setters', () => {
    it('should contain setColor property with function', () => {
      expect(setters).toContainAllKeys(['setColor']);
      expect(setters.setColor).toStrictEqual(expect.any(Function));
    });

    it('should invoke togglePrefixStyle correctly with non-black color', () => {
      const state: EditorState = {} as EditorState;
      const color = createSolid(255, 0, 255);
      setters.setColor(state, color);
      expect(togglePrefixStyle).toHaveBeenCalledWith(
        state,
        COLOR,
        expect.any(Function),
        expect.any(Function)
      );

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock.calls[0][2];
      expect(shouldSetStyle()).toBe(true);

      // Fourth argument is actual style to set
      const styleToSet = jest.mocked(togglePrefixStyle).mock.calls[0][3];
      expect(styleToSet()).toBe(`${COLOR}-ff00ff64`);
    });

    it('should invoke togglePrefixStyle correctly with black color', () => {
      const state = {};
      const color = createSolid(0, 0, 0);
      setters.setColor(state as EditorState, color);

      // Third argument is tester
      const shouldSetStyle = jest.mocked(togglePrefixStyle).mock.calls[0][2];
      expect(shouldSetStyle()).toBe(false);

      // Fourth argument is ignored
    });
  });
});
