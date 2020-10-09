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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { initHelpers } from './_utils';

describe('Styling single text field', () => {
  const data = {};

  const {
    getTextContent,
    addInitialText,
    setSelection,
    richTextHasFocus,
  } = initHelpers(data);

  beforeEach(async () => {
    data.fixture = new Fixture();
    await data.fixture.render();

    // Add a text box
    await addInitialText();
  });

  afterEach(() => {
    data.fixture.restore();
  });

  it('should have the correct initial text and no formatting', () => {
    expect(getTextContent()).toBe('Fill in some text');
  });

  describe('CUJ: Creator Can Style Text: Apply B, Apply U, Apply I, Set text color, Set kerning', () => {
    it('should apply inline formatting correctly for single-style text field', async () => {
      const {
        bold,
        italic,
        underline,
        fontWeight,
        letterSpacing,
        fontColor,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // Check all styles are default
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);
      expect(fontWeight.value).toBe('Regular');
      expect(letterSpacing.value).toBe('0%');
      expect(fontColor.hex.value).toBe('000000');

      // Toggle italic and underline
      await data.fixture.events.click(italic.button);
      await data.fixture.events.click(underline.button);

      // Set font weight (should also toggle bold, as "Black" is >700)
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Black'));

      // Set letter spacing
      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('50');
      await data.fixture.events.keyboard.press('Enter');
      // Press escape to leave input field (does not unselect element)
      await data.fixture.events.keyboard.press('Escape');

      // Set color using hex input
      await data.fixture.events.click(fontColor.hex, { clickCount: 3 });
      await data.fixture.events.keyboard.type('FF00FF');
      // Press escape to leave input field (does not unselect element)
      await data.fixture.events.keyboard.press('Escape');

      // Verify all styles, now expected to be updated
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);
      expect(fontWeight.value).toBe('Black');
      expect(letterSpacing.value).toBe('50%');
      expect(fontColor.hex.value).toBe('FF00FF');

      // Assume text content to match expectation
      const actual = getTextContent();
      const css = [
        'font-weight: 900',
        'font-style: italic',
        'text-decoration: underline',
        'color: #f0f',
        'letter-spacing: 0.5em',
      ].join('; ');
      const expected = `<span style="${css}">Fill in some text</span>`;
      expect(actual).toBe(expected);
    });

    it('should apply inline formatting correctly for multi-style text field', async () => {
      const {
        bold,
        italic,
        underline,
        fontWeight,
        letterSpacing,
        fontColor,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // First enter edit mode, select something, style it with all styles and exit edit mode
      await data.fixture.events.keyboard.press('Enter');
      await setSelection(5, 7);
      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('50');
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.keyboard.press('Escape');
      await data.fixture.events.click(fontColor.hex, { clickCount: 3 });
      await data.fixture.events.keyboard.type('FF00FF');
      await data.fixture.events.keyboard.press('Escape');
      await data.fixture.events.click(italic.button);
      await richTextHasFocus();
      await data.fixture.events.click(underline.button);
      await richTextHasFocus();
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Black'));
      await richTextHasFocus();
      await data.fixture.events.keyboard.press('Escape');

      // Check all styles reflect the proper mixed status of the text field
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);
      expect(fontWeight.value).toBe('(multiple)');
      expect(letterSpacing.value).toBe('');
      expect(letterSpacing.placeholder).toBe('multiple');
      expect(fontColor.output).toBe('Multiple');

      // Toggle all styles
      await data.fixture.events.click(italic.button);
      await data.fixture.events.click(underline.button);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Bold'));
      await data.fixture.events.click(fontColor.button);
      waitFor(() => fontColor.picker);
      await data.fixture.events.click(fontColor.picker.hexButton);
      await data.fixture.events.keyboard.type('00FF00');
      // Wait for debounce in color picker (100ms)
      await data.fixture.events.sleep(100);
      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('100');
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.keyboard.press('Escape');

      // Verify all styles, now expected to be updated
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);
      expect(fontWeight.value).toBe('Bold');
      expect(letterSpacing.value).toBe('100%');
      expect(fontColor.hex.value).toBe('00FF00');

      // Assume text content to match expectation
      const actual = getTextContent();
      const css = [
        'font-weight: 700',
        'font-style: italic',
        'text-decoration: underline',
        'color: #0f0',
        'letter-spacing: 1em',
      ].join('; ');
      const expected = `<span style="${css}">Fill in some text</span>`;
      expect(actual).toBe(expected);
    });
  });

  describe('CUJ: Creator Can Style Text: Apply B, Apply U, Apply I', () => {
    // Disable reason: This isn't implemented yet: Filed in #1977
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should apply inline formatting using shortcuts', async () => {
      const {
        bold,
        italic,
        underline,
      } = data.fixture.editor.inspector.designPanel.textStyle;

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

      // Assume text content to match expectation
      const actual = getTextContent();
      const firstCSS = [
        'font-weight: 700',
        'font-style: italic',
        'text-decoration: underline',
      ].join('; ');
      const expected = `<span style="${firstCSS}">Fill in some text</span>`;
      expect(actual).toBe(expected);
    });
  });

  describe('CUJ: Creator Can Style Text: Apply B, Select weight', () => {
    it('should make black+bold text field non-bold when toggling', async () => {
      const {
        bold,
        fontWeight,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // Edit and make some content black, rest of content bold
      await data.fixture.events.keyboard.press('Enter');
      await setSelection(0, 1);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Black'));
      await richTextHasFocus();
      await setSelection(1, 'Fill in some text'.length);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Bold'));
      await richTextHasFocus();
      await data.fixture.events.keyboard.press('Escape');

      // Check that bold toggle is on but font weight is "multiple"
      expect(bold.checked).toBe(true);
      expect(fontWeight.value).toBe('(multiple)');

      // Toggle it by pressing the bold button
      await data.fixture.events.click(bold.button);

      // Verify bold is now off and font weight is Regular
      expect(bold.checked).toBe(false);
      expect(fontWeight.value).toBe('Regular');

      // Assume text content to now be formatting-free
      const actual = getTextContent();
      const expected = `Fill in some text`;
      expect(actual).toBe(expected);
    });

    it('should make bold+regular text field bold when toggling', async () => {
      const {
        bold,
        fontWeight,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // Edit and make some content bold, rest of content unchanged
      await data.fixture.events.keyboard.press('Enter');
      await setSelection(0, 1);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Bold'));
      await richTextHasFocus();
      await data.fixture.events.keyboard.press('Escape');

      // Check that bold toggle is on but font weight is "multiple"
      expect(bold.checked).toBe(false);
      expect(fontWeight.value).toBe('(multiple)');

      // Toggle it by pressing the bold button
      await data.fixture.events.click(bold.button);

      // Verify bold is now off and font weight is Bold
      expect(bold.checked).toBe(true);
      expect(fontWeight.value).toBe('Bold');

      // Assume text content to now be correctly bold
      const actual = getTextContent();
      const expected = `<span style="font-weight: 700">Fill in some text</span>`;
      expect(actual).toBe(expected);
    });

    it('should make black+bold+regular text field bold when toggling', async () => {
      // Note that this works differently than multiple styles in an inline selection,
      // where a bolding anything including non-bolds *and* black would result in the
      // entire selection becoming black.
      // This is on purpose and by design.
      // See more in `richText/formatters/weight.js@toggleBold`

      const {
        bold,
        fontWeight,
      } = data.fixture.editor.inspector.designPanel.textStyle;

      // Edit and make some content black, some bold, rest unchanged
      await data.fixture.events.keyboard.press('Enter');
      await setSelection(0, 1);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Black'));
      await richTextHasFocus();
      await setSelection(1, 2);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.click(fontWeight.option('Bold'));
      await richTextHasFocus();
      await data.fixture.events.keyboard.press('Escape');

      // Check that bold toggle is off but font weight is "multiple"
      expect(bold.checked).toBe(false);
      expect(fontWeight.value).toBe('(multiple)');

      // Toggle it by pressing the bold button
      await data.fixture.events.click(bold.button);

      // Verify bold is now on and font weight is Bold
      expect(bold.checked).toBe(true);
      expect(fontWeight.value).toBe('Bold');

      // Assume text content to now be correctly bold
      const actual = getTextContent();
      const expected = `<span style="font-weight: 700">Fill in some text</span>`;
      expect(actual).toBe(expected);
    });
  });
});
