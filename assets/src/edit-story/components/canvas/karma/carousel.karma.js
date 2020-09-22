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
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';
import { useInsertElement } from '..';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';
import createSolid from '../../../utils/createSolid';

describe('Carousel integration', () => {
  let fixture;
  let element1;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setPages([
      { id: 'page1', backgroundColor: createSolid(255, 255, 255) },
      { id: 'page2', backgroundColor: createSolid(255, 0, 0) },
      { id: 'page3', backgroundColor: createSolid(0, 255, 0) },
      { id: 'page4', backgroundColor: createSolid(0, 0, 255) },
    ]);
    await fixture.render();

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

  async function clickOnThumbnail(index) {
    await fixture.editor.carousel.waitReady();
    const thumb = fixture.editor.carousel.pages[index];
    thumb.node.scrollIntoView();
    await fixture.events.mouse.clickOn(thumb.node, 5, 5);
  }

  it('should select the current page', async () => {
    expect(await getCurrentPageId()).toEqual('page1');
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should click into carousel on the first page', async () => {
    await clickOnThumbnail(0);
    expect(await getCurrentPageId()).toEqual('page1');
    expect(await getSelection()).toEqual([]);
  });

  it('should exit the carousel on Esc', async () => {
    // Enter.
    await clickOnThumbnail(0);
    await fixture.editor.carousel.waitFocusedWithin();

    // Exit.
    await fixture.events.keyboard.press('Esc');
    await fixture.editor.canvas.framesLayer.waitFocusedWithin();
  });

  it('should click into carousel on the second page', async () => {
    await clickOnThumbnail(1);
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getSelection()).toEqual([]);
  });

  it('should navigate the page with keys', async () => {
    await clickOnThumbnail(1);
    expect(await getCurrentPageId()).toEqual('page2');

    // Go left.
    await fixture.events.keyboard.press('left');
    expect(await getCurrentPageId()).toEqual('page1');

    // Go left again: end of the line.
    await fixture.events.keyboard.press('left');
    expect(await getCurrentPageId()).toEqual('page1');

    // Go right.
    await fixture.events.keyboard.press('right');
    expect(await getCurrentPageId()).toEqual('page2');

    // Go right again.
    await fixture.events.keyboard.press('right');
    expect(await getCurrentPageId()).toEqual('page3');

    // Go right again.
    await fixture.events.keyboard.press('right');
    expect(await getCurrentPageId()).toEqual('page4');

    // Go right again: end of the line.
    await fixture.events.keyboard.press('right');
    expect(await getCurrentPageId()).toEqual('page4');
  });

  it('should reorder the page with keys', async () => {
    await clickOnThumbnail(1);
    expect(await getCurrentPageId()).toEqual('page2');

    // Order left.
    await fixture.events.keyboard.shortcut('mod+left');
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getPageIds()).toEqual(['page2', 'page1', 'page3', 'page4']);

    // Order left again: end of the line.
    await fixture.events.keyboard.shortcut('mod+left');
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getPageIds()).toEqual(['page2', 'page1', 'page3', 'page4']);

    // Order right.
    await fixture.events.keyboard.shortcut('mod+right');
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getPageIds()).toEqual(['page1', 'page2', 'page3', 'page4']);

    // Order right again.
    await fixture.events.keyboard.shortcut('mod+right');
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getPageIds()).toEqual(['page1', 'page3', 'page2', 'page4']);

    // Order right again.
    await fixture.events.keyboard.shortcut('mod+right');
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getPageIds()).toEqual(['page1', 'page3', 'page4', 'page2']);

    // Order right again: end of the line.
    await fixture.events.keyboard.shortcut('mod+right');
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getPageIds()).toEqual(['page1', 'page3', 'page4', 'page2']);

    // Order to first.
    await fixture.events.keyboard.shortcut('shift+mod+left');
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getPageIds()).toEqual(['page2', 'page1', 'page3', 'page4']);

    // Order to last.
    await fixture.events.keyboard.shortcut('shift+mod+right');
    expect(await getCurrentPageId()).toEqual('page2');
    expect(await getPageIds()).toEqual(['page1', 'page3', 'page4', 'page2']);
  });

  it('should delete the first page', async () => {
    await clickOnThumbnail(0);
    await fixture.events.keyboard.down('del');
    await fixture.events.keyboard.up('del');
    expect(await getPageIds()).toEqual(['page2', 'page3', 'page4']);
    expect(await getCurrentPageId()).toEqual('page2');
  });

  it('should delete the second page', async () => {
    await clickOnThumbnail(1);
    await fixture.events.keyboard.down('del');
    await fixture.events.keyboard.up('del');
    expect(await getPageIds()).toEqual(['page1', 'page3', 'page4']);
    expect(await getCurrentPageId()).toEqual('page3');
  });

  it('should duplicate the first page', async () => {
    await clickOnThumbnail(0);
    await fixture.events.keyboard.shortcut('mod+D');
    const newPageId = await getCurrentPageId();
    expect(await getPageIds()).toEqual([
      'page1',
      newPageId,
      'page2',
      'page3',
      'page4',
    ]);
  });
});
