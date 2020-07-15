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
  let frame;

  const addText = async (extraProps = null) => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    const element = await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'hello world!',
        x: 40,
        y: 40,
        width: 250,
        ...extraProps,
      })
    );
    frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await addText();
    // Select the added text by default.
    const { x, y, width, height } = frame.getBoundingClientRect();
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Action: Use font picker', () => {
    const openFontPicker = async () => {
      const input = fixture.screen.getByLabelText('Edit: Font family');
      await fixture.events.click(input);
    };

    beforeEach(async () => {
      await openFontPicker();
    });

    it('it should render the font picker', async () => {
      await fixture.snapshot();
    });

    // Disable reason: Not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('it should apply the selected font on the element', () => {});

    describe('when searching fonts', () => {
      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should search fonts if at least 2 characters added', () => {});

      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should restore default view with less than 2 characters', () => {});

      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should display the correct fonts when searching', () => {});

      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should show empty list in case of no results', () => {});

      // Disable reason: Not implemented yet
      // eslint-disable-next-line jasmine/no-disabled-tests
      xit('should clear search when clicking on `X`', () => {});
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
