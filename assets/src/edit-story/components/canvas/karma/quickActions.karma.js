/*
 * Copyright 2021 Google LLC
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
import { useStory } from '../../../app';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';
import { ACTION_TEXT } from '../../../app/highlights';
import { Fixture } from '../../../karma';
import useInsertElement from '../useInsertElement';

describe('Quick Actions integration', () => {
  let fixture;

  async function clickOnTarget(target) {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
  }

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableQuickActionMenus: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('menu visibility', () => {
    it('quick menu should not be visible if the canvas is overflowing', async () => {
      const { zoomSelector } = fixture.editor.carousel;

      await fixture.events.click(zoomSelector.select);
      await fixture.events.sleep(300);
      await fixture.events.click(await zoomSelector.option('Fill'));
      await fixture.events.sleep(300);

      expect(fixture.screen.queryByRole('dialog')).toBeNull();
    });
  });

  describe('quick action menu should have no aXe accessibility violations', () => {
    it('should pass accessibility tests with the default menu', async () => {
      await expectAsync(
        fixture.editor.canvas.quickActionMenu.node
      ).toHaveNoViolations();
    });
  });

  describe('no element selected', () => {
    it(`clicking the \`${ACTION_TEXT.CHANGE_BACKGROUND_COLOR}\` button should select the background and open the design panel`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.changeBackgroundColorButton
      );

      expect(
        fixture.editor.inspector.designPanel.pageBackground
      ).not.toBeNull();
      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.pageBackground.backgroundColorInput
      );
    });

    it(`clicking the \`${ACTION_TEXT.INSERT_BACKGROUND_MEDIA}\` button should select the background and open the media tab in the library`, async () => {
      // change the library pane so media isn't visible
      await fixture.events.click(fixture.editor.library.shapesTab);

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.insertBackgroundMediaButton
      );

      expect(fixture.editor.library.media).not.toBeNull();
      expect(document.activeElement).toEqual(fixture.editor.library.mediaTab);
    });

    it(`clicking the \`${ACTION_TEXT.INSERT_TEXT}\` button should select the background and open the text tab in the library`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.insertTextButton
      );

      expect(fixture.editor.library.text).not.toBeNull();
      expect(document.activeElement).toEqual(fixture.editor.library.textTab);
    });

    it('should allow clicking multiple actions', async () => {
      expect(fixture.editor.library.media).not.toBeNull();

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.changeBackgroundColorButton
      );

      expect(
        fixture.editor.inspector.designPanel.pageBackground
      ).not.toBeNull();

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.insertTextButton
      );

      expect(fixture.editor.library.text).not.toBeNull();
    });
  });

  describe('foreground image selected', () => {
    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const foregroundImage = await fixture.act(() =>
        insertElement('image', {
          x: 0,
          y: 0,
          width: 640 / 2,
          height: 529 / 2,
          resource: {
            type: 'image',
            mimeType: 'image/jpg',
            src: 'http://localhost:9876/__static__/earth.jpg',
          },
        })
      );

      await clickOnTarget(
        fixture.editor.canvas.framesLayer.frame(foregroundImage.id).node
      );
    });

    it(`clicking the \`${ACTION_TEXT.REPLACE_MEDIA}\` button should select select the media tab and focus the media tab`, async () => {
      // hide 3p modal before we click the quick action
      await fixture.events.click(fixture.editor.library.media3pTab);
      // tab to dismiss button and press enter
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('Enter');

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.replaceMediaButton
      );

      expect(fixture.editor.library.media).not.toBeNull();

      expect(document.activeElement).toEqual(fixture.editor.library.mediaTab);
    });

    it(`clicking the \`${ACTION_TEXT.ADD_ANIMATION}\` button should select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.inspector.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.animation.effectChooser
      );
    });

    it(`clicking the \`${ACTION_TEXT.ADD_LINK}\` button should select the link panel and focus the input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.inspector.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.link.address
      );
    });

    it(`clicking the \`${ACTION_TEXT.CLEAR_ANIMATION_AND_FILTERS}\` button should remove all animations. Clicking the undo button should reapply the animation.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeNull();

      // add animation to image
      const effectChooserToggle =
        fixture.editor.inspector.designPanel.animation.effectChooser;
      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Pulse" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // verify that element has animation
      const { animations: originalAnimations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );
      expect(originalAnimations.length).toBe(1);

      // click quick menu button
      await waitFor(() =>
        fixture.events.click(
          fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
        )
      );

      // verify that element has no animations
      const { animations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );

      expect(animations.length).toBe(0);
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeNull();

      // click `undo` button on snackbar
      await fixture.events.click(
        fixture.screen.getByRole('button', { name: /^Undo$/ })
      );

      // Verify that new animations match original animation
      const { animations: revertedAnimations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );
      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeDefined();
    });
  });

  describe('shape selected', () => {
    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const shapeElement = await fixture.act(() =>
        insertElement('shape', {
          backgroundColor: {
            color: {
              r: 203,
              g: 103,
              b: 103,
            },
          },
          type: 'shape',
          x: 48,
          y: 0,
          width: 148,
          height: 137,
          scale: 100,
          focalX: 50,
          focalY: 50,
          mask: {
            type: 'heart',
          },
          id: 'cb89750a-3ffd-4876-8ed9-d715c553e05b',
          link: null,
        })
      );

      await clickOnTarget(
        fixture.editor.canvas.framesLayer.frame(shapeElement.id).node
      );
    });

    it(`should select the \`${ACTION_TEXT.CHANGE_COLOR}\` button and select the shape style panel and focus the input`, async () => {
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.changeColorButton
      );

      expect(
        fixture.editor.inspector.designPanel.shapeStyle.backgroundColor
      ).not.toBeNull();
      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.shapeStyle.backgroundColor
      );
    });

    it(`should select the \`${ACTION_TEXT.ADD_ANIMATION}\` button and select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.inspector.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.animation.effectChooser
      );
    });

    it(`should click the \`${ACTION_TEXT.ADD_LINK}\` button and select the link panel and focus the input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.inspector.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.link.address
      );
    });

    it(`should click the \`${ACTION_TEXT.CLEAR_ANIMATION_AND_FILTERS}\` button and remove all animations, then click the undo button and reapply the animation.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeNull();

      // add animation to image
      const effectChooserToggle =
        fixture.editor.inspector.designPanel.animation.effectChooser;
      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Drop" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // verify that element has animation
      const { animations: originalAnimations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );

      await waitFor(() => {
        expect(originalAnimations.length).toBe(1);
      });

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      );

      // verify that element has no animations
      const { animations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );

      await waitFor(() => {
        expect(animations.length).toBe(0);
        expect(
          fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
        ).toBeNull();
      });

      // click `undo` button on snackbar
      await fixture.events.click(
        fixture.screen.getByRole('button', { name: /^Undo$/ })
      );

      // Verify that new animations match original animation
      const { animations: revertedAnimations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );
      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeDefined();
    });
  });

  describe('background image selected', () => {
    beforeEach(async () => {
      await addBackgroundImage(0);

      const {
        state: {
          currentPage: {
            elements: [{ id }],
          },
        },
      } = await fixture.renderHook(() => useStory());

      const canvasElementWrapperId = fixture.querySelector(
        `[data-testid="safezone"] [data-element-id="${id}"]`
      );

      await fixture.events.click(canvasElementWrapperId);
    });

    it(`clicking the \`${ACTION_TEXT.REPLACE_BACKGROUND_MEDIA}\` button should select select the media tab and focus the media tab`, async () => {
      // change tab to make sure tab isn't selected before quick action
      // hide 3p modal before we click the quick action
      await fixture.events.click(fixture.editor.library.mediaTab);
      // tab to dismiss button and press enter
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('Enter');

      const bgMediaButton =
        fixture.editor.canvas.quickActionMenu.replaceBackgroundMediaButton;
      expect(bgMediaButton).toBeDefined();

      // click quick menu button
      await fixture.events.click(bgMediaButton);

      expect(fixture.editor.library.media).not.toBeNull();

      expect(document.activeElement).toEqual(fixture.editor.library.mediaTab);
    });

    it(`clicking the \`${ACTION_TEXT.ADD_ANIMATION}\` button should select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.inspector.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.animation.effectChooser
      );
    });

    it(`clicking the \`${ACTION_TEXT.CLEAR_ANIMATION_AND_FILTERS}\` button should remove all animations and filters. Clicking the undo button should reapply the animation and filter.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeNull();

      // apply filter to background element
      await fixture.events.click(
        fixture.editor.inspector.designPanel.filters.linear
      );

      // add animation to image
      const effectChooserToggle =
        fixture.editor.inspector.designPanel.animation.effectChooser;
      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Pan and Zoom" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // verify that element has animation and filter
      const {
        animations: originalAnimations,
        selectedElement: originalSelectedElement,
      } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );

      await waitFor(() => {
        expect(originalAnimations.length).toBe(1);
        expect(originalSelectedElement.overlay.type).toBe('linear');
        expect(
          fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
        ).toBeDefined();
      });

      // click quick menu button
      await waitFor(() =>
        fixture.events.click(
          fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
        )
      );

      // verify that element has no animations
      const { animations, selectedElement } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );

      await waitFor(() => {
        expect(animations.length).toBe(0);
        expect(selectedElement.overlay).toBeNull();
        expect(
          fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
        ).toBeNull();
      });

      // click `undo` button on snackbar
      await fixture.events.click(
        fixture.screen.getByRole('button', { name: /^Undo$/ })
      );

      // Verify that new animations match original animation
      const {
        animations: revertedAnimations,
        selectedElement: revertedSelectedElement,
      } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );

      await waitFor(() => {
        expect(revertedAnimations.length).toBe(1);
        expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
        expect(revertedSelectedElement.overlay?.type).toEqual(
          originalSelectedElement.overlay?.type
        );

        expect(
          fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
        ).toBeDefined();
      });
    });
  });

  describe('text element selected', () => {
    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Hello world!',
          x: 10,
          y: 20,
          width: 400,
        })
      );

      await fixture.editor.canvas.framesLayer.waitFocusedWithin();
    });

    it(`clicking the \`${ACTION_TEXT.CHANGE_TEXT_COLOR}\` button should select the font styles on the design panel and focus the color input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.textColorButton
      );

      expect(fixture.editor.inspector.designPanel.textStyle).not.toBeNull();

      const textStyleColorInput = fixture.screen.queryByRole('textbox', {
        name: /^Text color$/,
      });
      expect(textStyleColorInput).toBeDefined();
      expect(document.activeElement).toEqual(textStyleColorInput);
    });

    it(`clicking the \`${ACTION_TEXT.CHANGE_FONT}\` button should select the font styles on the design panel and focus the font dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.fontButton
      );

      expect(fixture.editor.inspector.designPanel.textStyle).not.toBeNull();

      const fontDropdown = fixture.screen.queryByRole('button', {
        name: /^Font family$/,
      });
      expect(fontDropdown).toBeDefined();
      expect(document.activeElement).toEqual(fontDropdown);
    });

    it(`clicking the \`${ACTION_TEXT.ADD_ANIMATION}\` button should select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.inspector.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.animation.effectChooser
      );
    });

    it(`clicking the \`${ACTION_TEXT.ADD_LINK}\` button should select the link panel and focus the input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.inspector.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.link.address
      );
    });

    it(`clicking the \`${ACTION_TEXT.CLEAR_ANIMATIONS}\` button should remove all animations. Clicking the undo button should reapply the animation.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationsButton
      ).toBeNull();

      // add animation to image
      const effectChooserToggle =
        fixture.editor.inspector.designPanel.animation.effectChooser;
      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Pulse" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // verify that element has animation
      const { animations: originalAnimations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );
      expect(originalAnimations.length).toBe(1);

      // click quick menu button
      await waitFor(() =>
        fixture.events.click(
          fixture.editor.canvas.quickActionMenu.clearAnimationsButton
        )
      );

      // verify that element has no animations
      const { animations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );
      expect(animations.length).toBe(0);
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationsButton
      ).toBeNull();

      // click `undo` button on snackbar
      await fixture.events.click(
        fixture.screen.getByRole('button', { name: /^Undo$/ })
      );

      // Verify that new animations match original animation
      const { animations: revertedAnimations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );

      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationsButton
      ).toBeDefined();
    });
  });

  async function addBackgroundImage(index) {
    // Drag image to canvas corner to set as background
    const image = fixture.editor.library.media.item(index);
    const canvas = fixture.editor.canvas.framesLayer.fullbleed;

    await fixture.events.mouse.seq(({ down, moveRel, up }) => [
      moveRel(image, 20, 20),
      down(),
      moveRel(canvas, 10, 10),
      up(),
    ]);
  }

  describe('video selected', () => {
    beforeEach(async () => {
      const videoElement = {
        resource: {
          type: 'video',
          mimeType: 'video/webm',
          creationDate: '2021-05-21T00:09:18',
          src: 'http://localhost:8899/wp-content/uploads/2021/05/small-video-10.webm',
          width: 560,
          height: 320,
          poster:
            'http://localhost:8899/wp-content/uploads/2021/05/small-video-poster-10.jpg',
          posterId: 11,
          id: 10,
          length: 6,
          lengthFormatted: '0:06',
          title: 'small-video',
          alt: 'small-video',
          sizes: {},
          local: false,
          isOptimized: false,
          baseColor: [115, 71, 39],
        },
        controls: false,
        loop: false,
        autoPlay: true,
        tracks: [],
        type: 'video',
        x: 66,
        y: 229,
        width: 280,
        height: 160,
        id: '6e7f5de8-7793-4aef-8835-c1d32477b4e0',
      };
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const foregroundVideo = await fixture.act(() =>
        insertElement('video', videoElement)
      );

      await clickOnTarget(
        fixture.editor.canvas.framesLayer.frame(foregroundVideo.id).node
      );
    });

    it(`should click the \`${ACTION_TEXT.REPLACE_MEDIA}\` button and open the media panel`, async () => {
      // hide 3p modal before we click the quick action
      await fixture.events.click(fixture.editor.library.media3pTab);
      // tab to dismiss button and press enter
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('Enter');

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.replaceMediaButton
      );

      expect(fixture.editor.library.media).not.toBeNull();

      expect(document.activeElement).toEqual(fixture.editor.library.mediaTab);
    });

    it(`should click the \`${ACTION_TEXT.ADD_ANIMATION}\` button and open the animation panel and focus the animation dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.inspector.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.animation.effectChooser
      );
    });

    it(`should click the \`${ACTION_TEXT.ADD_LINK}\` button and select the link panel and focus the input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.inspector.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.inspector.designPanel.link.address
      );
    });

    it(`should click the \`${ACTION_TEXT.ADD_CAPTIONS}\` button and open the captions panel and focus the add captions input`, async () => {
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addCaptionsButton
      );
      expect(
        fixture.editor.inspector.designPanel.captions.addCaptionsButton
      ).not.toBeNull();
    });

    it(`should click the \`${ACTION_TEXT.CLEAR_ANIMATION_AND_FILTERS}\` button and remove all animations and styles, then click the undo button and reapply the animation and styles`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeNull();

      // add animation to image
      const effectChooserToggle =
        fixture.editor.inspector.designPanel.animation.effectChooser;
      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Drop" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // add a border
      const panel = fixture.editor.inspector.designPanel.border;

      await fixture.events.click(panel.width(), { clickCount: 3 });
      await fixture.events.keyboard.type('10');
      await fixture.events.keyboard.press('Tab');

      // verify that element has animation and style
      const { animations: originalAnimations, elements: originalElements } =
        await fixture.renderHook(() =>
          useStory(({ state }) => ({
            animations: state.pages[0].animations,
            elements: state.pages[0].elements,
          }))
        );

      const videoWithBorder = originalElements.find((el) => el.type == 'video');
      await waitFor(() => {
        expect(videoWithBorder.border).not.toBeUndefined();
        expect(originalAnimations.length).toBe(1);
      });

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      );

      // verify that element has no animations or border
      const { animations, elements } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          elements: state.pages[0].elements,
        }))
      );
      const video = elements.find((el) => el.type === 'video');
      expect(video.border).toBeNull();
      expect(animations.length).toBe(0);
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeNull();

      // click `undo` button on snackbar
      await fixture.events.click(
        fixture.screen.getByRole('button', { name: /^Undo$/ })
      );

      // Verify that new animations match original animation
      const { animations: revertedAnimations, elements: revertedElements } =
        await fixture.renderHook(() =>
          useStory(({ state }) => ({
            animations: state.pages[0].animations,
            elements: state.pages[0].elements,
          }))
        );
      const revertedVideo = revertedElements.find((el) => el.type === 'video');
      expect(revertedVideo.border).not.toBeUndefined();
      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(
        fixture.editor.canvas.quickActionMenu.clearAnimationAndFiltersButton
      ).toBeDefined();
    });
  });
});
