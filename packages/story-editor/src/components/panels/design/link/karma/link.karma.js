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
import { createSolidFromString } from '@web-stories-wp/patterns';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma';
import useInsertElement from '../../../../canvas/useInsertElement';
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

  const moveElementToBottom = async (frame, frameY = 0) => {
    const safezoneHeight = safezone.getBoundingClientRect().height;
    const frameHeight = frame.getBoundingClientRect().height;
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame, 10, 10),
      down(),
      moveBy(0, safezoneHeight - frameHeight - frameY - 50, { steps: 10 }),
      up(),
    ]);
  };

  const setPageAttachmentLink = async (link) => {
    const input = fixture.screen.getByLabelText(
      'Type an address to add a page attachment link'
    );
    await fixture.events.click(input, { clickCount: 3 });
    await fixture.events.keyboard.type(link);
    await fixture.events.keyboard.press('tab');
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

  async function closePanel(name) {
    const btn = fixture.screen.getByRole('button', { name });
    await fixture.events.click(btn);
  }

  describe('CUJ: Creator Can Add A Link: Apply a link to any element', () => {
    beforeEach(async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
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

      await fixture.events.keyboard.press('tab');
      expect(linkPanel.address.value).toBe('https://example.com');
    });

    it('should not add additional protocol if already present', async () => {
      await fixture.events.click(linkPanel.address);
      await fixture.events.keyboard.type('https://example.com');

      await fixture.events.keyboard.press('tab');
      expect(linkPanel.address.value).toBe('https://example.com');
    });

    // TODO(#8738): Fix flaky test.
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should display the link tooltip correctly', async () => {
      const linkDescription = 'Example description';
      // make sure address input exists
      await waitFor(() => linkPanel.address);

      await fixture.events.click(linkPanel.address);
      await fixture.events.keyboard.type('example.com');

      // Debounce time for populating meta-data.
      await fixture.events.keyboard.press('tab');
      await fixture.events.sleep(1200);
      // make sure description input exists
      await waitFor(() => linkPanel.description);
      await fixture.events.click(linkPanel.description, { clickCount: 3 });
      await fixture.events.keyboard.type(linkDescription);
      await fixture.events.keyboard.press('tab');
      // Unselect element.
      const fullbleed = fixture.container.querySelector(
        '[data-testid="fullbleed"]'
      );
      const { left, top } = fullbleed.getBoundingClientRect();
      await fixture.events.mouse.click(left - 5, top - 5);

      // Move mouse to hover over the element.
      const frame = fixture.editor.canvas.framesLayer.frames[1].node;
      await fixture.events.mouse.moveRel(frame, 10, 10);

      // TODO(#8738): This line appears to be flaky.
      expect(fixture.screen.getByText(linkDescription)).toBeTruthy();
      await fixture.snapshot(
        'Element is hovered on. The link tooltip is visible'
      );

      // Select the element again.
      await fixture.events.click(frame);
      await waitFor(() => fixture.editor.inspector.designPanel.link.address);
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
          x: 100,
          y: 100,
          width: 50,
          height: 50,
        })
      );
      const frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
      await moveElementToBottom(frame, 0);

      await closePanel('Selection');

      linkPanel = fixture.editor.inspector.designPanel.link;
      await fixture.events.click(linkPanel.address);

      await fixture.events.sleep(5000);

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
          y: 140,
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

      await fixture.events.keyboard.press('tab');

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
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      linkPanel = fixture.editor.inspector.designPanel.link;
      await fixture.events.click(linkPanel.address);
      await fixture.events.keyboard.type('http://google.com');
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
