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

describe('Snapping integration', () => {
  let element1;
  let frame1;
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    await fixture.events.click(fixture.editor.library.media.item(0));

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    element1 = elements[1].id;

    frame1 = fixture.editor.canvas.framesLayer.frame(element1).node;
  });

  describe('CUJ: Creator can transform an element: Snap to place', () => {
    it('should show design space guideline when moving align design space left edge', async () => {
      await fixture.events.mouse.seq(({ moveRel, moveBy, down }) => [
        moveRel(frame1, 10, 10),
        down(),
        moveBy(0, 20, { steps: 6 }),
      ]);

      await fixture.snapshot('Design space guideline visible');

      await fixture.events.mouse.up();

      await fixture.snapshot('Design space guideline hidden');
    });
  });
});
