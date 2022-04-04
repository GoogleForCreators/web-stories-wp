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
import { MULTIPLE_DISPLAY_VALUE } from '../../constants';
import { initHelpers } from './_utils';

describe('Styling multiple text fields', () => {
  const data = {};

  const {
    getTextContent,
    addInitialText,
    selectBothTextFields,
    selectTextField,
  } = initHelpers(data);

  beforeEach(async () => {
    data.fixture = new Fixture();
    await data.fixture.render();
    await data.fixture.collapseHelpCenter();

    // Add text box + extra
    await addInitialText(true);
  });

  afterEach(() => {
    data.fixture.restore();
  });

  it('should both have the correct initial text and formatting', () => {
    // Get content of first textfield
    expect(getTextContent(0)).toBe('Fill in some text.');
    // Get content of second textfield
    expect(getTextContent(1)).toBe('Number #2');
  });

  describe('CUJ: Creator Can Style Text: Apply B, Apply U, Apply I, Set text color, Set kerning', () => {
    // TODO #6955
    // When fixing this, ensure that uppercase is also handled here.
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should apply formatting correctly for identically styled text fields', async () => {
      await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
      const { bold, italic, underline, fontWeight, letterSpacing, fontColor } =
        data.fixture.editor.sidebar.designPanel.textStyle;

      // Select both text fields
      await selectBothTextFields();

      // Check all styles are default
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);
      expect(fontWeight.value).toBe('Regular');
      expect(letterSpacing.value).toBe('0%');
      expect(fontColor.hex.value).toBe('000000');

      // Toggle all styles
      await data.fixture.events.click(italic.button);
      await data.fixture.events.click(underline.button);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(await fontWeight.option('Black'));
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('50');
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.keyboard.press('Escape');
      await data.fixture.events.click(fontColor.hex, { clickCount: 3 });
      await data.fixture.events.keyboard.type('F54');
      await data.fixture.events.keyboard.press('Tab');
      await data.fixture.events.keyboard.press('Escape');

      // Verify all styles, now expected to be updated
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);
      expect(fontWeight.value).toBe('Black');
      expect(letterSpacing.value).toBe('50%');
      expect(fontColor.hex.value).toBe('FF5544');

      // Assume text contents to match expectation
      const css = [
        'font-weight: 900',
        'font-style: italic',
        'text-decoration: underline',
        'color: #f54',
        'letter-spacing: 0.5em',
      ].join('; ');
      const getExpected = (content) => `<span style="${css}">${content}</span>`;
      expect(getTextContent(0)).toBe(
        getExpected('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
      );
      expect(getTextContent(1)).toBe(getExpected('Number #2'));

      await data.fixture.snapshot(
        'Two texts in black,italic,underline,magenta,narrow'
      );
    });

    it('should apply formatting correctly for multi-style text field', async () => {
      await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
      const {
        bold,
        italic,
        underline,
        uppercase,
        fontWeight,
        letterSpacing,
        fontColor,
      } = data.fixture.editor.sidebar.designPanel.textStyle;

      // Edit formatting for second text field
      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('50');
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.keyboard.press('Escape');
      await data.fixture.events.click(fontColor.hex, { clickCount: 3 });
      await data.fixture.events.keyboard.type('FF00FF');
      await data.fixture.events.keyboard.press('Tab');
      await data.fixture.events.keyboard.press('Escape');
      await data.fixture.events.click(italic.button);
      await data.fixture.events.click(underline.button);
      await data.fixture.events.click(uppercase.button);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(await fontWeight.option('Black'));
      await data.fixture.events.sleep(300);

      // Select both text fields
      await selectBothTextFields();

      // Check all styles reflect the proper mixed status of the text field
      expect(bold.checked).toBe(false);
      expect(italic.checked).toBe(false);
      expect(underline.checked).toBe(false);
      expect(uppercase.checked).toBe(false);
      expect(fontWeight.value).toBe('Mixed');
      expect(letterSpacing.value).toBe('');
      expect(letterSpacing.placeholder).toBe(MULTIPLE_DISPLAY_VALUE);
      expect(fontColor.output).toBe('');

      // Toggle all styles
      await data.fixture.events.click(italic.button);
      await data.fixture.events.click(underline.button);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(await fontWeight.option('Bold'));
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(letterSpacing, { clickCount: 3 });
      await data.fixture.events.keyboard.type('100');
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.click(uppercase.button);
      await data.fixture.events.keyboard.press('Escape');
      await data.fixture.events.click(fontColor.button);
      await data.fixture.events.click(fontColor.picker.custom);
      await data.fixture.events.click(fontColor.picker.hexButton);
      await data.fixture.events.keyboard.type('00FF00');
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.keyboard.press('Escape');
      await data.fixture.events.sleep(100);
      await data.fixture.events.keyboard.press('Escape');
      // Wait for debounce in color picker (100ms)
      await data.fixture.events.sleep(100);
      await selectBothTextFields();

      // Verify all styles, now expected to be updated
      expect(bold.checked).toBe(true);
      expect(italic.checked).toBe(true);
      expect(underline.checked).toBe(true);
      expect(uppercase.checked).toBe(true);
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
        'text-transform: uppercase',
      ].join('; ');
      const expected = `<span style="${css}">Fill in some text.</span>`;
      expect(actual).toBe(expected);

      await data.fixture.snapshot('Two texts in bold,italic,underline,green');
    });
  });

  describe('CUJ: Creator Can Style Text: Apply B, Select weight', () => {
    it('should make black text field + bold text field non-bold when toggling', async () => {
      await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
      const { bold, fontWeight } =
        data.fixture.editor.sidebar.designPanel.textStyle;

      // Make text field 1 black
      await selectTextField(0);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(await fontWeight.option('Black'));
      await data.fixture.events.sleep(300);

      // Make text field 2 bold
      await selectTextField(1);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(await fontWeight.option('Bold'));
      await data.fixture.events.sleep(300);

      // Select both text fields
      await selectBothTextFields();

      // Check that bold toggle is on but font weight is "multiple"
      expect(bold.checked).toBe(true);
      expect(fontWeight.value).toBe(MULTIPLE_DISPLAY_VALUE);

      // Toggle it by pressing the bold button
      await data.fixture.events.click(bold.button);

      // Verify bold is now off and font weight is Regular
      expect(bold.checked).toBe(false);
      expect(fontWeight.value).toBe('Regular');

      // Assume both texts' content to now be formatting-free
      expect(getTextContent(0)).toBe('Fill in some text.');
      expect(getTextContent(1)).toBe('Number #2');

      await data.fixture.snapshot('Two texts without formatting');
    });

    it('should make bold text field + light text field bold when toggling', async () => {
      await data.fixture.events.click(data.fixture.editor.sidebar.designTab);
      const { bold, fontWeight } =
        data.fixture.editor.sidebar.designPanel.textStyle;

      // Make text field 1 black
      await selectTextField(0);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(await fontWeight.option('Black'));
      await data.fixture.events.sleep(300);

      // Make text field 2 light
      await selectTextField(1);
      await data.fixture.events.click(fontWeight.select);
      await data.fixture.events.sleep(300);
      await data.fixture.events.click(await fontWeight.option('Light'));
      await data.fixture.events.sleep(300);

      // Select both text fields
      await selectBothTextFields();

      // Check that bold toggle is off but font weight is "multiple"
      expect(bold.checked).toBe(false);
      expect(fontWeight.value).toBe(MULTIPLE_DISPLAY_VALUE);

      // Toggle it by pressing the bold button
      await data.fixture.events.click(bold.button);

      // Verify bold is now on and font weight is Bold
      expect(bold.checked).toBe(true);
      expect(fontWeight.value).toBe('Bold');

      // Assume texts' content to now be correctly bold
      expect(getTextContent(0)).toBe(
        '<span style="font-weight: 700">Fill in some text.</span>'
      );
      expect(getTextContent(1)).toBe(
        '<span style="font-weight: 700">Number #2</span>'
      );

      await data.fixture.snapshot('Two texts in bold');
    });
  });
});
