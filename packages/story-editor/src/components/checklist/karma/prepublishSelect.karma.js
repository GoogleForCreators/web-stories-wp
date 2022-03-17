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
import { waitFor, within } from '@testing-library/react';
import { TEXT_ELEMENT_DEFAULT_FONT } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { useStory } from '../../../app';
import { useInsertElement } from '../../canvas';
import { ACCESSIBILITY_COPY, DESIGN_COPY, PRIORITY_COPY } from '../constants';

describe('Pre-publish checklist select offending elements onClick', () => {
  let fixture;
  let insertElement;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
    insertElement = await fixture.renderHook(() => useInsertElement());
  });

  afterEach(() => {
    fixture.restore();
  });

  const openChecklist = async () => {
    const { toggleButton } = fixture.editor.checklist;
    await fixture.events.click(toggleButton);
    // wait for animation
    await fixture.events.sleep(500);
  };

  const addPages = async (count) => {
    let clickCount = 1;
    while (clickCount <= count) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
      // eslint-disable-next-line no-await-in-loop, no-loop-func
      await waitFor(() => {
        if (!fixture.editor.footer.carousel.pages.length) {
          throw new Error('page not yet added');
        }
        expect(fixture.editor.footer.carousel.pages.length).toBe(
          clickCount + 1
        );
      });
      clickCount++;
    }
  };

  async function clickOnCanvas() {
    const canvas = fixture.querySelector('[data-testid="fullbleed"]');
    await fixture.events.click(canvas);
  }

  describe('Checklist interactions', () => {
    it('should select the offending text elements', async () => {
      await addPages(1);
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
      await openChecklist();

      expect(fixture.editor.checklist.designPanel).toBeDefined();

      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);

      const tooMuchTextOnTitle = fixture.screen.getByText(
        DESIGN_COPY.tooMuchPageText.title
      );
      // Use title to get to thumbnail in card
      const { getByRole } = within(
        tooMuchTextOnTitle.parentElement.parentElement
      );
      const thumbnail = getByRole('button');
      expect(thumbnail).toBeDefined();
      await fixture.events.click(thumbnail);
      await fixture.events.sleep(500);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(4);
      expect(
        [element1, element2, element3, element4].map(({ id }) => id)
      ).toEqual(storyContext.state.selectedElementIds);
    });

    it('should select the element when the font size is too small', async () => {
      await addPages(1);

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

      await openChecklist();

      await fixture.events.click(fixture.editor.checklist.accessibilityTab);

      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).toEqual(
        normalFontElement.id
      );
      const fontTooSmallTitle = fixture.screen.getByText(
        ACCESSIBILITY_COPY.fontSizeTooSmall.title
      );
      // Use title to get to thumbnail in card
      const { getByRole } = within(
        fontTooSmallTitle.parentElement.parentElement
      );
      const thumbnail = getByRole('button');
      expect(thumbnail).toBeDefined();
      await fixture.events.click(thumbnail);
      await fixture.events.click(fontTooSmallTitle);
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
      await clickOnCanvas();
      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(
        tooSmallLinkElement.id
      );

      await openChecklist();
      await fixture.events.click(fixture.editor.checklist.accessibilityTab);

      const linkTooSmallTitle = fixture.screen.getByText(
        ACCESSIBILITY_COPY.linkTappableRegionTooSmall.title
      );
      // Use title to get to thumbnail in card
      const { getByRole } = within(
        linkTooSmallTitle.parentElement.parentElement
      );
      const thumbnail = getByRole('button');
      expect(thumbnail).toBeDefined();
      await fixture.events.click(thumbnail);
      await fixture.events.sleep(500);
      storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds[0]).toEqual(
        tooSmallLinkElement.id
      );
    });

    it('should select the element with the keyboard', async () => {
      await addPages(4);
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

      let storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds.length).toEqual(1);
      expect(storyContext.state.selectedElementIds[0]).not.toEqual(
        tooSmallLinkElement.id
      );

      await openChecklist();

      await fixture.events.keyboard.press('tab');
      // Collapse priority panel which is expanded by default
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.press('tab');
      // Navigate to accessibility panel
      await fixture.events.keyboard.press('tab');
      // Expand panel
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.press('tab');

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
            id: 10,
            type: 'image',
            mimeType: 'image/jpg',
            src: 'http://localhost:9876/__static__/earth.jpg',
            alt: '',
            width: 640,
            height: 529,
            baseColor: '#734727',
          },
        });
      });

      await addPages(2);
      await openChecklist();
      await fixture.events.click(fixture.editor.checklist.accessibilityTab);
      const imageMissingAltTextTitle = fixture.screen.getByText(
        ACCESSIBILITY_COPY.imagesMissingAltText.title
      );
      // Use title to get to thumbnail in card
      const { getByRole } = within(
        imageMissingAltTextTitle.parentElement.parentElement
      );
      const thumbnail = getByRole('button');
      expect(thumbnail).toBeDefined();
      await fixture.events.click(thumbnail);
      await fixture.events.sleep(500);
      expect(
        fixture.editor.inspector.designPanel.node.contains(
          document.activeElement
        )
      ).toBeTrue();
      await fixture.snapshot(
        'design tab opened and focused by checklist panel'
      );
    });

    it('should open the design panel accessibility section and focus the video poster button when using mouse', async () => {
      await fixture.act(() => {
        insertElement('video', {
          x: 0,
          y: 0,
          width: 640 / 2,
          height: 529 / 2,
          resource: {
            width: 640,
            height: 529,
            type: 'video',
            mimeType: 'video/mp4',
            src: 'http://localhost:9876/__static__/beach.mp4',
            alt: 'Beach',
          },
        });
      });

      await addPages(5);
      await openChecklist();
      // high priority should auto expand
      const videoMissingPosterTitle = fixture.screen.getByText(
        PRIORITY_COPY.videoMissingPoster.title
      );

      expect(videoMissingPosterTitle).toBeDefined();
      // Use title to get to thumbnail in card
      const { getByRole } = within(
        videoMissingPosterTitle.parentElement.parentElement
      );
      const thumbnail = getByRole('button');
      expect(thumbnail).toBeDefined();
      await fixture.events.click(thumbnail);
      await fixture.events.sleep(500);

      const mediaButton = await fixture.editor.inspector.designPanel
        .videoAccessibility.posterMenuButton;
      expect(mediaButton.contains(document.activeElement)).toBeTrue();

      await fixture.snapshot(
        'design tab opened accessibility and focused on video poster button by checklist panel'
      );
    });

    it('should open the design panel accessibility section and focus the video poster button when using keyboard', async () => {
      await fixture.act(() => {
        insertElement('video', {
          x: 0,
          y: 0,
          width: 640 / 2,
          height: 529 / 2,
          resource: {
            width: 640,
            height: 529,
            type: 'video',
            mimeType: 'video/mp4',
            src: 'http://localhost:9876/__static__/beach.mp4',
            alt: 'Beach',
          },
        });
      });

      await addPages(4);
      await openChecklist();
      // high priority should auto expand
      // tab to card
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Tab');

      // press enter on video preview in card
      await fixture.events.keyboard.press('Enter');

      const mediaButton = await fixture.editor.inspector.designPanel
        .videoAccessibility.posterMenuButton;
      expect(mediaButton.contains(document.activeElement)).toBeTrue();

      await fixture.snapshot(
        'design tab opened accessibility and focused on video poster button by checklist panel'
      );
    });
  });
});
