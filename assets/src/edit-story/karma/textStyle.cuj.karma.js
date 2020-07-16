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
import useInsertElement from '../components/canvas/useInsertElement';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../app/font/defaultFonts';
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
    const TOTAL_FONTS = 3;
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

    // Disable reason: @todo
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('it should apply the selected font on the element', async () => {
      const option = fixture.screen.getByText('Abel');
      await fixture.events.click(option);
    });

    describe('when searching fonts', () => {
      it('should display the correct fonts when searching', async () => {
        await fixture.events.keyboard.type('Ab');
        // Ensure the debounced callback has taken effect.
        await wait(300);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(2);
        expect(options[0].textContent).toBe('Abel');
        expect(options[1].textContent).toBe('Abhaya Libre');

        await fixture.events.keyboard.type('el');
        // Ensure the debounced callback has taken effect.
        await wait(300);
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(1);
        expect(options[0].textContent).toBe('Abel');
      });

      it('should not search with less than 2 characters', async () => {
        await fixture.events.keyboard.type('A');
        // Ensure the debounced callback has taken effect.
        await wait(300);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(TOTAL_FONTS);
      });

      it('should restore default fonts list when emptying search', async () => {
        await fixture.events.keyboard.type('Ab');
        // Ensure the debounced callback has taken effect.
        await wait(300);
        let options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        expect(options.length).toBe(2);

        await fixture.events.keyboard.press('Del');
        // Ensure the debounced callback has taken effect.
        await wait(300);
        options = document
          .getElementById('editor-font-picker-list')
          .querySelectorAll('li');
        // Back to all options.
        expect(options.length).toBe(TOTAL_FONTS);
      });

      it('should show empty list in case of no results', async () => {
        await fixture.events.keyboard.type('No fonts here');
        // Ensure the debounced callback has taken effect.
        await wait(300);
        expect(fixture.screen.getByText('No matches found')).toBeDefined();
      });
    });

    describe('with recent fonts', () => {
      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should not display any recent fonts by default', () => {});

      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should add up to 5 recent fonts, displaying the most recent first', () => {});

      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should display the selected recent font with a tick', () => {});

      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should include recent fonts to search', () => {});
    });

    describe('using keyboard only', () => {
      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should allow selecting a font with arrow keys and Enter', () => {});

      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should close the font picker with Esc', () => {});
    });
  });
});

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
