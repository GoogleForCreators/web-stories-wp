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

describe('Library Media Tab', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
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
        moveRel(mediaItem, 10, 10),
        down(),
        moveRel(bgFrame, -width, 0, { steps: 30 }),
        up(),
      ]);

      // Only background, no media added.
      expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);
    });
  });

  describe('CUJ: Creator Can Add Image/Video to Page: Can edit/delete media', () => {
    it('should open the edit/delete menu', async () => {
      const mediaItem = fixture.editor.library.media.item(0);
      // Hover the media
      await fixture.events.mouse.moveRel(mediaItem, 10, 10, { steps: 2 });
      await waitFor(() =>
        expect(
          fixture.screen.getByRole('button', { name: 'More' })
        ).toBeDefined()
      );
      const moreButton = fixture.screen.getByRole('button', { name: 'More' });
      await fixture.events.mouse.seq(({ moveRel, down, up }) => [
        moveRel(moreButton, 5, 5),
        down(),
        up(),
      ]);
      expect(
        fixture.screen.getByRole('menuitem', { name: 'Edit' })
      ).toBeDefined();
      expect(
        fixture.screen.getByRole('menuitem', { name: 'Delete' })
      ).toBeDefined();
    });
  });
});
