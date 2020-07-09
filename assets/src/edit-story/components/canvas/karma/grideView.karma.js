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
import { within, waitForElementToBeRemoved } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import createSolid from '../../../utils/createSolid';
import { useStory } from '../../../app';

describe('GridView integration', () => {
  let fixture;
  let gridView;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setPages([
      { id: 'page1', backgroundColor: createSolid(255, 255, 255) },
      { id: 'page2', backgroundColor: createSolid(255, 0, 0) },
      { id: 'page3', backgroundColor: createSolid(0, 255, 0) },
      { id: 'page4', backgroundColor: createSolid(0, 0, 255) },
    ]);

    await fixture.render();

    await openGridView();

    const gridViewRegion = fixture.screen.getByRole('region', {
      name: /^Grid View$/,
    });

    gridView = within(gridViewRegion);
  });

  afterEach(() => {
    fixture.restore();
  });

  async function openGridView() {
    const gridViewButton = fixture.editor.carousel.getByRole('button', {
      name: /^Grid View$/,
    });

    await fixture.events.click(gridViewButton);

    return Promise.resolve();
  }

  async function focusOnPageList() {
    let limit = 0;
    const pagesList = gridView.getByLabelText(/Grid View Pages List/);

    while (!pagesList.contains(document.activeElement) && limit < 5) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('tab');
      limit++;
    }

    return pagesList.contains(document.activeElement)
      ? Promise.resolve()
      : Promise.reject(new Error('could not focus on page list'));
  }

  async function getPageIds() {
    const {
      state: { pages },
    } = await fixture.renderHook(() => useStory());
    return pages.map(({ id }) => id);
  }

  async function getCurrentPageId() {
    const {
      state: { currentPageId },
    } = await fixture.renderHook(() => useStory());

    return currentPageId;
  }

  it('should open grid view', () => {
    const gridViewRegion = fixture.screen.getByRole('region', {
      name: /^Grid View$/,
    });
    expect(gridViewRegion).toBeTruthy();
  });

  it('should use tab to jump between the "Back" button, Preview Size control, and page list', async () => {
    // Tab cycle: Back -> Preview Size Control x3 stops -> Active/previously focused Page in Page List

    // Back Button
    await fixture.events.keyboard.press('tab');
    const backButton = gridView.getByRole('button', { name: /^Back$/ });
    expect(document.activeElement).toEqual(backButton);

    // Decrease Preview Size Button
    await fixture.events.keyboard.press('tab');
    const decreaseButton = gridView.getByRole('button', {
      name: /^Decrease thumbnail size$/,
    });
    expect(document.activeElement).toEqual(decreaseButton);

    // Preview Range Control
    await fixture.events.keyboard.press('tab');
    const sizeRangeControl = gridView.getByLabelText(/^Thumbnail size$/);
    expect(document.activeElement).toEqual(sizeRangeControl);

    // Increase Preview Size Button
    await fixture.events.keyboard.press('tab');
    const increaseButton = gridView.getByRole('button', {
      name: /^Increase thumbnail size$/,
    });
    expect(document.activeElement).toEqual(increaseButton);

    // Active/previously fcoused page in Page List
    await fixture.events.keyboard.press('tab');
    const page = gridView.getByRole('button', { name: /(current page)/ });
    expect(document.activeElement).toEqual(page);
  });

  // @todo test wrapping + up down
  it('should use the up, down, left, right keys to navigate focus with wrapping', async () => {
    await focusOnPageList();

    // The initial focus should be on the first (and active) page.
    const page1 = gridView.getByRole('button', { name: /Page 1/ });
    expect(page1).toEqual(document.activeElement);

    // go right by 1
    await fixture.events.keyboard.press('right');
    const page2 = gridView.getByRole('button', { name: /Page 2/ });
    expect(page2).toEqual(document.activeElement);

    // go left 1
    await fixture.events.keyboard.press('left');
    expect(page1).toEqual(document.activeElement);

    // go left 1 (focus should remain on page 1)
    await fixture.events.keyboard.press('left');
    expect(page1).toEqual(document.activeElement);

    // go right 3 (the end of the list)
    const page4 = gridView.getByRole('button', { name: /Page 4/ });
    await fixture.events.keyboard.seq(({ press }) => [
      press('right'),
      press('right'),
      press('right'),
    ]);
    expect(page4).toEqual(document.activeElement);

    // go right 1 (focus should remain on page 4)
    await fixture.events.keyboard.press('right');
    expect(page4).toEqual(document.activeElement);
  });

  // @todo test wrapping + up down
  it('should reorder the pages using mod+left/right, mod+up/down and use shift+mod+dir to reorder to first/last', async () => {
    const initialPageIds = await getPageIds();
    let pageIds = [...initialPageIds];

    await focusOnPageList();

    // The initial focus should be on the first (and active) page.
    const page1 = gridView.getByRole('button', { name: /Page 1/ });
    expect(page1).toEqual(document.activeElement);

    // move the first page to the right
    await fixture.events.keyboard.shortcut('mod+right');
    pageIds = await getPageIds();
    expect(pageIds[1]).toEqual(initialPageIds[0]);

    // move the first page back to the start
    await fixture.events.keyboard.shortcut('mod+left');
    pageIds = await getPageIds();
    expect(pageIds).toEqual(initialPageIds);

    // move the first page to the end
    await fixture.events.keyboard.shortcut('shift+mod+right');
    pageIds = await getPageIds();
    expect(pageIds[pageIds.length - 1]).toEqual(initialPageIds[0]);

    // focus on the penultimate page
    await fixture.events.keyboard.press('left');
    const page3 = gridView.getByRole('button', { name: /Page 3/ });
    expect(page3).toEqual(document.activeElement);

    // move page 4 to the start
    await fixture.events.keyboard.shortcut('shift+mod+left');
    pageIds = await getPageIds();
    expect(pageIds[0]).toEqual(initialPageIds[3]);
  });

  it('should select the focused page when "Enter" is pressed', async () => {
    await focusOnPageList();

    const initialPageIds = await getPageIds();

    const page2Id = initialPageIds[1];

    // Focus on page 2
    await fixture.events.keyboard.press('right');

    // Press enter and make page 2 the active/selected page
    await fixture.events.keyboard.press('Enter');

    const currentPage = await getCurrentPageId();

    expect(currentPage).toEqual(page2Id);
  });

  it('should trap focus', async () => {
    // Tab cycle: Back -> Preview Size Control x3 stops -> Active/previously focused Page in Page List

    // Full cycle forwards
    await fixture.events.keyboard.seq(({ press }) => [
      press('tab'),
      press('tab'),
      press('tab'),
      press('tab'),
      press('tab'),
      press('tab'),
    ]);

    const backButton = gridView.getByRole('button', { name: /^Back$/ });
    expect(document.activeElement).toEqual(backButton);
  });

  it('should use "Esc" to exit the dialog', async () => {
    const gridViewRegion = fixture.screen.getByRole('region', {
      name: /^Grid View$/,
    });
    expect(gridViewRegion).toBeTruthy();

    await fixture.events.keyboard.press('Esc');

    await waitForElementToBeRemoved(gridViewRegion);
  });
});
