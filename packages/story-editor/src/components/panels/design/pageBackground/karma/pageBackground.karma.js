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
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';

describe('Page background panel', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator Can Manipulate an Image/Video on Canvas: Remove background media', () => {
    it('should select page after removing background media', async () => {
      const bgFrame = fixture.editor.canvas.framesLayer.frames[0].node;
      const mediaItem = fixture.editor.library.media.item(0);
      await fixture.events.mouse.seq(({ moveRel, down, up }) => [
        moveRel(mediaItem, 20, 20),
        down(),
        moveRel(bgFrame, 15, 15, { steps: 30 }),
        up(),
      ]);

      // Allow the background to be set.
      await fixture.events.sleep(300);
      await fixture.events.click(fixture.editor.sidebar.designTab);
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.pageBackground.detachBg
      );
      const storyContext = await fixture.renderHook(() => useStory());
      expect(
        storyContext.state.selectedElements[0].isDefaultBackground
      ).toBeTrue();
    });
  });
});
