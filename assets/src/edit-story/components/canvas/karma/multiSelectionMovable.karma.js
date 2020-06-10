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
import useInsertElement from '../useInsertElement';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';

describe('Multi-selection Movable integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('multi-selection', () => {
    let element1;
    let element2;
    let element3;
    let frame1;
    let frame2;
    let frame3;

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      element1 = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Text A',
          x: 10,
          y: 10,
          width: 50,
          height: 50,
        })
      );

      element2 = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Text B',
          x: 100,
          y: 100,
          width: 50,
          height: 50,
        })
      );

      element3 = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Text C',
          x: element1.x + element1.width + 1,
          y: element1.y + element1.height + 1,
          width: 20,
          height: 20,
        })
      );

      frame1 = getElementFrame(fixture, element1.id);
      frame2 = getElementFrame(fixture, element2.id);
      frame3 = getElementFrame(fixture, element3.id);
    });

    it('should render initial content', () => {
      expect(frame1.textContent).toEqual('Text A');
      expect(frame2.textContent).toEqual('Text B');
    });

    async function getSelection() {
      const storyContext = await fixture.renderHook(() => useStory());
      return storyContext.state.selectedElementIds;
    }

    describe('deleting element', () => {
      beforeEach(async () => {
        await clickOnTarget(fixture, frame1);
        await clickOnTarget(fixture, frame2, 'Shift');
      });

      it('should delete element that gets dragged out of the canvas to left while in multi-selection', async () => {
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(frame1, 5, 5),
          down(),
          moveBy(-60, 0, {
            steps: 6,
          }),
          up(),
        ]);
        expect(await getSelection()).toEqual([element2.id]);
      });

      it('should delete element that gets dragged out of the canvas to right while in multi-selection', async () => {
        const safezone = fixture.querySelector('[data-testid="safezone"]');
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(frame2, 5, 5),
          down(),
          moveBy(safezone.getBoundingClientRect().width - element1.width, 0, {
            steps: 10,
          }),
          up(),
        ]);
        expect(await getSelection()).toEqual([element1.id]);
      });
    });

    describe('click interaction', () => {
      let safezone;
      beforeEach(async () => {
        await clickOnTarget(fixture, frame1);
        await clickOnTarget(fixture, frame2, 'Shift');

        safezone = fixture.querySelector('[data-testid="safezone"]');
      });

      it('should have multiple elements selected', async () => {
        expect(await getSelection()).toEqual([element1.id, element2.id]);
      });

      it('should select one element when clicking in multi-selection', async () => {
        const { x, y } = safezone.getBoundingClientRect();
        await fixture.events.mouse.click(
          x + element1.x + 1,
          y + element1.y + 1
        );
        expect(await getSelection()).toEqual([element1.id]);
      });

      it('should select bg element when clicking out of the multi-selection', async () => {
        const { x, y } = safezone.getBoundingClientRect();
        await fixture.events.mouse.click(x + 200, y + 200);
        const storyContext = await fixture.renderHook(() => useStory());

        // Let's assure we have the background element (the first element) in the selection now.
        const background = storyContext.state.currentPage.elements[0];
        expect(storyContext.state.selectedElementIds).toEqual([background.id]);
      });

      it('should de-select all elements when clicking out of the page', async () => {
        const { x, y } = safezone.getBoundingClientRect();
        await fixture.events.mouse.click(x - 10, y - 10);
        expect(await getSelection()).toEqual([]);
      });

      it('should allow adding an element to selection in the middle of multi-selection', async () => {
        await clickOnTarget(fixture, frame3, 'Shift');
        expect(await getSelection()).toEqual([
          element1.id,
          element2.id,
          element3.id,
        ]);
      });

      it('should allow removing an element from multi-selection', async () => {
        // Remove element2 from multi-selection.
        await clickOnTarget(fixture, frame2, 'Shift');

        expect(await getSelection()).toEqual([element1.id]);
      });
    });
  });
});

function getElementFrame(fixture, id) {
  return fixture.querySelector(
    `[data-element-id="${id}"] [data-testid="textFrame"]`
  );
}

async function clickOnTarget(fixture, target, key = false) {
  const { x, y, width, height } = target.getBoundingClientRect();
  if (key) {
    await fixture.events.keyboard.down(key);
  }
  await fixture.events.mouse.click(x + width / 2, y + height / 2);
  if (key) {
    await fixture.events.keyboard.up(key);
  }
}
