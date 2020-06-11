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
import { useStory } from '../../../app/story';
import { useInsertElement } from '..';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';
import { createPage } from '../../../elements';
import createSolid from '../../../utils/createSolid';

describe('Carousel integration', () => {
  let fixture;
  let page1, page2, page3, page4;
  let element1;
  let carousel;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    const {
      actions: { addPage, setCurrentPage },
    } = await fixture.renderHook(() => useStory());
    await fixture.act(() =>
      addPage({ page: createPage({ backgroundColor: createSolid(255, 0, 0) }) })
    );
    await fixture.act(() =>
      addPage({ page: createPage({ backgroundColor: createSolid(0, 255, 0) }) })
    );
    await fixture.act(() =>
      addPage({ page: createPage({ backgroundColor: createSolid(0, 0, 255) }) })
    );

    [page1, page2, page3, page4] = await getPageIds();

    await setCurrentPage({ pageId: page1 });
    const insertElement = await fixture.renderHook(() => useInsertElement());
    element1 = await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: `Page 1`,
        x: 40,
        y: 40,
        width: 250,
      })
    );

    carousel = fixture.container.querySelector('[data-testid="PageCarousel"]');
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getCurrentPageId() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.currentPageId;
  }

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  async function getPageIds() {
    const {
      state: { pages },
    } = await fixture.renderHook(() => useStory());
    return pages.map(({ id }) => id);
  }

  function getThumbnail(index) {
    const thumbnails = carousel.querySelectorAll(
      '[role="listbox"] button[role="option"]'
    );
    return thumbnails[index];
  }

  it('should select the current page', async () => {
    expect(await getCurrentPageId()).toEqual(page1);
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should click into carousel on the first page', async () => {
    await fixture.events.mouse.clickOn(getThumbnail(0), 5, 5);
    expect(await getCurrentPageId()).toEqual(page1);
    expect(await getSelection()).toEqual([]);
  });

  it('should exit the carousel on Esc', async () => {
    await fixture.events.mouse.clickOn(getThumbnail(0), 5, 5);
    await waitFor(() => {
      if (!carousel.contains(document.activeElement)) {
        throw new Error('Focus is not set on the carousel yet');
      }
    });

    // Exit.
    await fixture.events.keyboard.press('Esc');
    const framesLayer = fixture.querySelector('[data-testid="FramesLayer"]');
    await waitFor(() => {
      if (!framesLayer.contains(document.activeElement)) {
        throw new Error('Focus is not set on the canvas yet');
      }
    });
  });

  it('should click into carousel on the second page', async () => {
    await fixture.events.mouse.clickOn(getThumbnail(1), 5, 5);
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getSelection()).toEqual([]);
  });

  it('should navigate the page with keys', async () => {
    await fixture.events.mouse.clickOn(getThumbnail(1), 5, 5);
    expect(await getCurrentPageId()).toEqual(page2);

    // Go left.
    await fixture.events.keyboard.press('left');
    expect(await getCurrentPageId()).toEqual(page1);

    // Go left again: end of the line.
    await fixture.events.keyboard.press('left');
    expect(await getCurrentPageId()).toEqual(page1);

    // Go right.
    await fixture.events.keyboard.press('right');
    expect(await getCurrentPageId()).toEqual(page2);

    // Go right again.
    await fixture.events.keyboard.press('right');
    expect(await getCurrentPageId()).toEqual(page3);

    // Go right again.
    await fixture.events.keyboard.press('right');
    expect(await getCurrentPageId()).toEqual(page4);

    // Go right again: end of the line.
    await fixture.events.keyboard.press('right');
    expect(await getCurrentPageId()).toEqual(page4);
  });

  it('should reorder the page with keys', async () => {
    await fixture.events.mouse.clickOn(getThumbnail(1), 5, 5);
    expect(await getCurrentPageId()).toEqual(page2);

    // Order left.
    await fixture.events.keyboard.shortcut('mod+left');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page2, page1, page3, page4]);

    // Order left again: end of the line.
    await fixture.events.keyboard.shortcut('mod+left');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page2, page1, page3, page4]);

    // Order right.
    await fixture.events.keyboard.shortcut('mod+right');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page1, page2, page3, page4]);

    // Order right again.
    await fixture.events.keyboard.shortcut('mod+right');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page1, page3, page2, page4]);

    // Order right again.
    await fixture.events.keyboard.shortcut('mod+right');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page1, page3, page4, page2]);

    // Order right again: end of the line.
    await fixture.events.keyboard.shortcut('mod+right');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page1, page3, page4, page2]);

    // Order to first.
    await fixture.events.keyboard.shortcut('shift+mod+left');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page2, page1, page3, page4]);

    // Order to last.
    await fixture.events.keyboard.shortcut('shift+mod+right');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page1, page3, page4, page2]);
  });

  it('should delete the first page', async () => {
    await fixture.events.mouse.clickOn(getThumbnail(0), 5, 5);
    await fixture.events.keyboard.press('del');
    expect(await getCurrentPageId()).toEqual(page2);
    expect(await getPageIds()).toEqual([page2, page3, page4]);
  });

  it('should delete the second page', async () => {
    await fixture.events.mouse.clickOn(getThumbnail(1), 5, 5);
    await fixture.events.keyboard.press('del');
    expect(await getCurrentPageId()).toEqual(page3);
    expect(await getPageIds()).toEqual([page1, page3, page4]);
  });

  it('should duplicate the first page', async () => {
    await fixture.events.mouse.clickOn(getThumbnail(0), 5, 5);
    await fixture.events.keyboard.shortcut('mod+D');
    const newPageId = await getCurrentPageId();
    expect(await getPageIds()).toEqual([page1, newPageId, page2, page3, page4]);
  });
});
