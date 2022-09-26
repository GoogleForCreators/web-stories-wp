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
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getElements() {
    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    return elements;
  }

  describe('CUJ: Creator Can Manipulate an Image/Video on Canvas: Apply a solid or gradient overlay', () => {
    describe('background', () => {
      beforeEach(async () => {
        // Drag first media element straight to canvas edge to set as background
        const media = fixture.editor.library.media.item(0);
        const canvas = fixture.editor.canvas.framesLayer.fullbleed;
        await fixture.events.mouse.seq(({ down, moveRel, up }) => [
          moveRel(media, 20, 20),
          down(),
          moveRel(canvas, 5, 5),
          up(),
        ]);

        const elements = await getElements();
        bgImageId = elements[0].id;

        await fixture.events.click(fixture.editor.sidebar.designTab);
        filterPanel = fixture.editor.sidebar.designPanel.filters;
        getBackgroundElementOverlay = () =>
          fixture.editor.canvas.displayLayer.display(bgImageId).overlay;
      });

      it('should render panel when there is an image in the background', () => {
        expect(filterPanel).toBeTruthy();
      });

      it('should not render an overlay when there is none', () => {
        expect(filterPanel.none.getAttribute('aria-pressed')).toBeTruthy();
        expect(getBackgroundElementOverlay()).not.toBeTruthy();
      });

      it('should correctly show focus border only when using keyboard', async () => {
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

      it('should render correct overlay when clicking "solid"', async () => {
        await fixture.events.click(filterPanel.solid);

        const overlay = await waitFor(getBackgroundElementOverlay);
        expect(overlay).toBeTruthy();
        expect(overlay).toHaveStyle('background-color', 'rgba(0, 0, 0, 0.5)');
      });

      it('should render correct overlay when clicking "linear"', async () => {
        await fixture.events.click(filterPanel.linear);

        const overlay = await waitFor(getBackgroundElementOverlay);
        expect(overlay).toBeTruthy();
        expect(overlay).toHaveStyle(
          'background-image',
          'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
        );
      });

      it('should render correct overlay when clicking "radial"', async () => {
        await fixture.events.click(filterPanel.radial);

        const overlay = await waitFor(getBackgroundElementOverlay);
        expect(overlay).toBeTruthy();
        expect(overlay).toHaveStyle(
          'background-image',
          'radial-gradient(67% 67%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)'
        );
      });
    });

    describe('media elements', () => {
      let elements;
      beforeEach(async () => {
        const mediaItem = fixture.editor.library.media.item(0);
        await fixture.events.mouse.clickOn(mediaItem, 20, 20);
        await fixture.events.click(fixture.editor.sidebar.designTab);
        filterPanel = fixture.editor.sidebar.designPanel.filters;
      });

      it('should display the filter panel for non-bg media', () => {
        expect(filterPanel).toBeTruthy();
      });

      it('should apply correct overlay when clicking "solid"', async () => {
        await fixture.events.click(filterPanel.solid);

        elements = await getElements();
        expect(elements[1].overlay).toEqual({
          color: { r: 0, g: 0, b: 0, a: 0.5 },
        });
      });

      it('should apply correct overlay when clicking "linear"', async () => {
        await fixture.events.click(filterPanel.linear);

        elements = await getElements();
        expect(elements[1].overlay).toEqual({
          type: 'linear',
          rotation: 0,
          stops: [
            { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
          ],
          alpha: 0.7,
        });
      });

      it('should apply correct overlay when clicking "radial"', async () => {
        await fixture.events.click(filterPanel.radial);

        elements = await getElements();
        expect(elements[1].overlay).toEqual({
          type: 'radial',
          size: { w: 0.67, h: 0.67 },
          stops: [
            { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
            { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
          ],
          alpha: 0.7,
        });
      });
    });
  });

  // eslint-disable-next-line jasmine/no-disabled-tests -- tests not implemented yet
  xdescribe('CUJ: Creator Can Manipulate an Image/Video on Canvas: Set overlay color(s) & other gradient properties', () => {
    it('should render overlay color component iff it has an overlay');

    it('should render correct solid overlay as customized');

    it('should render correct linear gradient overlay as customized');

    it('should render correct radial gradient overlay as customized');
  });
});
