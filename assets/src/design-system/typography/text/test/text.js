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
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { theme, THEME_CONSTANTS } from '../../../theme';
import { Text } from '../';

describe('design-system/typography/text', () => {
  const dummyContent = 'The Quick Brown Fox Jumps Over the Lazy Dog';

  it('should render a paragraph element by default', () => {
    const { container } = renderWithProviders(<Text>{dummyContent}</Text>);

    expect(container.getElementsByTagName('p')).toHaveLength(1);
  });

  it('should render an anchor tag when specified element', () => {
    const { container } = renderWithProviders(
      <Text as="a">{dummyContent}</Text>
    );

    expect(container.getElementsByTagName('a')).toHaveLength(1);
  });

  it('should render a span tag when specified element', () => {
    const { container } = renderWithProviders(
      <Text as="span">{dummyContent}</Text>
    );

    expect(container.getElementsByTagName('span')).toHaveLength(1);
  });

  it(`should render ${THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.MEDIUM} font size by default`, () => {
    const { container } = renderWithProviders(<Text>{dummyContent}</Text>);

    const DisplayElement = container.getElementsByTagName('p')[0];

    const fontSize = window.getComputedStyle(DisplayElement).fontSize;

    expect(fontSize).toBe(
      `${
        theme.typography.presets.text[
          THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.MEDIUM
        ].size
      }px`
    );
  });

  it(`should render large font size when passed in size is ${THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.LARGE}`, () => {
    const { container } = renderWithProviders(
      <Text size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.LARGE}>
        {dummyContent}
      </Text>
    );

    const DisplayElement = container.getElementsByTagName('p')[0];

    const fontSize = window.getComputedStyle(DisplayElement).fontSize;

    expect(fontSize).toBe(
      `${
        theme.typography.presets.text[
          THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.LARGE
        ].size
      }px`
    );
  });

  it(`should render x large font size when passed in size is ${THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.X_LARGE}`, () => {
    const { container } = renderWithProviders(
      <Text size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.X_LARGE}>
        {dummyContent}
      </Text>
    );

    const DisplayElement = container.getElementsByTagName('p')[0];

    const fontSize = window.getComputedStyle(DisplayElement).fontSize;

    expect(fontSize).toBe(
      `${
        theme.typography.presets.text[
          THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.X_LARGE
        ].size
      }px`
    );
  });
});
