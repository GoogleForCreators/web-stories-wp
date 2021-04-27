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
import { MESSAGES } from '../../../app/prepublish/constants';
import { useStory } from '../../../app';
import { useInsertElement } from '../../../components/canvas';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';

describe('Pre-publish checklist select offending elements onClick', () => {
  let fixture;
  let insertElement;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    insertElement = await fixture.renderHook(() => useInsertElement());
  });

  afterEach(() => {
    fixture.restore();
  });

  async function openPrepublishPanel() {
    const { checklistTab } = fixture.editor.inspector;
    await fixture.events.click(checklistTab);
    await waitFor(() => fixture.editor.inspector.checklistPanel);
    // just add a small wait for the checklist to compute its items
    await waitFor(
      () => !fixture.editor.inspector.checklistPanel.recommended.disabled
    );
  }

  async function clickOnCanvas() {
    const canvas = fixture.querySelector('[data-testid="fullbleed"]');
    await fixture.events.click(canvas);
  }

  async function addNewPage() {
    const addNewPageButton = fixture.screen.getByRole('button', {
      name: /Add New Page/,
    });
    await fixture.events.click(addNewPageButton, { clickCount: 1 });
  }

  async function enableRecommendedMessagesWith2Pages() {
    await addNewPage();
    await openPrepublishPanel();
    await waitFor(
      () => !fixture.editor.inspector.checklistPanel.recommended.disabled
    );
    await fixture.events.sleep(500);
  }

  async function enableHighPriorityMessagesWith5Pages() {
    await addNewPage();
    await addNewPage();
    await addNewPage();
    await addNewPage();
    await addNewPage();
    await openPrepublishPanel();
    await waitFor(
      () => !fixture.editor.inspector.checklistPanel.highPriority.disabled
    );
    await fixture.events.sleep(500);
  }

  describe('Prepublish checklist tab', () => {
    it('should begin collapsed and disabled on a new story', async () => {
      await openPrepublishPanel();

      const recommendedPanel =
        fixture.editor.inspector.checklistPanel.recommended;
      const highPriorityPanel =
        fixture.editor.inspector.checklistPanel.highPriority;

      expect(recommendedPanel.disabled).toBeTrue();
      expect(highPriorityPanel.disabled).toBeTrue();
    });

    it('should open the recommended panel once the story reaches two pages', async () => {
      await openPrepublishPanel();

      const recommendedPanel =
        fixture.editor.inspector.checklistPanel.recommended;
      const highPriorityPanel =
        fixture.editor.inspector.checklistPanel.highPriority;

      expect(recommendedPanel.disabled).toBeTrue();
      expect(highPriorityPanel.disabled).toBeTrue();

      await enableRecommendedMessagesWith2Pages();

      const recommendedIssue = fixture.screen.getByText(
        MESSAGES.DISTRIBUTION.MISSING_DESCRIPTION.MAIN_TEXT
      );

      expect(recommendedIssue).not.toBeNull();

      expect(recommendedPanel.disabled).toBeFalse();
      expect(highPriorityPanel.disabled).toBeTrue();
    });

    it('should open the high priority panel once the story reaches five pages', async () => {
      await openPrepublishPanel();

      const recommendedPanel =
        fixture.editor.inspector.checklistPanel.recommended;
      const highPriorityPanel =
        fixture.editor.inspector.checklistPanel.highPriority;

      expect(recommendedPanel.disabled).toBeTrue();
      expect(highPriorityPanel.disabled).toBeTrue();

      await enableHighPriorityMessagesWith5Pages();
      const recommendedIssue = fixture.screen.getByText(
        MESSAGES.DISTRIBUTION.MISSING_DESCRIPTION.MAIN_TEXT
      );
      const highPriorityIssue = fixture.screen.getByText(
        MESSAGES.CRITICAL_METADATA.MISSING_POSTER.MAIN_TEXT
      );

      expect(recommendedIssue).not.toBeNull();
      expect(highPriorityIssue).not.toBeNull();
    });

    it('should select the offending text elements', async () => {
      await enableRecommendedMessagesWith2Pages();

      // four paragraphs will cause the "too much text on page" error
      const doInsert = () =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          fontSize: 14,
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          x: 40,
          y: 40,
          width: 250,
        });

      const element1 = await fixture.act(doInsert);
      const element2 = await fixture.act(doInsert);
      const element3 = await fixture.act(doInsert);
      const element4 = await fixture.act(doInsert);

      await openPrepublishPanel();
      await fixture.events.sleep(500);

      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);

      const tooMuchTextOnPage = fixture.screen.getByText(
        MESSAGES.TEXT.TOO_MUCH_PAGE_TEXT.MAIN_TEXT
      );
      await fixture.events.click(tooMuchTextOnPage);
      await fixture.events.sleep(1000);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(4);
      expect(
        [element1, element2, element3, element4].map(({ id }) => id)
      ).toEqual(storyContext.state.selectedElementIds);
    });

    it('should select the element when the font size is too small', async () => {
      await enableRecommendedMessagesWith2Pages();

      const insertSmallFont = () =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          fontSize: 9,
          content: 'Lorem ipsum.',
          x: 40,
          y: 40,
          width: 250,
        });

      const insertNormalFont = () =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          fontSize: 20,
          content: 'Lorem ipsum.',
          x: 100,
          y: 40,
          width: 250,
        });

      const smallFontElement = await fixture.act(insertSmallFont);
      const normalFontElement = await fixture.act(insertNormalFont);

      await openPrepublishPanel();
      await fixture.events.sleep(500);

      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).toEqual(
        normalFontElement.id
      );
      const fontTooSmallRow = fixture.screen.getByText(
        MESSAGES.ACCESSIBILITY.FONT_TOO_SMALL.MAIN_TEXT
      );
      await fixture.events.click(fontTooSmallRow);
      await fixture.events.sleep(500);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds[0]).toEqual(
        smallFontElement.id
      );
    });

    it('should select link elements when they are too small to tap', async () => {
      const tooSmallLinkElement = await fixture.act(() =>
        insertElement('text', {
          id: 'elementid',
          type: 'text',
          link: {
            url: 'https://google.com',
          },
          content: 'G',
          width: 40,
          height: 40,
        })
      );

      await enableRecommendedMessagesWith2Pages();
      await clickOnCanvas();
      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(
        tooSmallLinkElement.id
      );
      const linkTooSmallRow = fixture.screen.getByText(
        MESSAGES.ACCESSIBILITY.LINK_REGION_TOO_SMALL.MAIN_TEXT
      );
      await fixture.events.click(linkTooSmallRow);
      await fixture.events.sleep(500);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds[0]).toEqual(
        tooSmallLinkElement.id
      );
    });

    it('should select the element with the keyboard', async () => {
      await enableHighPriorityMessagesWith5Pages();
      const tooSmallLinkElement = await fixture.act(() =>
        insertElement('text', {
          id: 'elementid',
          type: 'text',
          link: {
            url: 'https://google.com',
          },
          content: 'S',
          width: 40,
          height: 40,
        })
      );

      await clickOnCanvas();
      await openPrepublishPanel();
      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(
        tooSmallLinkElement.id
      );

      await fixture.events.sleep(500);
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.sleep(500);

      const linkTooSmallRow = fixture.screen.getByText(
        MESSAGES.ACCESSIBILITY.LINK_REGION_TOO_SMALL.MAIN_TEXT
      );

      expect(document.activeElement).toEqual(linkTooSmallRow);
      await fixture.events.keyboard.press('Enter');

      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).toEqual(
        tooSmallLinkElement.id
      );
    });

    it('should open the design inspector panel and focus the text input', async () => {
      await fixture.act(() => {
        insertElement('image', {
          x: 0,
          y: 0,
          width: 640 / 2,
          height: 529 / 2,
          resource: {
            type: 'image',
            mimeType: 'image/jpg',
            src: 'http://localhost:9876/__static__/earth.jpg',
          },
        });
      });

      await enableRecommendedMessagesWith2Pages();
      await fixture.events.sleep(500);

      const imageMissingAltTextRow = fixture.screen.getByText(
        MESSAGES.ACCESSIBILITY.MISSING_IMAGE_ALT_TEXT.MAIN_TEXT
      );
      await fixture.events.click(imageMissingAltTextRow);

      expect(
        fixture.editor.inspector.designPanel.node.contains(
          document.activeElement
        )
      ).toBeTrue();
      await fixture.snapshot(
        'design tab opened and focused by checklist panel'
      );
    });

    it('should open the document inspector panel', async () => {
      await enableHighPriorityMessagesWith5Pages();
      await fixture.events.click(fixture.editor.library.media.item(0));

      let storyContext = await fixture.renderHook(() => useStory());
      const [elementId] = storyContext.state.selectedElementIds;

      await clickOnCanvas();
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(elementId);

      await openPrepublishPanel();
      const noPosterImage = fixture.screen.getByText(
        MESSAGES.CRITICAL_METADATA.MISSING_POSTER.MAIN_TEXT
      );
      await fixture.events.click(noPosterImage);
      await waitFor(() => {
        expect(
          fixture.editor.inspector.documentPanel.node.querySelector(
            `[id^="panel-publishing-"]`
          )
        ).not.toBeNull();
      });
      await fixture.snapshot('document tab opened by checklist panel');
    });
  });
});
