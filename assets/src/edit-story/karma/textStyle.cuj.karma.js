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
import { waitForElementToBeRemoved } from '@testing-library/react';

/**
 * Internal dependencies
 */
import useInsertElement from '../components/canvas/useInsertElement';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../app/font/defaultFonts';
import { useStory } from '../app/story';
import { Fixture } from './fixture';

describe('Element: Text', () => {
  let fixture;

  const addText = async (extraProps = null) => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'hello world!',
        x: 40,
        y: 40,
        width: 250,
        ...extraProps,
      })
    );
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await addText();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator Can Style Text: Use font picker', () => {
    // There are 3 curated fonts included by default even though the total is more.
    const DEFAULT_VISIBLE_FONTS = 3;
    // Timeout used for submitting / search update + 50ms (250 + 50).
    const TIMEOUT = 300;
    const openFontPicker = async () => {
      const input = await fixture.screen.getByLabelText('Edit: Font family');
      await fixture.events.click(input);
    };

    beforeEach(async () => {
      await openFontPicker();
    });

    it('should render the font picker', async () => {
      await fixture.snapshot('font picker open');
    });

    it('should apply the selected font', async () => {
      await fixture.events.keyboard.type('Yrsa');
      // Ensure the debounced callback has taken effect.
      await fixture.events.sleep(TIMEOUT);
      const option = fixture.screen.getByText('Yrsa');
      await fixture.events.click(option);
      await fixture.events.sleep(TIMEOUT);
      await openFontPicker();
      const selected = fixture.screen.getAllByRole('option', {
        name: 'Selected Yrsa',
      });
      expect(selected.length).toBe(1);

      const {
        state: {
          currentPage: { elements },
        },
      } = await fixture.renderHook(() => useStory());
      expect(elements[1].font.family).toBe('Yrsa');
    });

    it('should display only the fonts from curated list by default', () => {
      const options = document
        .getElementById('editor-font-picker-list')
        .querySelectorAll('li[role="option"]');
      expect(options.length).toBe(DEFAULT_VISIBLE_FONTS);
    });

    describe('when searching fonts', () => {
      it('should display the correct fonts when searching', async () => {
        await fixture.events.keyboard.type('Ab');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(2);
        expect(options[0].textContent).toBe('Abel');
        expect(options[1].textContent).toBe('Abhaya Libre');

        await fixture.events.keyboard.type('el');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(1);
        expect(options[0].textContent).toBe('Abel');
      });

      it('should not search with less than 2 characters', async () => {
        await fixture.events.keyboard.type('A');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS);
      });

      it('should restore default fonts list when emptying search', async () => {
        await fixture.events.keyboard.type('Ab');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        const options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(2);

        await fixture.events.keyboard.press('Backspace');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        const defaultOptions = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        // Back to all options.
        expect(defaultOptions.length).toBe(DEFAULT_VISIBLE_FONTS);
      });

      it('should show empty list in case of no results', async () => {
        await fixture.events.keyboard.type('No fonts here');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        expect(fixture.screen.getByText('No matches found')).toBeDefined();
      });
    });

    describe('with recent fonts', () => {
      it('should not display any recent fonts by default', () => {
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS);
      });

      it('should add up to 5 recent fonts, displaying the most recent first', async () => {
        await fixture.events.keyboard.type('Space Mono');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        let option = fixture.screen.getByText('Space Mono');
        await fixture.events.click(option);
        await fixture.events.sleep(TIMEOUT);
        await openFontPicker();

        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 1);
        expect(options[0].textContent).toBe('Space Mono');

        await fixture.events.keyboard.type('Abel');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        option = fixture.screen.getByText('Abel');
        await fixture.events.click(option);
        await fixture.events.sleep(TIMEOUT);
        await openFontPicker();
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 2);

        await fixture.events.keyboard.type('Abhaya Libre');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        option = fixture.screen.getByText('Abhaya Libre');
        await fixture.events.click(option);
        await fixture.events.sleep(TIMEOUT);
        await openFontPicker();
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 3);

        await fixture.events.keyboard.type('Source Serif Pro');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        option = fixture.screen.getByText('Source Serif Pro');
        await fixture.events.click(option);
        await fixture.events.sleep(TIMEOUT);
        await openFontPicker();
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 4);

        await fixture.events.keyboard.type('Roboto');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        option = fixture.screen.getByText('Roboto');
        await fixture.events.click(option);
        await fixture.events.sleep(TIMEOUT);
        await openFontPicker();
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 5);

        await fixture.events.keyboard.type('Yrsa');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        option = fixture.screen.getByText('Yrsa');
        await fixture.events.click(option);
        await fixture.events.sleep(TIMEOUT);
        await openFontPicker();

        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');

        // Ensure there are only 5 extra options added.
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 5);
        // Ensure the first one is the last chosen.
        expect(options[0].textContent).toBe('Yrsa');
      });

      it('should display the selected recent font with a tick', async () => {
        const option = fixture.screen.getByText('Source Serif Pro');
        await fixture.events.click(option);
        await fixture.events.sleep(TIMEOUT);
        await openFontPicker();
        const selected = fixture.screen.getAllByRole('option', {
          name: 'Selected Source Serif Pro',
        });
        // One from the recent fonts and one from the general list.
        expect(selected.length).toBe(2);
      });

      it('should include recent fonts to search', async () => {
        await fixture.events.keyboard.type('Abe');
        await fixture.events.sleep(TIMEOUT);
        const option = fixture.screen.getByText('Abel');
        await fixture.events.click(option);
        await fixture.events.sleep(TIMEOUT);
        await openFontPicker();

        await fixture.events.keyboard.type('Abe');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li[role="option"]');

        // Twice for 'Abel', once for Abhaya Libre.
        expect(options.length).toBe(2);
      });
    });

    describe('using keyboard only', () => {
      it('should allow selecting a font with arrow keys and Enter', async () => {
        await fixture.events.keyboard.press('down');
        await fixture.events.keyboard.press('down');
        await fixture.events.keyboard.press('down');
        await fixture.events.keyboard.press('Enter');
        await openFontPicker();

        await fixture.events.keyboard.type('Ubuntu');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        const selected = fixture.screen.getAllByRole('option', {
          name: 'Selected Ubuntu',
        });
        // 1 selected + 1 recent font.
        expect(selected.length).toBe(2);
      });

      it('should close the font picker with Esc', async () => {
        const input = await fixture.screen.getByLabelText('Edit: Font family');
        expect(input.getAttribute('aria-expanded')).toBe('true');
        await fixture.events.keyboard.press('Esc');
        await waitForElementToBeRemoved(
          document.getElementById('editor-font-picker-list')
        );
      });
    });

    it('should replace non 400 font weights with 400 when font family is updated', async () => {
      await fixture.events.keyboard.type('Yrsa');
      // Ensure the debounced callback has taken effect.
      await fixture.events.sleep(TIMEOUT);
      const option = fixture.screen.getByText('Yrsa');
      await fixture.events.click(option);
      await fixture.events.sleep(TIMEOUT);

      const { fontWeight } = fixture.editor.inspector.designPanel.textStyle;
      expect(fontWeight.value).toBe('Regular');

      await fixture.events.click(fontWeight.select);
      await fixture.events.click(fontWeight.option('Bold'));
      expect(fontWeight.value).toBe('Bold');

      await openFontPicker();

      await fixture.events.keyboard.type('Roboto');
      // Ensure the debounced callback has taken effect.
      await fixture.events.sleep(TIMEOUT);
      const option2 = fixture.screen.getByText('Roboto');
      await fixture.events.click(option2);
      await fixture.events.sleep(TIMEOUT);

      expect(fontWeight.value).toBe('Regular');
    });
  });
});
