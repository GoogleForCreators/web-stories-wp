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

/**
 * Internal dependencies
 */
import Presets from '../presets';
import { BACKGROUND_TEXT_MODE } from '../../../../constants';
import { renderWithTheme } from '../../../../testUtils';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';

function setupPresets(props = {}) {
  const {
    isEditMode = false,
    isText = true,
    stylePresets,
    textContent = '',
  } = props;
  const presets = {
    textColors: [],
    fillColors: [],
    textStyles: [],
    ...stylePresets,
  };
  const handlePresetClick = jest.fn();
  return renderWithTheme(
    <Presets
      isEditMode={isEditMode}
      handlePresetClick={handlePresetClick}
      isText={isText}
      stylePresets={presets}
      textContent={textContent}
    />
  );
}

describe('stylePresets/Presets', () => {
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
  it('should not display labels when no presets exist', () => {
    const { queryByLabelText } = setupPresets();
    expect(queryByLabelText('Colors')).toBeNull();
    expect(queryByLabelText('Text Colors')).toBeNull();
    expect(queryByLabelText('Styles')).toBeNull();
  });

  it('should display labels if presets exist', () => {
    const { queryByLabelText } = setupPresets({
      stylePresets: {
        textStyles: [STYLE_PRESET],
        textColors: [TEST_COLOR],
        fillColors: [],
      },
    });
    expect(queryByLabelText('Text Colors')).toBeDefined();
    expect(queryByLabelText('Styles')).toBeDefined();
  });

  it('should display correct text inside a style preset', () => {
    const textContent = 'Hello, Preset';
    const { getByText } = setupPresets({
      textContent,
      stylePresets: {
        textStyles: [STYLE_PRESET],
        textColors: [],
        fillColors: [],
      },
    });
    expect(getByText(textContent)).toBeDefined();
  });

  it('should display highlight wrapper in a style preset', () => {
    const textContent = 'Hello, Preset';
    const { getByText } = setupPresets({
      textContent,
      stylePresets: {
        textStyles: [
          {
            ...STYLE_PRESET,
            backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
          },
        ],
        textColors: [],
        fillColors: [],
      },
    });
    const text = getByText(textContent);
    expect(text.nodeName).toStrictEqual('SPAN');
    expect(text.className.toLowerCase()).toContain('highlight');
  });
});
