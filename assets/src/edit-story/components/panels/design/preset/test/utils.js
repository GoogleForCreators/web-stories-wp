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
  presetHasOpacity,
} from '../utils';
import { BACKGROUND_TEXT_MODE } from '../../../../../constants';
import objectWithout from '../../../../../utils/objectWithout';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../../app/font/defaultFonts';

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
      colors: [
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
      colors: [
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

  it('should get correct text style presets from selected elements', () => {
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
        content: '<span style="color: rgb(1,1,1)">Content</span>',
      },
      {
        type: 'text',
        x: 30,
        content:
          '<span style="font-weight: 700; font-style: italic; color: rgb(2,2,2)">Content</span>',
        ...objectWithout(stylePreset, ['color']),
      },
    ];
    const stylePresets = {
      textStyles: [],
      colors: [],
    };
    const expected = {
      colors: [],
      textStyles: [
        {
          backgroundTextMode: 'NONE',
          color: TEST_COLOR,
          font: TEXT_ELEMENT_DEFAULT_FONT,
          fontWeight: 400,
          isItalic: false,
          isUnderline: false,
          letterSpacing: 0,
          padding: {
            horizontal: 0,
            vertical: 0,
          },
        },
        {
          backgroundColor: TEST_COLOR,
          backgroundTextMode: 'FILL',
          color: TEST_COLOR_2,
          font: {
            fallbacks: ['Bar'],
            family: 'Foo',
          },
          fontWeight: 700,
          isItalic: true,
          isUnderline: false,
          letterSpacing: 0,
        },
      ],
    };
    const presets = getTextPresets(elements, stylePresets, 'style');
    expect(presets).toStrictEqual(expected);
  });

  it('should ignore text color presets for multi-color text fields', () => {
    const elements = [
      {
        type: 'text',
        backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content:
          '<span style="color: rgb(1,1,1)">O</span><span style="color: rgb(2,1,1)">K</span>',
      },
    ];
    const stylePresets = {
      textStyles: [],
      colors: [],
    };
    const expected = {
      colors: [],
      textStyles: [],
    };
    const presets = getTextPresets(elements, stylePresets, 'color');
    expect(presets).toStrictEqual(expected);
  });

  it('should use black color when adding text style preset for multi-color text fields', () => {
    const stylePreset = {
      ...STYLE_PRESET,
      fontWeight: 400,
      isItalic: false,
      isUnderline: false,
      letterSpacing: 0,
      font: {
        family: 'Foo',
        fallbacks: ['Bar'],
      },
    };
    const elements = [
      {
        type: 'text',
        x: 30,
        content:
          '<span style="color: rgb(1,1,1)">O</span><span style="color: rgb(2,1,1)">K</span>',
        ...objectWithout(stylePreset, ['color']),
      },
    ];
    const stylePresets = {
      textStyles: [],
      fillColors: [],
    };
    const expected = {
      colors: [],
      textStyles: [
        {
          ...stylePreset,
          color: { color: { r: 0, g: 0, b: 0 } },
        },
      ],
    };
    const presets = getTextPresets(elements, stylePresets, 'style');
    expect(presets).toStrictEqual(expected);
  });

  it('should get correct font weight for text preset', () => {
    const elements = [
      {
        type: 'text',
        backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: '<span style="font-weight: 600">Semi-bold</span>',
      },
    ];
    const stylePresets = {
      textStyles: [],
      colors: [],
    };
    const expected = {
      colors: [],
      textStyles: [
        {
          backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
          font: TEXT_ELEMENT_DEFAULT_FONT,
          color: { color: { r: 0, g: 0, b: 0 } },
          fontWeight: 600,
          isItalic: false,
          isUnderline: false,
          letterSpacing: 0,
        },
      ],
    };
    const presets = getTextPresets(elements, stylePresets, 'style');
    expect(presets).toStrictEqual(expected);
  });

  it('should default to null/false when adding text style preset for mixed inline styles', () => {
    const stylePreset = {
      ...STYLE_PRESET,
      fontWeight: null,
      isItalic: false,
      isUnderline: false,
      letterSpacing: null,
      font: {
        family: 'Foo',
        fallbacks: ['Bar'],
      },
    };
    const elements = [
      {
        type: 'text',
        x: 30,
        content:
          '<span style="letter-spacing: 2px; font-style: italic; font-weight: 700; text-decoration: underline; color: rgb(1,1,1)">O</span><span style="text-decoration: none; color: rgb(2,1,1)">K</span>',
        ...objectWithout(stylePreset, ['color']),
      },
    ];
    const stylePresets = {
      textStyles: [],
      fillColors: [],
    };
    const expected = {
      colors: [],
      textStyles: [
        {
          ...stylePreset,
          color: { color: { r: 0, g: 0, b: 0 } },
        },
      ],
    };
    const presets = getTextPresets(elements, stylePresets, 'style');
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
        content: '<span style="color: rgb(1,1,1)">Content</span>',
        padding: {
          vertical: 0,
          horizontal: 0,
        },
      },
      {
        type: 'text',
        x: 30,
        content: '<span style="color: rgb(2,2,2)">Content</span>',
        ...objectWithout(stylePreset, ['color']),
      },
    ];
    const colorPresets = {
      colors: [TEST_COLOR, TEST_COLOR_2],
    };
    const expected = {
      colors: [],
      textStyles: [],
    };
    const presets = getTextPresets(elements, colorPresets, 'color');
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
      colors: [],
    };
    const expected = {
      colors: [TEST_COLOR, TEST_COLOR_2],
    };
    const presets = getShapePresets(elements, stylePresets);
    expect(presets).toStrictEqual(expected);
  });

  it('should detect opacity in preset correctly', () => {
    expect(presetHasOpacity(TEST_COLOR)).toBeFalse();
    const preset1 = {
      color: {
        r: 1,
        g: 1,
        b: 1,
        a: 0.5,
      },
    };
    expect(presetHasOpacity(preset1)).toBeTrue();

    const preset2 = {
      type: 'linear',
      stops: [TEST_COLOR, preset1],
    };
    expect(presetHasOpacity(preset2)).toBeTrue();

    const preset3 = {
      type: 'linear',
      stops: [TEST_COLOR, TEST_COLOR_2],
    };
    expect(presetHasOpacity(preset3)).toBeFalse();
  });
});
