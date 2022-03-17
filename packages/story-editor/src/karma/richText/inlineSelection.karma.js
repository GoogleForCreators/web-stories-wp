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
import { Fixture } from '../fixture';
import { useStory } from '../../app';
import { MULTIPLE_DISPLAY_VALUE } from '../../constants';
import { initHelpers } from './_utils';

describe('CUJ: Creator can Add and Write Text: Select an individual word to edit', () => {
  const data = {};

  const {
    getTextContent,
    addInitialText,
    setSelection,
    richTextHasFocus,
    setFontSize,
  } = initHelpers(data);

  beforeEach(async () => {
    data.fixture = new Fixture();
    await data.fixture.render();
    await data.fixture.collapseHelpCenter();

    // Add a text box
    await addInitialText();
  });

  afterEach(() => {
    data.fixture.restore();
  });

  it('should have the correct initial text and no formatting', () => {
    expect(getTextContent()).toBe(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    );
  });

  describe('CUJ: Creator Can Style Text: Apply B, Apply U, Apply I, Set text color, Set kerning', () => {
    it('should apply inline formats correctly for both single style and multiple styles', async () => {
      let storyContext = await data.fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElements[0].content).toBe(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      );
      await data.fixture.events.click(data.fixture.editor.inspector.designTab);
      const {
        bold,
        italic,
        underline,
        fontWeight,
        letterSpacing,
        fontColor,
        uppercase,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // Enter edit-mode
      await data.fixture.events.focus(
        data.fixture.editor.canvas.framesLayer.frames[1].node
      );
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.screen.findByTestId('textEditor');

      await setFontSize('30');

      // Select character 7 and 8 (the part "ip" in "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
      await setSelection(6, 8);

      // Check all styles are default
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);
      expect(uppercase.checked).toBe(false);
      expect(fontWeight.value).toBe('Regular');
      expect(letterSpacing.value).toBe('0%');
      expect(fontColor.hex.value).toBe('000000');

      // Toggle italic and underline and uppercase - wait for autofocus to return
      await data.fixture.events.click(italic.button);
      await richTextHasFocus();
      await data.fixture.events.click(underline.button);
      await richTextHasFocus();
      await data.fixture.events.click(uppercase.button);
      await richTextHasFocus();
      // Set font weight (should also toggle bold, as "Black" is >700)
      // - wait for autofocus to return
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(await fontWeight.option('Black'));
      await data.fixture.events.sleep(300);
      await richTextHasFocus();

      // Set letter spacing
      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('50');
      await data.fixture.events.keyboard.press('Enter');
      // Press escape to leave input field (does not leave edit-mode)
      await data.fixture.events.keyboard.press('Escape');

      // Set color using 3 digit hex input
      await data.fixture.events.click(fontColor.hex, { clickCount: 3 });
      await data.fixture.events.keyboard.type('A1F');
      await data.fixture.events.keyboard.press('Tab');

      expect(fontColor.hex.value).toBe('AA11FF');

      // Set color using 6 digit hex input
      await data.fixture.events.click(fontColor.hex, { clickCount: 3 });
      await data.fixture.events.keyboard.type('FF6600');
      await data.fixture.events.keyboard.press('Tab');

      // Press escape to leave input field (does not leave edit-mode)
      await data.fixture.events.keyboard.press('Escape');

      // Verify all styles, now expected to be updated
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);
      expect(uppercase.checked).toBe(true);
      expect(fontWeight.value).toBe('Black');
      expect(letterSpacing.value).toBe('50%');
      expect(fontColor.hex.value).toBe('FF6600');

      // Move selection to characters 7-10 (partially overlapping new styles and no styles)
      await setSelection(7, 10);

      // Verify that the toggles are off (as to be expected with mixed styles)
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);
      expect(uppercase.checked).toBe(false);

      // Expect font weight, letter spacing and font color to be "multiple"
      expect(fontWeight.value).toBe(MULTIPLE_DISPLAY_VALUE);
      expect(letterSpacing.value).toBe('');
      expect(letterSpacing.placeholder).toBe(MULTIPLE_DISPLAY_VALUE);
      expect(fontColor.output).toBe('');

      // Now toggle all toggles, and set new color and letter spacing
      await data.fixture.events.click(italic.button);
      await data.fixture.events.click(underline.button);
      await data.fixture.events.click(bold.button);
      await data.fixture.events.click(uppercase.button);

      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('100');
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.keyboard.press('Escape');

      // We have to open the color picker, as there's no direct hex input when "multiple"
      await data.fixture.events.click(fontColor.button);
      await data.fixture.events.click(fontColor.picker.applySavedColor('#eee'));
      // Wait for debounce in color picker (100ms)
      await data.fixture.events.sleep(100);

      // Verify all styles again
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);
      // Note that entire selection is made black, because some part was black, when bold was pressed
      expect(fontWeight.value).toBe('Black');
      expect(letterSpacing.value).toBe('100%');
      expect(fontColor.hex.value).toBe('EEEEEE');

      // Exit edit-mode
      const safezone = data.fixture.querySelector('[data-testid="safezone"]');
      const rect = safezone.getBoundingClientRect();
      await data.fixture.events.mouse.click(rect.left + 10, rect.top + 10);
      await data.fixture.snapshot('With inline style applied');

      // Assume text content to match expectation
      storyContext = await data.fixture.renderHook(() => useStory());
      const actual = storyContext.state.selectedElements[0].content;
      const firstCSS = [
        'font-weight: 900',
        'font-style: italic',
        'text-decoration: underline',
        'color: #f60',
        'letter-spacing: 0.5em',
        'text-transform: uppercase',
      ].join('; ');
      const secondCSS = [
        'font-weight: 900',
        'font-style: italic',
        'text-decoration: underline',
        'color: #eee',
        'letter-spacing: 1em',
        'text-transform: uppercase',
      ].join('; ');
      const expected = `Lorem <span style="${firstCSS}">i</span><span style="${secondCSS}">p</span><span style="${secondCSS}">su</span>m dolor sit amet, consectetur adipiscing elit.`;
      expect(actual).toBe(expected);
    });
  });

  describe('CUJ: Creator Can Style Text: Apply B, Apply U, Apply I, Apply Uppercase', () => {
    it('should apply inline formats using shortcuts', async () => {
      await data.fixture.events.click(data.fixture.editor.inspector.designTab);
      const { bold, italic, underline } =
        data.fixture.editor.inspector.designPanel.textStyle;

      // Enter edit-mode
      await data.fixture.events.keyboard.press('Enter');

      // Select character 7 and 8 (the part "ip" in "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
      await setSelection(6, 8);

      // Check all styles are default
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);

      // Toggle italic, underline and bold using shortcut
      await data.fixture.events.keyboard.shortcut('mod+u');
      await data.fixture.events.keyboard.shortcut('mod+i');
      await data.fixture.events.keyboard.shortcut('mod+b');

      // Verify all styles, now expected to be updated
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      // Assume text content to match expectation
      const actual = getTextContent();
      const firstCSS = [
        'font-weight: 700',
        'font-style: italic',
        'text-decoration: underline',
      ].join('; ');
      const expected = `Lorem <span style="${firstCSS}">ip</span>sum dolor sit amet, consectetur adipiscing elit.`;
      expect(actual).toBe(expected);
    });

    it('should apply inline format for uppercase', async () => {
      await data.fixture.events.click(data.fixture.editor.inspector.designTab);
      const { uppercase } = data.fixture.editor.inspector.designPanel.textStyle;

      // Enter edit-mode
      await data.fixture.events.keyboard.press('Enter');

      // Select character 7 and 8 (the part "ip" in "Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
      await setSelection(6, 8);

      // Check style is default.
      expect(uppercase.checked).toBe(false);

      // Toggle uppercase
      await data.fixture.events.click(uppercase.button);

      // Verify the updated style.
      expect(uppercase.checked).toBe(true);

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      // Assume text content to match expectation
      const actual = getTextContent();
      const expected = `Lorem <span style="text-transform: uppercase">ip</span>sum dolor sit amet, consectetur adipiscing elit.`;
      expect(actual).toBe(expected);
    });
  });

  describe('CUJ: Creator Can Style Text: Apply B, Select weight', () => {
    describe('when there is a mix of font weights', () => {
      beforeEach(async () => {
        await data.fixture.events.click(
          data.fixture.editor.inspector.designTab
        );
        const { fontWeight } =
          data.fixture.editor.inspector.designPanel.textStyle;

        // Enter edit-mode
        await data.fixture.events.focus(
          data.fixture.editor.canvas.framesLayer.frames[1].node
        );
        await data.fixture.editor.canvas.waitFocusedWithin();
        await data.fixture.events.keyboard.press('Enter');

        const selectFontWeight = async (weight) => {
          await data.fixture.events.click(fontWeight.select);
          await data.fixture.events.sleep(300);
          await data.fixture.events.click(await fontWeight.option(weight));
          await data.fixture.events.sleep(300);
          await richTextHasFocus();
        };

        // Select first character and make it black (900)
        await setSelection(0, 1);
        await selectFontWeight('Black');

        // Select second character and make it bold (700)
        await setSelection(1, 2);
        await selectFontWeight('Bold');
      });

      it('should make black+bold selection non-bold when toggling', async () => {
        // Select first two characters (900 and 700)
        await setSelection(0, 2);

        const { bold, fontWeight } =
          data.fixture.editor.inspector.designPanel.textStyle;

        // Check that bold toggle is on but font weight is "multiple"
        expect(bold.checked).toBe(true);
        expect(fontWeight.value).toBe(MULTIPLE_DISPLAY_VALUE);

        // Toggle it by pressing the bold button
        await data.fixture.events.click(bold.button);

        // Verify bold is now off and font weight is Regular
        expect(bold.checked).toBe(false);
        expect(fontWeight.value).toBe('Regular');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Assume text content to now be formatting-free
        const actual = getTextContent();
        const expected = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
        expect(actual).toBe(expected);
      });

      it('should make bold+regular selection bold when toggling', async () => {
        const { bold, fontWeight } =
          data.fixture.editor.inspector.designPanel.textStyle;

        // Select second and third characters (700 and 400)
        await setSelection(1, 3);

        // Check that bold toggle is off but font weight is "multiple"
        expect(bold.checked).toBe(false);
        expect(fontWeight.value).toBe(MULTIPLE_DISPLAY_VALUE);

        // Toggle it by pressing the bold button
        await data.fixture.events.click(bold.button);

        // Verify bold is now on and font weight is Bold
        expect(bold.checked).toBe(true);
        expect(fontWeight.value).toBe('Bold');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Assume text content to be correctly formatted
        // NOTE: Sometimes returned HTML has two single-letter bold spans, sometimes they're joined into one:
        const actual = getTextContent();
        const expectedDouble = `<span style="font-weight: 900">L</span><span style="font-weight: 700">o</span><span style="font-weight: 700">r</span>em ipsum dolor sit amet, consectetur adipiscing elit.`;
        const expectedSingle = `<span style="font-weight: 900">L</span><span style="font-weight: 700">or</span>em ipsum dolor sit amet, consectetur adipiscing elit.`;
        expect(actual).toBeOneOf([expectedDouble, expectedSingle]);

        await data.fixture.snapshot(
          'First letter black, next two bold, rest regular'
        );
      });

      it('should make black+bold+regular selection black when toggling', async () => {
        const { bold, fontWeight } =
          data.fixture.editor.inspector.designPanel.textStyle;

        // Select first three characters (900, 700 and 400)
        await setSelection(0, 3);

        // Check that bold toggle is off but font weight is "multiple"
        expect(bold.checked).toBe(false);
        expect(fontWeight.value).toBe(MULTIPLE_DISPLAY_VALUE);

        // Toggle it by pressing the bold button
        await data.fixture.events.click(bold.button);

        // Verify bold is now on and font weight is Black
        expect(bold.checked).toBe(true);
        expect(fontWeight.value).toBe('Black');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // NOTE: Sometimes returned HTML has two black spans, sometimes they're joined into one:
        const actual = getTextContent();
        const expectedDouble = `<span style="font-weight: 900">Lo</span><span style="font-weight: 900">r</span>em ipsum dolor sit amet, consectetur adipiscing elit.`;
        const expectedSingle = `<span style="font-weight: 900">Lor</span>em ipsum dolor sit amet, consectetur adipiscing elit.`;
        expect(actual).toBeOneOf([expectedDouble, expectedSingle]);

        await data.fixture.snapshot('First three letters black, rest regular');
      });
    });
  });

  describe('CUJ: Creator Can Style Text: Apply B, Set line height', () => {
    it('should apply global formats (here line height) even when a selection is present', async () => {
      const getDisplayTextStyles = () => {
        const displayNode = data.fixture.editor.canvas.displayLayer.display(
          data.textId
        ).node;
        const paragraph = displayNode.querySelector('p');
        return window.getComputedStyle(paragraph);
      };

      await data.fixture.events.click(data.fixture.editor.inspector.designTab);
      const initialLineHeight = parseFloat(getDisplayTextStyles().lineHeight);

      const { lineHeight } =
        data.fixture.editor.inspector.designPanel.textStyle;

      // Enter edit-mode
      await data.fixture.events.keyboard.press('Enter');

      // Select something
      await setSelection(5, 7);

      // Change line height to 5
      await data.fixture.events.click(lineHeight, { clickCount: 3 });
      await data.fixture.events.keyboard.type('5');
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.keyboard.press('Escape');

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');
      await data.fixture.events.mouse.clickOn(
        data.fixture.editor.canvas.framesLayer.container,
        5,
        5
      );

      // Expect text content to be unchanged
      expect(getTextContent()).toBe(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      );

      // Expect line height to have changed
      const currentLineHeight = parseFloat(getDisplayTextStyles().lineHeight);
      expect(currentLineHeight).not.toBe(initialLineHeight);
    });
  });

  describe('when copy-pasting', () => {
    beforeEach(async () => {
      // Enter edit-mode
      await data.fixture.events.keyboard.press('Enter');

      // Select everything and make bold
      await setSelection(0, 17);
      await data.fixture.events.click(data.fixture.editor.inspector.designTab);
      const { bold } = data.fixture.editor.inspector.designPanel.textStyle;
      await data.fixture.events.click(bold.button);
    });

    it('should paste and match styles on collapsed selection', async () => {
      // Select nothing and paste
      await setSelection(12, 12);
      await data.fixture.events.clipboard.pastePlain(' extra');

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      // Expect text content to have style and content
      expect(getTextContent()).toBe(
        '<span style="font-weight: 700">Lorem ipsum &nbsp;extradolor</span> sit amet, consectetur adipiscing elit.'
      );

      await data.fixture.snapshot('Pasting between text');
    });

    it('should paste and match styles on non-empty selection', async () => {
      // Select "some" and paste
      await setSelection(8, 12);
      await data.fixture.events.clipboard.pastePlain('extra');

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      // Expect text content to have style and content
      expect(getTextContent()).toBe(
        '<span style="font-weight: 700">Lorem ipextradolor</span> sit amet, consectetur adipiscing elit.'
      );

      await data.fixture.snapshot('Pasting and replacing text');
    });
  });
});
