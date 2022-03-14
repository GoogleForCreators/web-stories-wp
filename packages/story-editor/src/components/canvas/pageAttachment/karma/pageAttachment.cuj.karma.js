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
import { createSolidFromString } from '@googleforcreators/patterns';
/**
 * Internal dependencies
 */
import useInsertElement from '../../useInsertElement';
import { useStory } from '../../../../app/story';
import { Fixture } from '../../../../karma';

describe('Page Attachment', () => {
  let fixture;
  let frame;
  let safezone;

  const clickOnTarget = async (target) => {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    // Select Page by default.
    safezone = fixture.querySelector('[data-testid="safezone"]');
    await clickOnTarget(safezone);
  });

  afterEach(() => {
    fixture.restore();
  });

  const moveElementToBottom = async () => {
    safezone = fixture.querySelector('[data-testid="safezone"]');
    const safezoneHeight = safezone.getBoundingClientRect().height;
    const frameHeight = frame.getBoundingClientRect().height;
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame, 10, 10),
      down(),
      moveBy(0, safezoneHeight - frameHeight, { steps: 10 }),
      up(),
    ]);
  };

  const addElement = async (withLink = true) => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    const element = await fixture.act(() =>
      insertElement('shape', {
        backgroundColor: createSolidFromString('#ff00ff'),
        mask: { type: 'rectangle' },
        x: 10,
        y: 10,
        width: 50,
        height: 50,
        link: withLink
          ? {
              url: 'https://example.com',
            }
          : null,
      })
    );
    frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
  };

  const setPageAttachmentLink = async (link) => {
    const input = fixture.screen.getByLabelText(
      'Type an address to add a page attachment link'
    );
    await fixture.events.click(input, { clickCount: 3 });
    if ('' === link) {
      await fixture.events.keyboard.press('Del');
    } else {
      await fixture.events.keyboard.type(link);
    }
    await fixture.events.keyboard.press('tab');
  };

  const setCtaText = async (text) => {
    const input = fixture.screen.getByLabelText('Page Attachment CTA text');
    await fixture.events.click(input, { clickCount: 3 });
    await fixture.events.keyboard.type(text);
    await fixture.events.keyboard.press('tab');
  };

  describe('CUJ: Creator can Add a Page Attachment: Add Page Attachment', () => {
    it('it should allow adding Page Attachment with custom CTA Text', async () => {
      await setPageAttachmentLink('http://example.com');
      await setCtaText('Click me!');
      const ctaText = fixture.screen.getByText('Click me!');
      expect(ctaText).toBeDefined();
    });

    it('it should allow using dark theme for Page Attachment', async () => {
      await setPageAttachmentLink('http://example.test');
      const input = fixture.screen.getByLabelText('Use dark theme');
      await fixture.events.click(input);

      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.currentPage.pageAttachment.theme).toEqual(
        'dark'
      );
    });

    it('it should display warning for a link in the Page Attachment Area', async () => {
      await addElement();
      await moveElementToBottom();

      await clickOnTarget(safezone);
      await setPageAttachmentLink('');
      const warning = fixture.screen.getByText(
        'Links cannot reside below the dashed line when a page attachment is present. If you add a page attachment, your viewers will not be able to click on the link.'
      );
      expect(warning).toBeDefined();
    });
  });

  describe('CUJ: Creator can Add a Page Attachment: Remove Page Attachment', () => {
    it('it should allow removing a Page Attachment', async () => {
      await setPageAttachmentLink('http://example.com');
      await setCtaText('Click me!');
      const ctaText = fixture.screen.getByText('Click me!');
      expect(ctaText).toBeDefined();

      await setPageAttachmentLink('');
      expect(fixture.screen.queryByText('Click me!')).toBeNull();
    });
  });

  describe('CUJ: Creator can Add a Page Attachment: Adding link to element in Attachment area', () => {
    it('it should not allow adding link to Attachment area', async () => {
      await setPageAttachmentLink('http://example.com');
      await addElement(false);
      await moveElementToBottom();

      const input = fixture.screen.getByLabelText('Element link');
      await fixture.events.click(input);

      // Verify that the warning is displayed.
      const warning = fixture.screen.getByText(
        'Link can not reside below the dashed line when a page attachment is present'
      );
      expect(warning).toBeDefined();

      await fixture.events.keyboard.type('example.com');
      await fixture.events.keyboard.press('tab');

      // Verify the link is still null after typing.
      const {
        state: {
          currentPage: {
            elements: [{ link }],
          },
        },
      } = await fixture.renderHook(() => useStory());
      expect(link).toBeUndefined();
    });
  });
});
