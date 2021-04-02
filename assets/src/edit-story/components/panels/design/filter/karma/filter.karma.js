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

fdescribe('Filter Panel', () => {
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
      moveRel(media, 25, 25),
      down(),
      moveRel(canvas, 5, 5),
    ]);

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    bgImageId = elements[0].id;

    //filterPanel = fixture.editor.inspector.designPanel.filters;
    getBackgroundElementOverlay = () =>
      fixture.editor.canvas.displayLayer.display(bgImageId).overlay;
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator Can Manipulate an Image/Video on Canvas: Apply a solid or gradient overlay', () => {
    //TODO #6952
    // eslint-disable-next-line jasmine/no-disabled-tests
    fit('should render panel when there is an image in the background', async () => {
      await fixture.snapshot('TESTING!');
      //expect(filterPanel).toBeTruthy();
    });

    //TODO #6952
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should not render an overlay when there is none', () => {
      expect(filterPanel.none.getAttribute('aria-pressed')).toBeTruthy();
      expect(getBackgroundElementOverlay()).not.toBeTruthy();
    });

    // TODO #6951
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should correctly show focus border only when using keyboard', async () => {
      // Click solid button
      await fixture.events.click(filterPanel.solid);

      // Verify button is clicked and has focus
      expect(filterPanel.solid.getAttribute('aria-pressed')).toBeTruthy();
      expect(filterPanel.solid).toHaveFocus();

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
      expect(filterPanel.none).toHaveFocus();

      // Press space to activate none button
      await fixture.events.keyboard.press('Space');

      // Verify none button is toggled and overlay has been removed
      expect(getBackgroundElementOverlay()).not.toBeTruthy();
      expect(filterPanel.none.getAttribute('aria-pressed')).toBeTruthy();

      // Screenshot it
      await fixture.snapshot(
        'BG has no overlay, "none" button is toggled and has visible focus'
      );
    });
    // TODO #6952
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should render correct overlay when clicking "solid"', async () => {
      await fixture.events.click(filterPanel.solid);

      const overlay = await waitFor(getBackgroundElementOverlay);
      expect(overlay).toBeTruthy();
      expect(overlay).toHaveStyle('background-color', 'rgba(0, 0, 0, 0.5)');
    });
    // TODO #6952
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should render correct overlay when clicking "linear"', async () => {
      await fixture.events.click(filterPanel.linear);

      const overlay = await waitFor(getBackgroundElementOverlay);
      expect(overlay).toBeTruthy();
      expect(overlay).toHaveStyle(
        'background-image',
        'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
      );
    });
    // TODO #6952
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should render correct overlay when clicking "radial"', async () => {
      await fixture.events.click(filterPanel.radial);

      const overlay = await waitFor(getBackgroundElementOverlay);
      expect(overlay).toBeTruthy();
      expect(overlay).toHaveStyle(
        'background-image',
        'radial-gradient(67% 67%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
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
