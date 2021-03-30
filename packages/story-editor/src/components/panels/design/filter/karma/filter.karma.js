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
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';

describe('Filter Panel', () => {
  let fixture;
  let bgImageId;
  let filterPanel;
  let getBackgroundElementOverlay;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    // Drag first media element straight to canvas edge to set as background
    const media = fixture.editor.library.media.item(0);
    const canvas = fixture.editor.canvas.fullbleed.container;
    await fixture.events.mouse.seq(({ down, moveRel, up }) => [
      moveRel(media, 5, 5),
      down(),
      moveRel(canvas, 5, 5),
      up(),
    ]);

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    bgImageId = elements[0].id;

    filterPanel = fixture.editor.inspector.designPanel.filters;
    getBackgroundElementOverlay = () =>
      fixture.editor.canvas.displayLayer.display(bgImageId).overlay;
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator Can Manipulate an Image/Video on Canvas: Apply a solid or gradient overlay', () => {
    it('should render panel when there is an image in the background', () => {
      expect(filterPanel).toBeTruthy();
    });

    it('should not render an overlay when there is none', () => {
      expect(filterPanel.none.checked).toBeTruthy();
      expect(getBackgroundElementOverlay()).not.toBeTruthy();
    });

    it('should correctly show focus border only when using keyboard', async () => {
      // Click solid button
      await fixture.events.click(filterPanel.solid.button);

      // Verify button is clicked and has focus
      expect(filterPanel.solid.checked).toBeTruthy();
      expect(filterPanel.solid.node).toHaveFocus();

      // Verify an overlay has been added
      const overlay = await waitFor(getBackgroundElementOverlay);
      expect(overlay).toBeTruthy();

      // Screenshot it
      await fixture.snapshot(
        'BG has solid overlay, "solid" button is toggled and has no visible focus'
      );

      // shift-tab to none button
      await fixture.events.keyboard.shortcut('shift+tab');

      // Verify none button has focus
      expect(filterPanel.none.node).toHaveFocus();

      // Press space to activate none button
      await fixture.events.keyboard.press('Space');

      // Verify none button is toggled and overlay has been removed
      expect(getBackgroundElementOverlay()).not.toBeTruthy();
      expect(filterPanel.none.checked).toBeTruthy();

      // Screenshot it
      await fixture.snapshot(
        'BG has no overlay, "none" button is toggled and has visible focus'
      );
    });

    it('should render correct overlay when clicking "solid"', async () => {
      await fixture.events.click(filterPanel.solid.button);

      const overlay = await waitFor(getBackgroundElementOverlay);
      expect(overlay).toBeTruthy();
      expect(overlay).toHaveStyle('background-color', 'rgba(0, 0, 0, 0.3)');
    });

    it('should render correct overlay when clicking "linear"', async () => {
      await fixture.events.click(filterPanel.linear.button);

      const overlay = await waitFor(getBackgroundElementOverlay);
      expect(overlay).toBeTruthy();
      expect(overlay).toHaveStyle(
        'background-image',
        'linear-gradient(rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.9) 100%)'
      );
    });

    it('should render correct overlay when clicking "radial"', async () => {
      await fixture.events.click(filterPanel.radial.button);

      const overlay = await waitFor(getBackgroundElementOverlay);
      expect(overlay).toBeTruthy();
      expect(overlay).toHaveStyle(
        'background-image',
        'radial-gradient(80% 50%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.6) 100%)'
      );
    });
  });

  // Disable reason: tests not implemented yet
  // eslint-disable-next-line jasmine/no-disabled-tests
  xdescribe('CUJ: Creator Can Manipulate an Image/Video on Canvas: Set overlay color(s) & other gradient properties', () => {
    it('should render overlay color component iff it has an overlay');

    it('should render correct solid overlay as customized');

    it('should render correct linear gradient overlay as customized');

    it('should render correct radial gradient overlay as customized');
  });
});
