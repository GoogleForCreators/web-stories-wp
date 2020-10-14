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
import { Display } from '../';

describe('design-system/typography/display', () => {
  const dummyContent = 'The Quick Brown Fox Jumps Over the Lazy Dog';

  it('should render an h2 element when specified', () => {
    const { container } = renderWithProviders(
      <Display as={'h2'}>{dummyContent}</Display>
    );

    expect(container.getElementsByTagName('h2')).toHaveLength(1);
  });

  it(`should render ${THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.MEDIUM} font size by default`, () => {
    const { container } = renderWithProviders(
      <Display as={'h3'}>{dummyContent}</Display>
    );

    const DisplayElement = container.getElementsByTagName('h3')[0];
    const fontSize = window.getComputedStyle(DisplayElement).fontSize;
    expect(fontSize).toBe(
      `${
        theme.typography.presets.display[
          THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.MEDIUM
        ].size
      }px`
    );
  });

  it(`should render ${THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.LARGE} font size when specified`, () => {
    const { container } = renderWithProviders(
      <Display as={'h1'} size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.LARGE}>
        {dummyContent}
      </Display>
    );

    const DisplayElement = container.getElementsByTagName('h1')[0];
    const fontSize = window.getComputedStyle(DisplayElement).fontSize;
    expect(fontSize).toBe(
      `${
        theme.typography.presets.display[
          THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.LARGE
        ].size
      }px`
    );
  });
});
