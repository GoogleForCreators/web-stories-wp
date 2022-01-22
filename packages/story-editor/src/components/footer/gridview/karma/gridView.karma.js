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
import { waitForElementToBeRemoved } from '@testing-library/react';
import { createSolid } from '@googleforcreators/patterns';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app';

describe('GridView integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setPages([
      { id: 'page1', backgroundColor: createSolid(255, 255, 255) },
      { id: 'page2', backgroundColor: createSolid(255, 0, 0) },
      { id: 'page3', backgroundColor: createSolid(0, 255, 0) },
      { id: 'page4', backgroundColor: createSolid(0, 0, 255) },
    ]);

    await fixture.render();
    await fixture.collapseHelpCenter();

    await fixture.events.click(fixture.editor.footer.gridViewToggle);
  });

  afterEach(() => {
    fixture.restore();
  });

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
    expect(fixture.editor.gridView.node).toBeTruthy();
  });

  it('should have no aXe violations', async () => {
    await expectAsync(fixture.editor.gridView.node).toHaveNoViolations();
  });

  it('should use tab to jump between the "Back" button, Preview Size control, and page list', async () => {
    // Tab cycle: Back -> Page Size range -> Active/previously focused Page in Page List

    // Back Button
    await fixture.events.keyboard.press('tab');
    expect(fixture.editor.gridView.close).toHaveFocus();

    // Page Size range
    await fixture.events.keyboard.press('tab');
    expect(fixture.editor.gridView.size).toHaveFocus();

    // Active/previously fcoused page in Page List
    await fixture.events.keyboard.press('tab');
    expect(fixture.editor.gridView.currentPage).toHaveFocus();
  });

  // @todo test wrapping + up down
  it('should use the up, down, left, right keys to navigate focus with wrapping', async () => {
    // Tab thrice to focus the current page in the page list
    await fixture.events.keyboard.seq(({ press }) => [
      press('tab'),
      press('tab'),
      press('tab'),
    ]);

    // The initial focus should be on the first (and active) page.
    expect(fixture.editor.gridView.page('Page 1')).toHaveFocus();
    expect(fixture.editor.gridView.currentPage).toHaveFocus();

    // go right by 1
    await fixture.events.keyboard.press('right');
    expect(fixture.editor.gridView.page('Page 2')).toHaveFocus();

    // go left 1
    await fixture.events.keyboard.press('left');
    expect(fixture.editor.gridView.page('Page 1')).toHaveFocus();

    // go left 1 (focus should remain on page 1)
    await fixture.events.keyboard.press('left');
    expect(fixture.editor.gridView.page('Page 1')).toHaveFocus();

    // go right 3 (the end of the list)
    await fixture.events.keyboard.seq(({ press }) => [
      press('right'),
      press('right'),
      press('right'),
    ]);
    expect(fixture.editor.gridView.page('Page 4')).toHaveFocus();

    // go right 1 (focus should remain on page 4)
    await fixture.events.keyboard.press('right');
    expect(fixture.editor.gridView.page('Page 4')).toHaveFocus();
  });

  // @todo test wrapping + up down
  it('should reorder the pages using mod+left/right, mod+up/down and use shift+mod+dir to reorder to first/last', async () => {
    const initialPageIds = await getPageIds();
    let pageIds = [...initialPageIds];

    // Tab thrice to focus the current page in the page list
    await fixture.events.keyboard.seq(({ press }) => [
      press('tab'),
      press('tab'),
      press('tab'),
    ]);

    // The initial focus should be on the first (and active) page.
    expect(fixture.editor.gridView.page('Page 1')).toHaveFocus();

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
    expect(fixture.editor.gridView.page('Page 3')).toHaveFocus();

    // move page 4 to the start
    await fixture.events.keyboard.shortcut('shift+mod+left');
    pageIds = await getPageIds();
    expect(pageIds[0]).toEqual(initialPageIds[3]);
  });

  it('should select the focused page when "Enter" is pressed', async () => {
    // Tab thrice to focus the current page in the page list
    await fixture.events.keyboard.seq(({ press }) => [
      press('tab'),
      press('tab'),
      press('tab'),
    ]);

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
    // Tab cycle: Back -> Page Size range -> Active/previously focused Page in Page List

    // Full cycle forwards
    await fixture.events.keyboard.seq(({ press }) => [
      press('tab'),
      press('tab'),
      press('tab'),
      press('tab'),
    ]);

    expect(fixture.editor.gridView.close).toHaveFocus();
  });

  // TODO: https://github.com/googleforcreators/web-stories-wp/issues/10146
  // eslint-disable-next-line jasmine/no-disabled-tests
  xit('should use "Esc" to exit the dialog', async () => {
    const { gridView } = fixture.editor;
    expect(gridView.node).toBeTruthy();
    await fixture.events.keyboard.press('Esc');
    await waitForElementToBeRemoved(gridView.node);
  });
});
