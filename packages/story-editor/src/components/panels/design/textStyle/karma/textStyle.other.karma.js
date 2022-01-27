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
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../../app/story';
import { Fixture } from '../../../../../karma/fixture';

describe('Text Style Panel', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    localStorage.clear();
    fixture.setFlags({ customFonts: true });
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Panel state', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
    });

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
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[2].node);
      // Expect the inputs to be visible again, since the panel should be expanded again.
      expect(
        fixture.editor.inspector.designPanel.textStyle.lineHeight
      ).toBeDefined();
    });
  });

  describe('Adaptive text color', () => {
    it('should not allow triggering adaptive text color for multi-selection', async () => {
      // Add 2 text elements.
      await fixture.editor.library.textTab.click();
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
      await fixture.events.click(fixture.editor.library.text.preset('Title 2'));

      // Select first text as well (the second is selected by default).
      await fixture.events.keyboard.down('Shift');
      await fixture.events.click(
        fixture.editor.canvas.framesLayer.frames[1].node
      );
      await fixture.events.keyboard.up('Shift');

      expect(
        fixture.editor.inspector.designPanel.textStyle.adaptiveColor.disabled
      ).toBeTrue();
    });

    it('should change the text color to white on black background', async () => {
      // Assign black color.
      const safezone = fixture.querySelector('[data-testid="safezone"]');
      await fixture.events.click(safezone);
      const hexInput =
        fixture.editor.inspector.designPanel.pageBackground.backgroundColor.hex;
      await fixture.events.click(hexInput);
      // Select all the text
      hexInput.select();
      // Then type hex combo
      await fixture.events.keyboard.type('000');
      await fixture.events.keyboard.press('Tab');

      // Add text element.
      await fixture.events.click(fixture.editor.library.textAdd);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStyle.adaptiveColor
      );

      await waitFor(
        async () => {
          const texts = await fixture.screen.getAllByText('Fill in some text');
          expect(texts).toBeDefined();

          const whiteTexts = texts.filter((text) =>
            text.outerHTML.includes('color: #fff')
          );
          expect(whiteTexts).toBeDefined();

          const html = whiteTexts[0].outerHTML;
          expect(html).toBeDefined();

          expect(html).toContain('color: #fff');
          const {
            state: {
              currentPage: { elements },
            },
          } = await fixture.renderHook(() => useStory());
          expect(elements[1].content).toBe(
            '<span style="color: #fff">Fill in some text</span>'
          );
        },
        {
          timeout: 9000,
        }
      );
    });
  });

  describe('Line-height & Padding', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
    });

    it('should display padding and line-height correctly', async () => {
      const { padding, lineHeight } =
        fixture.editor.inspector.designPanel.textStyle;
      await fixture.events.focus(padding);
      await fixture.events.keyboard.type('10');

      await fixture.events.focus(lineHeight);
      await fixture.events.keyboard.type('4');
      await fixture.events.keyboard.press('tab');

      const texts = await waitFor(() =>
        fixture.screen.getAllByText('Fill in some text')
      );

      // Display layer.
      const displayStyle = await waitFor(() =>
        window.getComputedStyle(texts[0])
      );
      // This verifies it includes correct units.
      const splits = displayStyle.margin.split('px');
      // Verify the top-bottom margin is negative.
      expect(parseInt(splits[0].trim())).toBeLessThanOrEqual(0);
      // Verify the left-right margin is 0.
      expect(splits[1].trim() || '0').toBe('0');
      // Verify units are correctly added to padding.
      expect(displayStyle.padding).toContain('px');

      // Verify the same things for the frames layer.
      const frameStyle = await waitFor(() => window.getComputedStyle(texts[1]));
      const frameSplits = frameStyle.margin.split('px');
      expect(parseInt(frameSplits[0].trim())).toBeLessThanOrEqual(0);
      expect(frameSplits[1].trim() || '0').toBe('0');
      expect(frameStyle.padding).toContain('px');

      await fixture.snapshot('Applied padding and line-height');
    });
  });

  describe('Font controls', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
    });

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
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
    });
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
      const DEFAULT_CUSTOM_FONTS = 2;
      // Timeout used for submitting / search update + 250ms (250 + 250).
      const TIMEOUT = 500;
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

        await fixture.events.sleep(TIMEOUT);
        await fixture.events.click(await fontWeight.option('Bold'));
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

      it('should display the fonts from curated list and custom fonts by default', () => {
        const options = getOptions();
        expect(options.length).toBe(
          DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS
        );
      });

      it('should display custom fonts as the first', () => {
        const options = getOptions();
        expect(options[0].textContent).toBe('Overpass Regular');
        expect(options[1].textContent).toBe('Vazir Regular');
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

        it('should include custom fonts in search', async () => {
          await fixture.events.keyboard.type('Vazir');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          const options = getOptions();
          expect(options.length).toBe(1);
          expect(options[0].textContent).toBe('Vazir Regular');
        });

        it('should not search with less than 2 characters', async () => {
          await fixture.events.keyboard.type('A');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          const options = getOptions();
          expect(options.length).toBe(
            DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS
          );
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
          expect(defaultOptions.length).toBe(
            DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS
          );
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
          expect(options.length).toBe(
            DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS
          );
        });

        it('should add up to 5 recent fonts, displaying the most recent after the custom fonts', async () => {
          await fixture.events.keyboard.type('Space Mono');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          let option = fixture.screen.getByText('Space Mono');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();

          let options = getOptions();
          await waitFor(() => {
            expect(options.length).toBe(
              DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS + 1
            );
            expect(options[DEFAULT_CUSTOM_FONTS].textContent).toBe(
              'Space Mono'
            );
          });

          await fixture.events.keyboard.type('Abel');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Abel');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();
          options = getOptions();
          await waitFor(() => {
            expect(options.length).toBe(
              DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS + 2
            );
          });

          await fixture.events.keyboard.type('Abhaya Libre');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Abhaya Libre');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();
          options = getOptions();
          await waitFor(() => {
            expect(options.length).toBe(
              DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS + 3
            );
          });

          await fixture.events.keyboard.type('Source Serif Pro');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Source Serif Pro');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();
          options = getOptions();
          await waitFor(() => {
            expect(options.length).toBe(
              DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS + 4
            );
          });

          await fixture.events.keyboard.type('Roboto');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Roboto');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();
          options = getOptions();
          await waitFor(() => {
            expect(options.length).toBe(
              DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS + 5
            );
          });

          await fixture.events.keyboard.type('Yrsa');
          // Ensure the debounced callback has taken effect.
          await fixture.events.sleep(TIMEOUT);
          option = fixture.screen.getByText('Yrsa');
          await fixture.events.click(option);
          await fixture.events.sleep(TIMEOUT);
          await openFontPicker();

          options = getOptions();

          // Ensure there are only 5 extra options added.
          await waitFor(() => {
            expect(options.length).toBe(
              DEFAULT_VISIBLE_FONTS + DEFAULT_CUSTOM_FONTS + 5
            );
            // Ensure the first one is the last chosen.
            expect(options[DEFAULT_CUSTOM_FONTS].textContent).toBe('Yrsa');
          });
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
          // Select the fifth item in the already opened fontpicker,
          // which happens to be Ubuntu
          await fixture.events.keyboard.press('down');
          await fixture.events.keyboard.press('down');
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
