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

describe('CUJ: Creator Can Style Text', () => {
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

  describe('Action: Use font picker', () => {
    const TOTAL_FONTS = 6;
    // Timeout used for submitting / search update + 50ms (250 + 50).
    const TIMEOUT = 300;
    const openFontPicker = async () => {
      const input = await fixture.screen.getByLabelText('Edit: Font family');
      await fixture.events.click(input);
    };

    beforeEach(async () => {
      await openFontPicker();
    });

    it('it should render the font picker', async () => {
      await fixture.snapshot('font picker open');
    });

    it('it should apply the selected font', async () => {
      const option = fixture.screen.getByText('Yrsa');
      await fixture.events.click(option);
      await wait(TIMEOUT);
      await openFontPicker();
      const selected = fixture.screen.getAllByRole('option', {
        name: 'Selected Yrsa',
      });
      expect(selected.length).toBe(2);

      const {
        state: {
          currentPage: { elements },
        },
      } = await fixture.renderHook(() => useStory());
      expect(elements[1].font.family).toBe('Yrsa');
    });

    describe('when searching fonts', () => {
      it('should display the correct fonts when searching', async () => {
        await fixture.events.keyboard.type('Ab');
        // Ensure the debounced callback has taken effect.
        await wait(TIMEOUT);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(2);
        expect(options[0].textContent).toBe('Abel');
        expect(options[1].textContent).toBe('Abhaya Libre');

        await fixture.events.keyboard.type('el');
        // Ensure the debounced callback has taken effect.
        await wait(TIMEOUT);
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(1);
        expect(options[0].textContent).toBe('Abel');
      });

      it('should not search with less than 2 characters', async () => {
        await fixture.events.keyboard.type('A');
        // Ensure the debounced callback has taken effect.
        await wait(TIMEOUT);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(TOTAL_FONTS);
      });

      it('should restore default fonts list when emptying search', async () => {
        await fixture.events.keyboard.type('Ab');
        // Ensure the debounced callback has taken effect.
        await wait(TIMEOUT);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(2);

        await fixture.events.keyboard.press('Del');
        // Ensure the debounced callback has taken effect.
        await wait(TIMEOUT);
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        // Back to all options.
        expect(options.length).toBe(TOTAL_FONTS);
      });

      it('should show empty list in case of no results', async () => {
        await fixture.events.keyboard.type('No fonts here');
        // Ensure the debounced callback has taken effect.
        await wait(TIMEOUT);
        expect(fixture.screen.getByText('No matches found')).toBeDefined();
      });
    });

    describe('with recent fonts', () => {
      it('should not display any recent fonts by default', () => {
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(TOTAL_FONTS);
      });

      it('should add up to 5 recent fonts, displaying the most recent first', async () => {
        let option = fixture.screen.getByText('Space Mono');
        await fixture.events.click(option);
        await wait(TIMEOUT);
        await openFontPicker();

        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(TOTAL_FONTS + 1);
        expect(options[0].textContent).toBe('Space Mono');

        option = fixture.screen.getByText('Abel');
        await fixture.events.click(option);
        await wait(TIMEOUT);
        await openFontPicker();
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(TOTAL_FONTS + 2);

        option = fixture.screen.getByText('Abhaya Libre');
        await fixture.events.click(option);
        await wait(TIMEOUT);
        await openFontPicker();
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(TOTAL_FONTS + 3);

        option = fixture.screen.getByText('Source Serif Pro');
        await fixture.events.click(option);
        await wait(TIMEOUT);
        await openFontPicker();
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(TOTAL_FONTS + 4);

        option = fixture.screen.getByText('Roboto');
        await fixture.events.click(option);
        await wait(TIMEOUT);
        await openFontPicker();
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(TOTAL_FONTS + 5);

        option = fixture.screen.getByText('Yrsa');
        await fixture.events.click(option);
        await wait(TIMEOUT);
        await openFontPicker();

        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');

        // Ensure there are only 5 extra options added.
        expect(options.length).toBe(TOTAL_FONTS + 5);
        // Ensure the first one is the last chosen.
        expect(options[0].textContent).toBe('Yrsa');
      });

      it('should display the selected recent font with a tick', async () => {
        const option = fixture.screen.getByText('Abel');
        await fixture.events.click(option);
        await wait(TIMEOUT);
        await openFontPicker();
        const selected = fixture.screen.getAllByRole('option', {
          name: 'Selected Abel',
        });
        // One from the recent fonts and one from the general list.
        expect(selected.length).toBe(2);
      });

      it('should include recent fonts to search', async () => {
        const option = fixture.screen.getByText('Abel');
        await fixture.events.click(option);
        await wait(TIMEOUT);
        await openFontPicker();

        await fixture.events.keyboard.type('Ab');
        // Ensure the debounced callback has taken effect.
        await wait(TIMEOUT);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');

        // Twice for 'Abel', once for Abhaya Libre.
        expect(options.length).toBe(3);
      });
    });

    describe('using keyboard only', () => {
      it('should allow selecting a font with arrow keys and Enter', async () => {
        await fixture.events.keyboard.press('up');
        await fixture.events.keyboard.press('up');
        await fixture.events.keyboard.press('Enter');
        await openFontPicker();
        const selected = fixture.screen.getByRole('option', {
          name: 'Selected Abel',
        });
        expect(selected).toBeDefined();
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
  });
});

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
