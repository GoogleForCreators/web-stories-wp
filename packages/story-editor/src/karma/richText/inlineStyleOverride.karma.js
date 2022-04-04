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
import { initHelpers } from './_utils';

describe('Inline style override', () => {
  const data = {};

  const { getTextContent, addInitialText, setSelection, richTextHasFocus } =
    initHelpers(data);

  beforeEach(async () => {
    data.fixture = new Fixture();
    await data.fixture.render();
    await data.fixture.collapseHelpCenter();

    // Add a text box
    await addInitialText();

    // Enter edit-mode
    await data.fixture.events.keyboard.press('Enter');
  });

  afterEach(() => {
    data.fixture.restore();
  });

  describe('when cursor is placed after second character', () => {
    beforeEach(async () => {
      // Place cursor at start and them move to after second character
      await setSelection(2, 2);
    });

    describe('CUJ: Creator Can Style Text: Apply Uppercase', () => {
      it('should have correct formatting when pressing uppercase toggle, then inserting text', async () => {
        // Verify that uppercase is untoggled in design panel
        await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
        const { uppercase } = data.fixture.editor.sidebar.designPanel.textStyle;
        expect(uppercase.checked).toBe(false);

        // Toggle uppercase by button
        await data.fixture.events.click(uppercase.button);

        // Verify that uppercase is now toggled on
        expect(uppercase.checked).toBe(true);

        // Type "foo"
        await data.fixture.events.keyboard.type('foo');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Expect correct result
        const actual = getTextContent();
        const expected =
          'Fi<span style="text-transform: uppercase">foo</span>ll in some text.';
        expect(actual).toBe(expected);

        await data.fixture.snapshot(
          '"Fifooll in some text." in mixed formatting'
        );
      });
    });

    describe('CUJ: Creator Can Style Text: Apply B', () => {
      it('should have correct formatting when pressing mod+b for bold, then inserting text', async () => {
        // Verify that bold is untoggled in design panel
        await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
        const { bold } = data.fixture.editor.sidebar.designPanel.textStyle;
        expect(bold.checked).toBe(false);

        // Toggle bold by keyboard command
        await data.fixture.events.keyboard.shortcut('mod+b');

        // Verify that bold is now toggled on
        expect(bold.checked).toBe(true);

        // Type "foo"
        await data.fixture.events.keyboard.type('foo');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Expect correct result
        const actual = getTextContent();
        const expected =
          'Fi<span style="font-weight: 700">foo</span>ll in some text.';
        expect(actual).toBe(expected);

        await data.fixture.snapshot(
          '"Fifooll in some text." in mixed formatting'
        );
      });

      it('should have correct formatting when pressing bold toggle, then inserting text', async () => {
        // Verify that bold is untoggled in design panel
        await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
        const { bold } = data.fixture.editor.sidebar.designPanel.textStyle;
        expect(bold.checked).toBe(false);

        // Toggle bold by button
        await data.fixture.events.click(bold.button);

        // Verify that bold is now toggled on
        expect(bold.checked).toBe(true);

        // Type "foo"
        await data.fixture.events.keyboard.type('foo');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Expect correct result
        const actual = getTextContent();
        const expected =
          'Fi<span style="font-weight: 700">foo</span>ll in some text.';
        expect(actual).toBe(expected);

        await data.fixture.snapshot(
          '"Fifooll in some text." in mixed formatting'
        );
      });
    });

    describe('CUJ: Creator Can Style Text: Apply U, Apply I', () => {
      it('should have correct formatting when pressing underline toggle, then mod+i, then inserting text', async () => {
        // Verify that italic and underline are untoggled in design panel
        await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
        const { italic, underline } =
          data.fixture.editor.sidebar.designPanel.textStyle;
        expect(italic.checked).toBe(false);
        expect(underline.checked).toBe(false);

        // Toggle underline by click, then italic by shortcut
        await data.fixture.events.click(underline.button);
        await data.fixture.events.keyboard.shortcut('mod+i');

        // Verify that italic and underline are now toggled on
        expect(italic.checked).toBe(true);
        expect(underline.checked).toBe(true);

        // Type "foo"
        await data.fixture.events.keyboard.type('foo');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Expect correct result
        const actual = getTextContent();
        const expected =
          'Fi<span style="font-style: italic; text-decoration: underline">foo</span>ll in some text.';
        expect(actual).toBe(expected);

        await data.fixture.snapshot(
          '"Fifooll in some text." in mixed formatting'
        );
      });

      /* eslint-disable-next-line jasmine/no-disabled-tests --
       * This doesn't work due to bug #1606:
       * https://github.com/googleforcreators/web-stories-wp/issues/1606
       **/
      xit('should have correct formatting when pressing mod+i, then underline toggle, then inserting text', async () => {
        // Verify that italic and underline are untoggled in design panel
        await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
        const { italic, underline } =
          data.fixture.editor.sidebar.designPanel.textStyle;
        expect(italic.checked).toBe(false);
        expect(underline.checked).toBe(false);

        // Toggle italic by shortcut and then underline by click
        await data.fixture.events.keyboard.shortcut('mod+i');
        await data.fixture.events.click(underline.button);

        // Verify that italic and underline are now toggled on
        expect(italic.checked).toBe(true);
        expect(underline.checked).toBe(true);

        // Type "foo"
        await data.fixture.events.keyboard.type('foo');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Expect correct result
        const actual = getTextContent();
        const expected =
          'Fi<span style="font-style: italic; text-decoration: underline">foo</span>ll in some text';
        expect(actual).toBe(expected);

        await data.fixture.snapshot(
          '"Fifooll in some text" in mixed formatting'
        );
      });
    });

    describe('CUJ: Creator Can Style Text: Select weight', () => {
      it('should have correct formatting when selecting font weight, then inserting text', async () => {
        // Verify that bold is untoggled in design panel
        await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
        const { fontWeight } =
          data.fixture.editor.sidebar.designPanel.textStyle;
        expect(fontWeight.value).toBe('Regular');

        // Open dropdown and select "Black"
        await data.fixture.events.click(fontWeight.select);
        await data.fixture.events.sleep(300);
        await data.fixture.events.click(await fontWeight.option('Black'));
        await data.fixture.events.sleep(300);

        // Wait for focus to return to text
        await richTextHasFocus();

        // Verify that bold is now toggled on
        expect(fontWeight.value).toBe('Black');

        // Type "foo"
        await data.fixture.events.keyboard.type('foo');

        // Exit edit-mode
        await data.fixture.events.keyboard.press('Escape');

        // Expect correct result
        const actual = getTextContent();
        const expected =
          'Fi<span style="font-weight: 900">foo</span>ll in some text.';
        expect(actual).toBe(expected);

        await data.fixture.snapshot(
          '"Fifooll in some text." in mixed formatting'
        );
      });
    });
  });

  describe('CUJ: Creator Can Style Text: Apply B, Apply I', () => {
    it('should have correct formatting when already italic, then inline removing italic and adding bold, then inserting text', async () => {
      // Toggle italic for entire selection
      await data.fixture.events.keyboard.shortcut('mod+i');

      // Place cursor at start and then move to after second character
      await setSelection(2, 2);

      await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
      const { italic, bold } =
        data.fixture.editor.sidebar.designPanel.textStyle;

      // Verify that italic is toggled, bold is not
      expect(italic.checked).toBe(true);
      expect(bold.checked).toBe(false);

      // (Un)toggle italic by button and then toggle bold by shortcut
      // (also here the reverse would not work due to #1606 mentioned above)
      await data.fixture.events.click(italic.button);
      await data.fixture.events.keyboard.shortcut('mod+b');

      // Verify that toggles are reversed
      expect(italic.checked).toBe(false);
      expect(bold.checked).toBe(true);

      // Type "foo"
      await data.fixture.events.keyboard.type('foo');

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      // Expect correct result
      const actual = getTextContent();
      const expected =
        '<span style="font-style: italic">Fi</span><span style="font-weight: 700">foo</span><span style="font-style: italic">ll in some text.</span>';
      expect(actual).toBe(expected);

      await data.fixture.snapshot(
        '"Fifooll in some text." in mixed formatting'
      );
    });
  });

  it('should have correct formatting deleting text with one formatting, ending up in different formatting', async () => {
    // Toggle bold for entire selection
    await data.fixture.events.keyboard.shortcut('mod+b');

    // Select 2nd character
    await setSelection(1, 2);

    // Make just this character italic
    await data.fixture.events.keyboard.shortcut('mod+i');

    await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
    const { italic, bold } = data.fixture.editor.sidebar.designPanel.textStyle;

    // Verify that both italic and bold are toggled
    expect(italic.checked).toBe(true);
    expect(bold.checked).toBe(true);

    // Delete the italic character
    await data.fixture.events.focus(
      data.fixture.editor.canvas.framesLayer.frames[1].node
    );
    await setSelection(1, 2);
    await data.fixture.events.keyboard.press('Delete');
    // Verify that bold is still on, italic is off
    expect(bold.checked).toBe(true);
    expect(italic.checked).toBe(false);

    // Type something
    await data.fixture.events.keyboard.type('u');

    // Exit edit-mode
    await data.fixture.events.keyboard.press('Escape');

    // Expect correct result
    const actual = getTextContent();
    const expected = '<span style="font-weight: 700">Full in some text.</span>';
    expect(actual).toBe(expected);
    await data.fixture.snapshot('"Full in some text." in bold');
  });

  it('should keep formatting when all text is replaced', async () => {
    // Make it all bold while selected
    await data.fixture.events.keyboard.shortcut('mod+b');

    // Replace text while entire text is selected
    await data.fixture.events.keyboard.type('A new text');

    // Exit edit-mode
    await data.fixture.events.keyboard.press('Escape');

    const actual = getTextContent();
    const expected = '<span style="font-weight: 700">A new text</span>';
    expect(actual).toBe(expected);

    await data.fixture.snapshot('"A new text" in bold');
  });

  describe('CUJ: Creator can Add and Write Text: Select all text inside a textbox, Write/edit text', () => {
    it('should keep formatting when all text is removed, then replaced', async () => {
      // Make it all bold while selected
      await data.fixture.events.keyboard.shortcut('mod+b');

      // Delete existing text by pressing backspace, then add new text
      await data.fixture.events.keyboard.shortcut('Backspace');
      await data.fixture.events.keyboard.type('Even more text');

      // Exit edit-mode
      await data.fixture.events.keyboard.press('Escape');

      const actual = getTextContent();
      const expected = '<span style="font-weight: 700">Even more text</span>';
      expect(actual).toBe(expected);

      await data.fixture.snapshot('"Even more text" in bold');
    });
  });
});
