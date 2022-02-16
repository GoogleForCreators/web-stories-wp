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
import { useStory } from '../../../app';

describe('Library Media Tab', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator Can Add Image/Video to Page: Can add media', () => {
    it('should not add media when dragged out of Page from the library', async () => {
      const bgFrame = fixture.editor.canvas.framesLayer.frames[0].node;
      const mediaItem = fixture.editor.library.media.item(0);

      const { width } = mediaItem.getBoundingClientRect();

      await fixture.events.mouse.seq(({ moveRel, down, up }) => [
        moveRel(mediaItem, 20, 20),
        down(),
        moveRel(bgFrame, -width, 0, { steps: 30 }),
        up(),
      ]);

      // Only background, no media added.
      expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);
    });
  });

  describe('CUJ: Creator Can Add Image/Video to Page: Can manage media', () => {
    it('should open the dropdown menu', async () => {
      const mediaIndex = 0;
      const mediaItem = fixture.editor.library.media.item(mediaIndex);
      // Hover the media
      await fixture.events.mouse.moveRel(mediaItem, 20, 20, { steps: 2 });
      const menuButtons = await fixture.screen.findAllByRole('button', {
        name: 'More',
      });
      const moreButton = menuButtons[mediaIndex];
      await fixture.events.click(moreButton);
      expect(
        fixture.screen.getByRole('menuitem', { name: 'Edit meta data' })
      ).toBeDefined();
      expect(
        fixture.screen.getByRole('menuitem', { name: 'Delete from library' })
      ).toBeDefined();
    });

    it('should allow setting media as background from the insertion menu', async () => {
      const mediaIndex = 0;
      const mediaItem = fixture.editor.library.media.item(mediaIndex);
      // Hover the media
      await fixture.events.mouse.moveRel(mediaItem, 20, 20, { steps: 2 });
      const menuButtons = await fixture.screen.findAllByRole('button', {
        name: 'Open insertion menu',
      });
      const insertionButton = menuButtons[mediaIndex];
      await fixture.events.click(insertionButton);

      await fixture.events.click(
        fixture.screen.getByRole('menuitem', { name: 'Add as background' })
      );

      const storyContext = await fixture.renderHook(() => useStory());
      const [background] = storyContext.state.selectedElements;
      expect(background.type).toBe('image');
      expect(background.resource.src).toMatch(/^http.+\/blue-marble.jpg$/);
    });
  });
});
