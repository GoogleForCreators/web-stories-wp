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
import { TEXT_ELEMENT_DEFAULT_FONT } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';
import { useInsertElement } from '..';

describe('PageMenu integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('add a text', () => {
    let element;

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      element = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'hello world!',
          x: 40,
          y: 40,
          width: 250,
        })
      );
      await fixture.editor.canvas.framesLayer.waitFocusedWithin();
    });

    function getFrame() {
      return fixture.editor.canvas.framesLayer.frame(element.id);
    }

    async function getSelection() {
      const storyContext = await fixture.renderHook(() => useStory());
      return storyContext.state.selectedElementIds;
    }

    it('should render initial content and make it selected', async () => {
      expect(getFrame().node.textContent).toEqual('hello world!');
      expect(await getSelection()).toEqual([element.id]);
    });

    describe('delete the element, restore, and delete again', () => {
      it('using shortcuts', async () => {
        // Delete.
        await fixture.events.keyboard.shortcut('del');
        expect(getFrame()).toBeNull();
        expect(await getSelection()).toEqual([]);

        // Restore.
        await fixture.events.keyboard.shortcut('mod+z');
        expect(getFrame()).toBeTruthy();
        expect(await getSelection()).toEqual([element.id]);

        // Delete again.
        await fixture.events.keyboard.shortcut('del');
        expect(getFrame()).toBeNull();
        expect(await getSelection()).toEqual([]);
      });

      it('using page menu', async () => {
        // Delete.
        await fixture.events.keyboard.shortcut('del');
        expect(getFrame()).toBeNull();
        expect(await getSelection()).toEqual([]);

        // Restore.
        // @todo: Use either `workspace.pageMenu.undoButton` or
        // `byRole('button', {name: 'Undo Changes'})` APIs.
        const undoButton = fixture.querySelector(
          'button[aria-label="Undo Changes"]'
        );
        await fixture.events.click(undoButton);
        expect(getFrame()).toBeTruthy();
        expect(await getSelection()).toEqual([element.id]);

        // Delete again.
        await fixture.events.keyboard.shortcut('del');
        expect(getFrame()).toBeNull();
        expect(await getSelection()).toEqual([]);
      });
    });
  });

  it('should render selection frame handles below page menu but allow click-through', async () => {
    // Add image
    const mediaItem = fixture.editor.library.media.item(0);
    await fixture.events.mouse.clickOn(mediaItem, 20, 20);

    // Press right-arrow 10 times to move it into correct location
    await Array.from(Array(10)).reduce(
      (p) => p.then(() => fixture.events.keyboard.press('right')),
      Promise.resolve()
    );

    // Snapshot it
    await fixture.snapshot();

    // Now click the image link button to confirm that a quick-action
    // button can receive pointer events
    await fixture.events.click(
      fixture.editor.canvas.quickActionMenu.addLinkButton
    );
    // Confirm by expecting link panel input to be focused
    expect(fixture.editor.sidebar.designPanel.link.address).toBe(
      document.activeElement
    );

    // Then drag right-handle of image to the left to confirm it
    // can also receive pointer events
    const image = fixture.editor.canvas.framesLayer.frames[1];
    const widthBefore = image.node.getBoundingClientRect().width;
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(image.node, '100%', '50%'),
      down(),
      moveBy(-100, 0, { steps: 10 }),
      up(),
    ]);
    const widthAfter = image.node.getBoundingClientRect().width;
    // Confirm by expecting frame width to have decreased
    expect(widthAfter).toBeLessThan(widthBefore);
  });
});
