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
    await fixture.events.mouse.clickOn(checklistTab);
    await waitFor(() => fixture.editor.inspector.checklistPanel);
  }

  async function openRecommendedPanel() {
    await fixture.events.mouse.clickOn(
      fixture.editor.inspector.checklistPanel.recommended
    );
    await fixture.events.sleep(500);
  }

  async function clickOnCanvas() {
    const canvas = fixture.querySelector('[data-testid="fullbleed"]');
    await fixture.events.mouse.clickOn(canvas);
  }

  describe('Prepublish checklist tab', () => {
    it('should select the offending image elements', async () => {
      await fixture.events.click(fixture.editor.library.media.item(0));

      let storyContext = await fixture.renderHook(() => useStory());
      const [elementId] = storyContext.state.selectedElementIds;

      await clickOnCanvas();
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(elementId);
      await openPrepublishPanel();
      await openRecommendedPanel();

      const tooSmallOnPage = fixture.screen.getByText(
        MESSAGES.MEDIA.VIDEO_IMAGE_TOO_SMALL_ON_PAGE.MAIN_TEXT
      );

      await openPrepublishPanel();
      await fixture.events.mouse.clickOn(tooSmallOnPage);
      await fixture.events.sleep(500);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).toEqual(elementId);
    });

    it('should select the offending text elements', async () => {
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
      await openRecommendedPanel();

      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      const tooMuchTextOnPage = fixture.screen.getByText(
        MESSAGES.TEXT.TOO_MUCH_PAGE_TEXT.MAIN_TEXT
      );
      await fixture.events.mouse.clickOn(tooMuchTextOnPage);
      await fixture.events.sleep(1000);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(4);
      expect(
        [element1, element2, element3, element4].map(({ id }) => id)
      ).toEqual(storyContext.state.selectedElementIds);
    });

    it('should select the element when the font size is too small', async () => {
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
      await openRecommendedPanel();
      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).toEqual(
        normalFontElement.id
      );
      const fontTooSmallRow = fixture.screen.getByText(
        MESSAGES.ACCESSIBILITY.FONT_TOO_SMALL.MAIN_TEXT
      );
      await fixture.events.mouse.clickOn(fontTooSmallRow);
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
      await openPrepublishPanel();
      await openRecommendedPanel();
      await clickOnCanvas();
      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(
        tooSmallLinkElement.id
      );
      const linkTooSmallRow = fixture.screen.getByText(
        MESSAGES.ACCESSIBILITY.LINK_REGION_TOO_SMALL.MAIN_TEXT
      );
      await fixture.events.mouse.clickOn(linkTooSmallRow);
      await fixture.events.sleep(500);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds[0]).toEqual(
        tooSmallLinkElement.id
      );
    });

    it('should select the element with the keyboard', async () => {
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
      await fixture.events.sleep(500);
      await openPrepublishPanel();
      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(
        tooSmallLinkElement.id
      );
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('Enter');
      await fixture.events.sleep(500);

      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');

      const linkTooSmallRow = fixture.screen
        .getByText(MESSAGES.ACCESSIBILITY.LINK_REGION_TOO_SMALL.MAIN_TEXT)
        .closest('button');

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
      await openPrepublishPanel();
      await openRecommendedPanel();
      const imageMissingAltTextRow = fixture.screen.getByText(
        MESSAGES.ACCESSIBILITY.MISSING_IMAGE_ALT_TEXT.MAIN_TEXT
      );
      await fixture.events.mouse.clickOn(imageMissingAltTextRow);

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
      await fixture.events.click(fixture.editor.library.media.item(0));

      let storyContext = await fixture.renderHook(() => useStory());
      const [elementId] = storyContext.state.selectedElementIds;

      await clickOnCanvas();
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(elementId);

      const noPosterImage = fixture.screen.getByText(
        MESSAGES.CRITICAL_METADATA.MISSING_POSTER.MAIN_TEXT
      );
      await openPrepublishPanel();
      await fixture.events.mouse.clickOn(noPosterImage);
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
