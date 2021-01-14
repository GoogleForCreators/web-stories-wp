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
import { Fixture } from '../../../../../karma';
import useInsertElement from '../../../../canvas/useInsertElement';
import createSolidFromString from '../../../../../utils/createSolidFromString';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../../app/font/defaultFonts';

describe('Link Panel', () => {
  let fixture;
  let linkPanel;
  let safezone;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  const moveElementToBottom = async (frame) => {
    const safezoneHeight = safezone.getBoundingClientRect().height;
    const frameHeight = frame.getBoundingClientRect().height;
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame, 10, 10),
      down(),
      moveBy(0, safezoneHeight - frameHeight, { steps: 10 }),
      up(),
    ]);
  };

  const setPageAttachmentLink = async (link) => {
    const input = fixture.screen.getByLabelText('Page Attachment link');
    await fixture.events.click(input, { clickCount: 3 });
    await fixture.events.keyboard.type(link);
    await input.dispatchEvent(new window.Event('blur'));
  };

  async function clickOnTarget(target, key = false) {
    const { x, y, width, height } = target.getBoundingClientRect();
    if (key) {
      await fixture.events.keyboard.down(key);
    }
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
    if (key) {
      await fixture.events.keyboard.up(key);
    }
  }

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

    it('should display the link tooltip correctly', async () => {
      const linkDescription = 'Example description';
      await fixture.events.click(linkPanel.address);
      await fixture.events.keyboard.type('example.com');

      // Debounce time for populating meta-data.
      await fixture.events.keyboard.press('tab');
      await fixture.events.sleep(1200);
      await fixture.events.click(linkPanel.description, { clickCount: 3 });
      await fixture.events.keyboard.type(linkDescription);

      // Unselect element.
      const fullbleed = fixture.container.querySelector(
        '[data-testid="fullbleed"]'
      );
      const { left, top } = fullbleed.getBoundingClientRect();
      await fixture.events.mouse.click(left - 5, top - 5);

      // Move mouse to hover over the element.
      const frame = fixture.editor.canvas.framesLayer.frames[1].node;
      await fixture.events.mouse.moveRel(frame, 10, 10);

      expect(fixture.screen.getByText(linkDescription)).toBeTruthy();
      await fixture.snapshot(
        'Element is hovered on. The link tooltip is visible'
      );

      // Select the element again.
      await fixture.events.click(frame);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.link.address,
        { clickCount: 3 }
      );
      await fixture.events.keyboard.press('del');

      // Verify that the description is not displayed when hovering without url.
      await fixture.events.mouse.click(left - 5, top - 5);
      await fixture.events.mouse.moveRel(frame, 10, 10);
      const removedDescription = fixture.screen.queryByText(linkDescription);
      expect(removedDescription).toBeNull();
      await fixture.snapshot(
        'Element is hovered on. The link tooltip is not visible'
      );
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

  describe('CUJ: Creator Can Add A Link: Link with Page Attachment', () => {
    beforeEach(async () => {
      // Select Page.
      safezone = fixture.querySelector('[data-testid="safezone"]');
      await clickOnTarget(safezone);

      // Add Page Attachment
      await setPageAttachmentLink('http://pageattachment.com');
    });

    it('should not allow adding link in Page Attachment area', async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const element = await fixture.act(() =>
        insertElement('shape', {
          backgroundColor: createSolidFromString('#ff00ff'),
          mask: { type: 'rectangle' },
          x: 10,
          y: 10,
          width: 50,
          height: 50,
        })
      );
      const frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
      await moveElementToBottom(frame);

      linkPanel = fixture.editor.inspector.designPanel.link;
      await fixture.events.click(linkPanel.address);

      await fixture.snapshot('Page Attachment warning & dashed line visible');

      const warning = fixture.screen.getByText(
        'Link can not reside below the dashed line when a page attachment is present'
      );
      expect(warning).toBeDefined();
    });

    it('should not allow adding link to multi-selection in Page Attachment area', async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const element1 = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Hello World!',
          x: 40,
          y: 100,
          width: 250,
        })
      );
      const frame = fixture.editor.canvas.framesLayer.frame(element1.id).node;
      await fixture.act(() =>
        insertElement('shape', {
          backgroundColor: createSolidFromString('#ff00ff'),
          mask: { type: 'rectangle' },
          x: 40,
          y: 0,
          width: 50,
          height: 50,
        })
      );
      // Select the first element as well.
      await clickOnTarget(frame, 'Shift');

      await moveElementToBottom(frame);

      linkPanel = fixture.editor.inspector.designPanel.link;
      await fixture.events.click(linkPanel.address);

      await fixture.snapshot(
        'Warning & dashed line visible with multi-selection'
      );

      const warning = fixture.screen.getByText(
        'Link can not reside below the dashed line when a page attachment is present'
      );
      expect(warning).toBeDefined();
    });
  });

  describe('CUJ: Creator Can Add A Link: Apply a link to multi-selection', () => {
    let frame1;
    let frame2;

    beforeEach(async () => {
      safezone = fixture.querySelector('[data-testid="safezone"]');
      // Add two elements.
      const insertElement = await fixture.renderHook(() => useInsertElement());
      // First one with link.
      const element1 = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Hello World!',
          x: 40,
          y: 0,
          width: 250,
          link: {
            url: 'https://example.com',
          },
        })
      );
      frame1 = fixture.editor.canvas.framesLayer.frame(element1.id).node;
      const element2 = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Hello again!',
          x: 40,
          y: 100,
          width: 250,
        })
      );
      frame2 = fixture.editor.canvas.framesLayer.frame(element2.id).node;

      // Select both elements.
      await clickOnTarget(frame1, 'Shift');
    });

    it('should allow changing link for two elements at the same time', async () => {
      linkPanel = fixture.editor.inspector.designPanel.link;
      await fixture.events.click(linkPanel.address);

      expect(linkPanel.address.value).toBe('');

      await fixture.events.keyboard.type('http://google.com');

      await linkPanel.address.dispatchEvent(new window.Event('blur'));

      // Click the elements separately to verify having the new link set.
      await clickOnTarget(frame1);
      expect(linkPanel.address.value).toBe('http://google.com');

      await clickOnTarget(frame2);
      expect(linkPanel.address.value).toBe('http://google.com');
    });
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
    it('should be able to edit description');
  });
});
