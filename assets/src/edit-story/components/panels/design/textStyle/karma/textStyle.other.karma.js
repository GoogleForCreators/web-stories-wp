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
import useInsertElement from '../../../../../components/canvas/useInsertElement';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../../app/font/defaultFonts';
import { useStory } from '../../../../../app/story';
import { Fixture } from '../../../../../karma/fixture';

describe('Text Style Panel', () => {
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
    localStorage.clear();
    await fixture.render();
    await addText();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Panel state', () => {
    it('should have the style panel always expanded', async () => {
      await fixture.snapshot('Default panels state with only style panel open');
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStyle.collapse
      );
      // Expect the inputs not to be visible since tha panel is collapsed.
      expect(
        () => fixture.editor.inspector.designPanel.textStyle.lineHeight
      ).toThrow();
      await fixture.snapshot('Collapsed style panel');

      // Add a new text now.
      await fixture.events.click(fixture.editor.library.textAdd);
      // Expect the inputs to be visible again, since the panel should be expanded again.
      expect(
        fixture.editor.inspector.designPanel.textStyle.lineHeight
      ).toBeDefined();
    });
  });

  describe('Font controls', () => {
    it('should allow whole number font sizes', async () => {
      const { fontSize } = fixture.editor.inspector.designPanel.textStyle;

      const size = 42;

      await fixture.events.focus(fontSize);
      await fixture.events.keyboard.type(`${size}`);
      await fixture.events.keyboard.press('tab');

      const {
        state: {
          currentPage: { elements },
        },
      } = await fixture.renderHook(() => useStory());
      expect(elements[1].fontSize).toBe(size);
    });

    it('should allow fractional font sizes', async () => {
      const { fontSize } = fixture.editor.inspector.designPanel.textStyle;

      const size = 15.25;

      await fixture.events.focus(fontSize);
      await fixture.events.keyboard.type(`${size}`);
      await fixture.events.keyboard.press('tab');

      const {
        state: {
          currentPage: { elements },
        },
      } = await fixture.renderHook(() => useStory());
      expect(elements[1].fontSize).toBe(size);
    });
  });

  describe('Font picker', () => {
    const getOptions = () => {
      return fixture.screen
        .getByRole('listbox', {
          name: /Option List Selector/,
        })
        .querySelectorAll('li[role="option"]');
    };

    describe('CUJ: Creator Can Style Text: Use font picker', () => {
      // There are 3 curated fonts included by default even though the total is more.
      const DEFAULT_VISIBLE_FONTS = 3;
      // Timeout used for submitting / search update + 50ms (250 + 50).
      const TIMEOUT = 300;
      const openFontPicker = async () => {
        const input = await fixture.screen.getByLabelText('Font family');
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

      it('should reset font weight when font family is updated', async () => {
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
        await fixture.events.sleep(TIMEOUT);
        expect(fontWeight.value).toBe('Bold');

        await openFontPicker();

        await fixture.events.keyboard.type('Roboto');
        // Ensure the debounced callback has taken effect.
        await fixture.events.sleep(TIMEOUT);
        const option2 = fixture.screen.getByText('Roboto');
        await fixture.events.click(option2);
        await fixture.events.sleep(600);
        const updatedFontWeight =
          fixture.editor.inspector.designPanel.textStyle.fontWeight;

        expect(updatedFontWeight.value).toBe('Regular');
      });

      it('should display only the fonts from curated list by default', () => {
        const options = getOptions();
        expect(options.length).toBe(DEFAULT_VISIBLE_FONTS);
      });

      describe('when searching fonts', () => {
        it('should display the correct fonts when searching', async () => {
          await fixture.events.keyboard.type('Ab');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          let options = getOptions();
          expect(options.length).toBe(2);
          expect(options[0].textContent).toBe('Abel');
          expect(options[1].textContent).toBe('Abhaya Libre');

          // Adding "el" to the search now only finds "Abel"
          await fixture.events.keyboard.type('el');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          options = getOptions();
          expect(options.length).toBe(1);
        });

        it('should not search with less than 2 characters', async () => {
          await fixture.events.keyboard.type('A');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          const options = getOptions();
          expect(options.length).toBe(DEFAULT_VISIBLE_FONTS);
        });

        it('should restore default fonts list when emptying search', async () => {
          await fixture.events.keyboard.type('Ab');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          const options = getOptions();
          expect(options.length).toBe(2);

          await fixture.events.keyboard.press('Backspace');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          const defaultOptions = getOptions();
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
          const options = getOptions();
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

          let options = getOptions();
          expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 1);
          expect(options[0].textContent).toBe('Space Mono');

          await fixture.events.keyboard.type('Abel');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Abel');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();
          options = getOptions();
          expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 2);

          await fixture.events.keyboard.type('Abhaya Libre');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Abhaya Libre');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();
          options = getOptions();
          expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 3);

          await fixture.events.keyboard.type('Source Serif Pro');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Source Serif Pro');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();
          options = getOptions();
          expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 4);

          await fixture.events.keyboard.type('Roboto');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Roboto');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();
          options = getOptions();
          expect(options.length).toBe(DEFAULT_VISIBLE_FONTS + 5);

          await fixture.events.keyboard.type('Yrsa');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Yrsa');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();

          options = getOptions();

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

        it('should not include recent fonts to search', async () => {
          await fixture.events.keyboard.type('Abe');
          await fixture.events.sleep(TIMEOUT);
          const option = fixture.screen.getByText('Abel');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();

          await fixture.events.keyboard.type('Abe');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          const options = getOptions();

          // Only showing up once for 'Abel'
          expect(options.length).toBe(1);
        });
      });

      describe('using keyboard only', () => {
        it('should allow selecting a font with arrow keys and Enter', async () => {
          // Select the third item in the already opened fontpicker,
          // which happens to be Ubuntu
          await fixture.events.keyboard.press('down');
          await fixture.events.keyboard.press('down');
          await fixture.events.keyboard.press('down');
          await fixture.events.keyboard.press('Enter');
          await fixture.events.sleep(TIMEOUT);

          // Then open again and verify, that Ubuntu is listed as selected
          await openFontPicker();
          await fixture.events.keyboard.type('ubuntu');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          // Only 1 selected (no recent fonts displayed when searching)
          const selected = fixture.screen.getByRole('option', {
            name: /selected ubuntu/i,
          });
          expect(selected).toBeTruthy();
        });

        it('should close the font picker with Esc', async () => {
          const input = await fixture.screen.getByLabelText('Font family');
          expect(input.getAttribute('aria-expanded')).toBe('true');
          await fixture.events.keyboard.press('Esc');
          await waitForElementToBeRemoved(
            fixture.screen.getByRole('listbox', {
              name: /Option List Selector/,
            })
          );
        });
      });
    });
  });
});
