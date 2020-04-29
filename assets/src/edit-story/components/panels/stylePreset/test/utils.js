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
  findMatchingColor,
  findMatchingStylePreset,
  getShapePresets,
  getTextPresets,
} from '../utils';
import { BACKGROUND_TEXT_MODE } from '../../../../constants';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';

describe('Panels/StylePreset/utils', () => {
  const TEST_COLOR = {
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
  };
  const TEST_COLOR_2 = {
    color: {
      r: 2,
      g: 2,
      b: 2,
    },
  };
  const STYLE_PRESET = {
    color: TEST_COLOR_2,
    backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
    backgroundColor: TEST_COLOR,
    font: TEXT_ELEMENT_DEFAULT_FONT,
  };
  it('should return matching color object', () => {
    const stylePresets = {
      textColors: [
        TEST_COLOR,
        {
          color: {
            r: 2,
            g: 2,
            b: 1,
          },
        },
      ],
    };
    const color = {
      color: {
        r: 1,
        g: 1,
        b: 1,
      },
    };
    expect(findMatchingColor(color, stylePresets, true)).toStrictEqual(color);
  });

  it('should return undefined when not finding matching color', () => {
    const stylePresets = {
      textColors: [
        {
          color: {
            r: 1,
            g: 2,
            b: 3,
          },
        },
        {
          color: {
            r: 2,
            g: 2,
            b: 1,
          },
        },
      ],
    };
    expect(findMatchingColor(TEST_COLOR, stylePresets, true)).not.toBeDefined();
  });

  it('should return matching text style preset', () => {
    const stylePresets = {
      textStyles: [STYLE_PRESET],
    };
    const stylePreset = {
      color: {
        color: {
          r: 2,
          g: 2,
          b: 2,
        },
      },
      backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
      backgroundColor: {
        color: {
          r: 1,
          g: 1,
          b: 1,
        },
      },
      font: TEXT_ELEMENT_DEFAULT_FONT,
    };
    expect(findMatchingStylePreset(stylePreset, stylePresets)).toStrictEqual(
      stylePreset
    );
  });

  it('should return not return non-matching text style preset', () => {
    const stylePresets = {
      textStyles: [STYLE_PRESET],
    };
    const stylePreset = {
      color: {
        color: {
          r: 1,
          g: 2,
          b: 2,
        },
      },
      backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
      backgroundColor: {
        color: {
          r: 1,
          g: 1,
          b: 1,
        },
      },
      font: TEXT_ELEMENT_DEFAULT_FONT,
    };
    expect(
      findMatchingStylePreset(stylePreset, stylePresets)
    ).not.toBeDefined();
  });

  it('should get correct text presets from selected elements', () => {
    const stylePreset = {
      ...STYLE_PRESET,
      font: {
        family: 'Foo',
        fallbacks: ['Bar'],
      },
    };
    const elements = [
      {
        type: 'text',
        backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
        font: TEXT_ELEMENT_DEFAULT_FONT,
        foo: 'bar',
        padding: {
          vertical: 0,
          horizontal: 0,
        },
        color: TEST_COLOR,
      },
      {
        type: 'text',
        x: 30,
        ...stylePreset,
      },
    ];
    const stylePresets = {
      textStyles: [],
      textColors: [],
      fillColors: [],
    };
    const expected = {
      textColors: [TEST_COLOR],
      textStyles: [stylePreset],
    };
    const presets = getTextPresets(elements, stylePresets);
    expect(presets).toStrictEqual(expected);
  });

  it('should not consider existing presets as new', () => {
    const stylePreset = {
      ...STYLE_PRESET,
      font: {
        family: 'Foo',
        fallbacks: ['Bar'],
      },
    };
    const elements = [
      {
        type: 'text',
        backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
        font: TEXT_ELEMENT_DEFAULT_FONT,
        foo: 'bar',
        color: TEST_COLOR,
        padding: {
          vertical: 0,
          horizontal: 0,
        },
      },
      {
        type: 'text',
        x: 30,
        ...stylePreset,
      },
    ];
    const stylePresets = {
      textStyles: [stylePreset],
      textColors: [TEST_COLOR],
      fillColors: [],
    };
    const expected = {
      textColors: [],
      textStyles: [],
    };
    const presets = getTextPresets(elements, stylePresets);
    expect(presets).toStrictEqual(expected);
  });

  it('should get correct shape presets from selected elements', () => {
    const elements = [
      {
        type: 'shape',
        backgroundColor: TEST_COLOR,
      },
      {
        type: 'shape',
        backgroundColor: TEST_COLOR_2,
      },
    ];
    const stylePresets = {
      textStyles: [],
      textColors: [],
      fillColors: [],
    };
    const expected = {
      fillColors: [TEST_COLOR, TEST_COLOR_2],
    };
    const presets = getShapePresets(elements, stylePresets);
    expect(presets).toStrictEqual(expected);
  });
});
