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
    let frame1;
    let frame2;

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

      frame1 = fixture.querySelector(
        `[data-element-id="${element1.id}"] [data-testid="textFrame"]`
      );

      frame2 = fixture.querySelector(
        `[data-element-id="${element2.id}"] [data-testid="textFrame"]`
      );
    });

    it('should render initial content', () => {
      expect(frame1.textContent).toEqual('Text A');
      expect(frame2.textContent).toEqual('Text B');
    });

    it('should multi-select elements on Shift + click', async () => {
      await fixture.events.click(frame1);
      await fixture.events.keyboard.down('Shift');
      await fixture.events.click(frame2);
      await fixture.events.keyboard.up('Shift');

      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElementIds).toEqual([
        element1.id,
        element2.id,
      ]);
    });

    describe('click interaction', () => {
      let safezone;
      beforeEach(async () => {
        await fixture.events.click(frame1);
        await fixture.events.keyboard.down('Shift');
        await fixture.events.click(frame2);
        await fixture.events.keyboard.up('Shift');

        safezone = fixture.querySelector('[data-testid="safezone"]');
      });

      it('should select one element when clicking in multi-selection', async () => {
        const { x, y } = safezone.getBoundingClientRect();
        await fixture.events.mouse.move(x + element1.x + 1, y + element1.y + 1);
        await fixture.events.mouse.down();
        await fixture.events.mouse.up();
        const storyContext = await fixture.renderHook(() => useStory());
        expect(storyContext.state.selectedElementIds).toEqual([element1.id]);
      });

      it('should select bg element when clicking out of the multi-selection', async () => {
        const { x, y } = safezone.getBoundingClientRect();
        await fixture.events.mouse.move(x + 200, y + 200);
        await fixture.events.mouse.down();
        await fixture.events.mouse.up();
        const storyContext = await fixture.renderHook(() => useStory());

        // Let's assure we have the background element (the first element) in the selection now.
        const background = safezone.firstChild;
        expect(storyContext.state.selectedElementIds).toEqual([
          background.getAttribute('data-element-id'),
        ]);
      });

      it('should de-select all elements when clicking out of the page', async () => {
        const { x, y } = safezone.getBoundingClientRect();
        await fixture.events.mouse.move(x - 10, y - 10);
        await fixture.events.mouse.down();
        await fixture.events.mouse.up();
        const storyContext = await fixture.renderHook(() => useStory());
        expect(storyContext.state.selectedElementIds).toEqual([]);
      });
    });
  });
});
