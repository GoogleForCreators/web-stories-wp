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
import { Fixture } from '../../../../karma';

describe('Link Panel', () => {
  let fixture;
  let linkPanel;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator Can Add A Link: Apply a link to any element', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      linkPanel = fixture.editor.inspector.designPanel.link;
    });

    it('should correctly show focus border both when using keyboard and mouse', async () => {
      // Click input
      await fixture.events.click(linkPanel.address);

      // Verify input has focus
      expect(linkPanel.address).toHaveFocus();

      // Screenshot it
      await fixture.snapshot('Link input has focus from mouse');

      // shift-tab, then tab to re-focus
      await fixture.events.keyboard.shortcut('shift+tab');
      await fixture.events.keyboard.press('tab');

      // Verify input still has focus
      expect(linkPanel.address).toHaveFocus();

      // Screenshot it
      await fixture.snapshot('Link input has focus from keyboard');
    });

    it('should add protocol automatically on blurring', async () => {
      await fixture.events.click(linkPanel.address);
      await fixture.events.keyboard.type('example.com');

      await linkPanel.address.dispatchEvent(new window.Event('blur'));
      expect(linkPanel.address.value).toBe('http://example.com');
    });

    it('should not add additional protocol if already present', async () => {
      await fixture.events.click(linkPanel.address);
      await fixture.events.keyboard.type('https://example.com');

      await linkPanel.address.dispatchEvent(new window.Event('blur'));
      expect(linkPanel.address.value).toBe('https://example.com');
    });

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should invoke API when looking up link');

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should display error when API errors');

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should display link details when API succeeds');

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should be able to apply a link to a text element');

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should be able to apply a link to a shape element');

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should be able to apply a link to a image element');

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should be able to apply a link to a video element');

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should not be able to apply a link to a background shape element');

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should not be able to apply a link to a background media element');
  });

  describe('CUJ: Creator Can Add A Link: Remove applied link', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      linkPanel = fixture.editor.inspector.designPanel.link;
      await fixture.events.click(linkPanel.address);
      await fixture.events.keyboard.type('http://google.com');
    });

    it('should return focus to input after clearing', async () => {
      // Verify remove button exists
      expect(linkPanel.addressClear).toBeTruthy();

      // Force focus to input - has to move out and back for weird reasons
      linkPanel.address.focus();
      linkPanel.addressClear.focus();

      // Click on remove button
      await fixture.events.click(linkPanel.addressClear);

      // Verify remove button doesn't exist
      expect(linkPanel.addressClear).not.toBeTruthy();

      // And verify that focus has been returned to input
      expect(linkPanel.address).toHaveFocus();
    });

    it('should show focus border on remove button when using keyboard', async () => {
      // Verify remove button exists
      expect(linkPanel.addressClear).toBeTruthy();

      // Force focus to input - has to move out and back for weird reasons
      linkPanel.address.focus();
      linkPanel.addressClear.focus();

      // "Tab" to move focus to remove button
      await fixture.events.keyboard.shortcut('tab');

      // Verify remove button has focus
      expect(linkPanel.addressClear).toHaveFocus();

      // Click the button by pressing enter
      await fixture.events.keyboard.press('Enter');

      // Verify remove button doesn't exist
      expect(linkPanel.addressClear).not.toBeTruthy();

      // And verify that focus has been returned to input
      expect(linkPanel.address).toHaveFocus();

      // Screenshot it
      await fixture.snapshot('Link remove button has focus from keyboard');
    });

    // Disable reason: tests not implemented yet
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should be able to removed an applied a link');
  });

  // Disable reason: tests not implemented yet
  // eslint-disable-next-line jasmine/no-disabled-tests
  xdescribe('CUJ: Creator Can Add A Link: Edit brand icon', () => {
    it('should be able to edit brand icon');

    it('should be able to remove brand icon');
  });

  // Disable reason: tests not implemented yet
  // eslint-disable-next-line jasmine/no-disabled-tests
  xdescribe('CUJ: Creator Can Add A Link: Edit description', () => {
    it('should be able to edit descrption');
  });
});
