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
import { TEXT_ELEMENT_DEFAULT_FONT } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { ACTIONS } from '../../../app/highlights';
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
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('menu visibility', () => {
    it('quick menu should not be visible if the canvas is overflowing', async () => {
      const { zoomSelector } = fixture.editor.footer;

      await fixture.events.click(zoomSelector.select);
      await fixture.events.sleep(300);
      await fixture.events.click(await zoomSelector.option('Fill'));
      await fixture.events.sleep(300);

      expect(fixture.screen.queryByTestId('quick-actions-menu')).toBeNull();
    });

    it('quick menu should not be visible if no quick actions are present', async () => {
      // when two different elements types are selected, there may not be any quick actions to show
      // in that case, we shouldn't be rendering the context menu at all
      // add shape to canvas
      await fixture.editor.library.shapesTab.click();
      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );

      // add text to canvas
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await fixture.editor.canvas.framesLayer.waitFocusedWithin();

      expect(
        fixture.screen.queryByTestId('Element quick actions')
      ).not.toBeNull();

      // select both text and shape elements
      await fixture.events.keyboard.down('Shift');
      const triangle = fixture.editor.canvas.framesLayer.frames[1].node;
      await clickOnTarget(triangle);
      await fixture.events.keyboard.up('Shift');

      expect(fixture.screen.queryByTestId('Element quick actions')).toBeNull();
    });
  });

  describe('quick action menu should have no aXe accessibility violations', () => {
    it('should have no aXe violations with the default menu', async () => {
      await expectAsync(
        fixture.editor.canvas.quickActionMenu.node
      ).toHaveNoViolations();
    });
  });

  describe('no element selected', () => {
    it(`clicking the \`${ACTIONS.CHANGE_BACKGROUND_COLOR.text}\` button should select the background and open the design panel`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.changeBackgroundColorButton
      );

      expect(fixture.editor.sidebar.designPanel.pageBackground).not.toBeNull();
      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.pageBackground.backgroundColorInput
      );
    });

    it(`clicking the \`${ACTIONS.INSERT_BACKGROUND_MEDIA.text}\` button should select the background and open the media tab in the library`, async () => {
      // change the library pane so media isn't visible
      await fixture.events.click(fixture.editor.library.shapesTab);

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.insertBackgroundMediaButton
      );

      expect(fixture.editor.library.media).not.toBeNull();
      expect(document.activeElement).toEqual(fixture.editor.library.mediaTab);
    });

    it(`clicking the \`${ACTIONS.INSERT_TEXT.text}\` button should select the background, open the text tab in the library and insert the default text`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.insertTextButton
      );
      expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);
      expect(fixture.editor.library.text).not.toBeNull();
      expect(document.activeElement).toEqual(fixture.editor.library.textTab);
    });

    it('should allow clicking multiple actions', async () => {
      expect(fixture.editor.library.media).not.toBeNull();

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.changeBackgroundColorButton
      );

      expect(fixture.editor.sidebar.designPanel.pageBackground).not.toBeNull();

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
            id: 10,
            type: 'image',
            mimeType: 'image/jpg',
            src: 'http://localhost:9876/__static__/earth.jpg',
            alt: 'earth',
            width: 640,
            height: 529,
            baseColor: '#734727',
          },
        })
      );

      await clickOnTarget(
        fixture.editor.canvas.framesLayer.frame(foregroundImage.id).node
      );
    });

    it(`should replace the media using the \`${ACTIONS.REPLACE_MEDIA.text}\` quick action`, async () => {
      // track initial media
      const { initialCurrentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          initialCurrentPage: state.currentPage,
        }))
      );

      const { resource: initialResource, ...initialElement } =
        initialCurrentPage.elements.find((element) => !element.isBackground);

      // click replace media button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.replaceMediaButton
      );

      // fixture replaces media automatically
      // verify that media was replaced
      const { currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );

      const { resource: finalResource, ...finalElement } =
        currentPage.elements.find((element) => !element.isBackground);

      // everything should be the same except the resource
      expect(initialElement).toEqual(finalElement);
      expect(initialResource).not.toEqual(finalResource);
      expect(finalElement.type).toEqual(finalResource.type);
    });

    it(`clicking the \`${ACTIONS.ADD_ANIMATION.text}\` button should select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.sidebar.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.animation.effectChooser
      );
    });

    it(`clicking the \`${ACTIONS.ADD_LINK.text}\` button should select the link panel and focus the input`, async () => {
      // click quick menu button

      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.sidebar.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.link.address
      );
    });

    it(`should add animations and filters to the foreground image, click the \`${ACTIONS.RESET_ELEMENT.text}\` button, clear the animations and filters, then click Undo and reapply the animations and filters.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // add animation to image
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const effectChooserToggle =
        fixture.editor.sidebar.designPanel.animation.effectChooser;

      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Pulse" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // the bot clicks the clear button too fast
      // the animation does not get removed if it is clicked before it stops playing
      // click "stop playing" and test the animations have been applied
      await waitFor(
        async () => {
          await fixture.events.click(
            fixture.screen.getByRole('button', { name: 'Stop Page Animations' })
          );
        },
        { timeout: 4000 }
      );

      // apply filter
      await fixture.events.click(fixture.editor.sidebar.designTab);
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.filters.linear
      );

      // verify the animations and styles were added
      let originalAnimations = [];
      let originalSelectedElement = null;
      await waitFor(async () => {
        const story = await fixture.renderHook(() =>
          useStory(({ state }) => ({
            animations: state.pages[0].animations,
            selectedElement: state.selectedElements[0],
          }))
        );
        ({
          animations: originalAnimations,
          selectedElement: originalSelectedElement,
        } = story);

        if (!originalSelectedElement) {
          throw new Error('story not ready');
        }

        expect(originalSelectedElement.overlay.type).toBe('linear');
        expect(originalAnimations.length).toEqual(1);
      });

      // reset the element
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      );

      // verify that element has no animations or styles
      const { animations, selectedElement } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );
      expect(animations.length).toBe(0);
      expect(selectedElement.overlay).toBeNull();
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // wait for the undo button to appear
      await fixture.screen.findByRole('button', {
        name: /^Undo$/,
        hidden: true,
        timeout: 4000,
      });
      // click `undo` button on snackbar
      await fixture.events.click(
        await fixture.screen.findByRole('button', {
          name: /^Undo$/,
          hidden: true,
        })
      );

      // Verify that new animations and styles match original animation
      const {
        animations: revertedAnimations,
        selectedElement: revertedSelectedElement,
      } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );
      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(revertedSelectedElement.overlay.type).toEqual(
        originalSelectedElement.overlay.type
      );
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
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

    it(`should select the \`${ACTIONS.ADD_ANIMATION.text}\` button and select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.sidebar.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.animation.effectChooser
      );
    });

    it(`should click the \`${ACTIONS.ADD_LINK.text}\` button and select the link panel and focus the input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.sidebar.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.link.address
      );
    });

    it(`should add animations and filters to the shape, click the \`${ACTIONS.RESET_ELEMENT.text}\` button, clear the animations and filters, then click Undo and reapply the animations and filters.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // add animation to shape
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const effectChooserToggle =
        fixture.editor.sidebar.designPanel.animation.effectChooser;

      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Pulse" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // the bot clicks the clear button too fast
      // the animation does not get removed if it is clicked before it stops playing
      // click "stop playing" and test the animations have been applied
      await waitFor(async () => {
        await fixture.events.click(
          await fixture.screen.findByRole('button', {
            name: 'Stop Page Animations',
          })
        );
      });

      // add styles to the shape
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.sizePosition.opacity
      );
      await fixture.events.keyboard.type('99');
      await fixture.events.keyboard.press('Enter');

      // verify the animations and styles were added
      let originalAnimations = [];
      let originalSelectedElement = null;
      await waitFor(async () => {
        const story = await fixture.renderHook(() =>
          useStory(({ state }) => ({
            animations: state.pages[0].animations,
            selectedElement: state.selectedElements[0],
          }))
        );
        ({
          animations: originalAnimations,
          selectedElement: originalSelectedElement,
        } = story);

        if (!originalSelectedElement) {
          throw new Error('story not ready');
        }

        expect(originalAnimations.length).toEqual(1);
        expect(originalSelectedElement.opacity).toEqual(99);
      });

      // reset the element
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      );

      // verify that element has no animations or styles
      const { animations, selectedElement } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );
      expect(animations.length).toBe(0);
      expect(selectedElement.opacity).toEqual(100);
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // wait for the undo button to appear
      await fixture.screen.findByRole('button', {
        name: /^Undo$/,
        hidden: true,
        timeout: 4000,
      });
      // click `undo` button on snackbar
      await fixture.events.click(
        await fixture.screen.findByRole('button', {
          name: /^Undo$/,
          hidden: true,
        })
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
      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(revertedSelectedElement.opacity).toEqual(
        originalSelectedElement.opacity
      );
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
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

    it(`should replace the background media when clicking the \`${ACTIONS.REPLACE_BACKGROUND_MEDIA.text}\` action`, async () => {
      // track initial media
      const { initialCurrentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          initialCurrentPage: state.currentPage,
        }))
      );

      const { resource: initialResource, ...initialElement } =
        initialCurrentPage.elements.find((element) => element.isBackground);

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.replaceBackgroundMediaButton
      );

      // verify that media was replaced
      const { currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );

      const { resource: finalResource, ...finalElement } =
        currentPage.elements.find((element) => element.isBackground);

      // everything should be the same except the resource
      expect(initialElement).toEqual(finalElement);
      expect(initialResource).not.toEqual(finalResource);
      expect(finalElement.type).toEqual(finalResource.type);
    });

    it(`clicking the \`${ACTIONS.ADD_ANIMATION.text}\` button should select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.sidebar.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.animation.effectChooser
      );
    });

    it(`should add animations and filters to the background image, click the \`${ACTIONS.RESET_ELEMENT.text}\` button, clear the animations and filters, then click Undo and reapply the animations and filters.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // add animation to background image
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const effectChooserToggle =
        fixture.editor.sidebar.designPanel.animation.effectChooser;

      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Pan and Zoom" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // the bot clicks the clear button too fast
      // the animation does not get removed if it is clicked before it stops playing
      // click "stop playing" and test the animations have been applied
      await waitFor(async () => {
        await fixture.events.click(
          await fixture.screen.findByRole('button', {
            name: 'Stop Page Animations',
          })
        );
      });

      // apply filter
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.filters.linear
      );

      // verify the styles were added
      let originalAnimations = [];
      let originalSelectedElement = null;
      await waitFor(async () => {
        const story = await fixture.renderHook(() =>
          useStory(({ state }) => ({
            animations: state.pages[0].animations,
            selectedElement: state.selectedElements[0],
          }))
        );
        ({
          animations: originalAnimations,
          selectedElement: originalSelectedElement,
        } = story);

        if (!originalSelectedElement) {
          throw new Error('story not ready');
        }

        expect(originalSelectedElement.overlay.type).toBe('linear');
        expect(originalAnimations.length).toEqual(1);
      });

      // reset the element
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      );

      // verify that element has no animations or styles
      const { animations, selectedElement } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );
      expect(animations.length).toBe(0);
      expect(selectedElement.overlay).toBeNull();
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // wait for the undo button to appear
      await fixture.screen.findByRole('button', {
        name: /^Undo$/,
        hidden: true,
      });
      // click `undo` button on snackbar
      await fixture.events.click(
        await fixture.screen.findByRole('button', {
          name: /^Undo$/,
          hidden: true,
        })
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
      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(revertedSelectedElement.overlay.type).toEqual(
        originalSelectedElement.overlay.type
      );
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
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

    it(`clicking the \`${ACTIONS.ADD_ANIMATION.text}\` button should select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.sidebar.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.animation.effectChooser
      );
    });

    it(`clicking the \`${ACTIONS.ADD_LINK.text}\` button should select the link panel and focus the input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.sidebar.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.link.address
      );
    });

    it(`should add animations to the text, click the \`${ACTIONS.RESET_ELEMENT.text}\` button, clear the animations, then click Undo and reapply the animations and filters.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // add animation to text
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const effectChooserToggle =
        fixture.editor.sidebar.designPanel.animation.effectChooser;

      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Drop" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // the bot clicks the clear button too fast
      // the animation does not get removed if it is clicked before it stops playing
      // click "stop playing" and test the animations have been applied
      await waitFor(async () => {
        await fixture.events.click(
          await fixture.screen.findByRole('button', {
            name: 'Stop Page Animations',
          })
        );
      });

      // verify animations were added
      let originalAnimations = [];
      await waitFor(async () => {
        const story = await fixture.renderHook(() =>
          useStory(({ state }) => ({
            animations: state.pages[0].animations,
          }))
        );
        ({ animations: originalAnimations } = story);

        if (originalAnimations.length === 0) {
          throw new Error('story not ready');
        }

        expect(originalAnimations.length).toEqual(1);
      });

      // reset the element
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      );

      // verify that element has no animations
      const { animations } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
        }))
      );
      expect(animations.length).toBe(0);
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // wait for the undo button to appear

      await fixture.screen.findByRole('button', {
        name: /^Undo$/,
        hidden: true,
      });
      // click `undo` button on snackbar
      await fixture.events.click(
        await fixture.screen.findByRole('button', {
          name: /^Undo$/,
          hidden: true,
        })
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
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeDefined();
    });
  });

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
          alt: 'small-video',
          sizes: {},
          isOptimized: false,
          baseColor: '#734727',
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

    it(`should replace the media using the \`${ACTIONS.REPLACE_MEDIA.text}\` quick action`, async () => {
      // track initial media
      const { initialCurrentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          initialCurrentPage: state.currentPage,
        }))
      );

      const {
        resource: initialResource,
        type: initialType,
        ...initialElement
      } = initialCurrentPage.elements.find((element) => !element.isBackground);

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.replaceMediaButton
      );

      // verify that media was replaced
      const { currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );

      const {
        resource: finalResource,
        type: finalType,
        ...finalElement
      } = currentPage.elements.find((element) => !element.isBackground);

      // everything should be the same except the resource
      expect(initialElement).toEqual(finalElement);
      expect(initialResource).not.toEqual(finalResource);

      // MediaUpload fixture injects an image. New media should not have the same type
      expect(initialType).not.toEqual(finalType);
      expect(finalType).toEqual(finalResource.type);
    });

    it(`should click the \`${ACTIONS.ADD_ANIMATION.text}\` button and open the animation panel and focus the animation dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.sidebar.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.animation.effectChooser
      );
    });

    it(`should click the \`${ACTIONS.ADD_LINK.text}\` button and select the link panel and focus the input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.sidebar.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.link.address
      );
    });

    it(`should click the \`${ACTIONS.ADD_CAPTIONS.text}\` button and open the captions panel and focus the add captions input`, async () => {
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addCaptionsButton
      );
      expect(
        fixture.editor.sidebar.designPanel.captions.addCaptionsButton
      ).not.toBeNull();
    });

    it(`should add animations and filters to the video, click the \`${ACTIONS.RESET_ELEMENT.text}\` button, clear the animations and filters, then click Undo and reapply the animations and filters.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // add animation to video
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const effectChooserToggle =
        fixture.editor.sidebar.designPanel.animation.effectChooser;

      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Drop" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // the bot clicks the clear button too fast
      // the animation does not get removed if it is clicked before it stops playing
      // click "stop playing" and test the animations have been applied
      await waitFor(async () => {
        await fixture.events.click(
          await fixture.screen.findByRole('button', {
            name: 'Stop Page Animations',
          })
        );
      });

      // apply filter
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.filters.linear
      );

      // verify the animations and styles were added
      let originalAnimations = [];
      let originalSelectedElement = null;
      await waitFor(async () => {
        const story = await fixture.renderHook(() =>
          useStory(({ state }) => ({
            animations: state.pages[0].animations,
            selectedElement: state.selectedElements[0],
          }))
        );
        ({
          animations: originalAnimations,
          selectedElement: originalSelectedElement,
        } = story);

        if (!originalSelectedElement) {
          throw new Error('story not ready');
        }

        expect(originalSelectedElement.overlay.type).toBe('linear');
        expect(originalAnimations.length).toEqual(1);
      });

      // reset the element
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      );

      // verify that element has no animations or styles
      const { animations, selectedElement } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );
      expect(animations.length).toBe(0);
      expect(selectedElement.overlay).toBeNull();
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // wait for the undo button to appear
      await fixture.screen.findByRole('button', {
        name: /^Undo$/,
        hidden: true,
      });
      // click `undo` button on snackbar
      await fixture.events.click(
        await fixture.screen.findByRole('button', {
          name: /^Undo$/,
          hidden: true,
        })
      );

      // Verify that new animations and styles match original animation
      const {
        animations: revertedAnimations,
        selectedElement: revertedSelectedElement,
      } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );
      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(revertedSelectedElement.overlay.type).toEqual(
        originalSelectedElement.overlay.type
      );
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeDefined();
    });
  });

  describe('sticker selected', () => {
    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const sticker = await fixture.act(() =>
        insertElement('sticker', {
          border: null,
          borderRadius: null,
          flip: { vertical: false, horizontal: false },
          focalX: 50,
          focalY: 50,
          height: 137,
          id: '41262f75-7671-4ff2-92ef-5bbafc7b616a',
          lockAspectRatio: true,
          opacity: 100,
          rotationAngle: 0,
          scale: 100,
          sticker: { type: 'diyInstagramIcon' },
          type: 'sticker',
          width: 137,
          x: 227,
          y: 0,
        })
      );

      await clickOnTarget(
        fixture.editor.canvas.framesLayer.frame(sticker.id).node
      );
      await fixture.events.click(fixture.editor.sidebar.designTab);
    });

    it(`clicking the \`${ACTIONS.ADD_ANIMATION.text}\` button should select the animation panel and focus the dropdown`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addAnimationButton
      );

      expect(fixture.editor.sidebar.designPanel.animation).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.animation.effectChooser
      );
    });

    it(`clicking the \`${ACTIONS.ADD_LINK.text}\` button should select the link panel and focus the input`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.addLinkButton
      );

      expect(fixture.editor.sidebar.designPanel.link).not.toBeNull();

      expect(document.activeElement).toEqual(
        fixture.editor.sidebar.designPanel.link.address
      );
    });

    it(`Clicking the \`${ACTIONS.RESET_ELEMENT.text}\` button should clear the animations and filters, then click Undo and reapply the animations and filters.`, async () => {
      // quick action should not be present if there are no animations yet
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // add animation to image
      await fixture.events.click(fixture.editor.sidebar.designTab);
      const effectChooserToggle =
        fixture.editor.sidebar.designPanel.animation.effectChooser;

      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // animation
      const animation = fixture.screen.getByRole('option', {
        name: '"Pulse" Effect',
      });

      // apply animation to element
      await fixture.events.click(animation, { clickCount: 1 });

      // the bot clicks the clear button too fast
      // the animation does not get removed if it is clicked before it stops playing
      // click "stop playing" and test the animations have been applied
      await waitFor(async () => {
        await fixture.events.click(
          await fixture.screen.findByRole('button', {
            name: 'Stop Page Animations',
          })
        );
      });

      // apply opacity
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.sizePosition.opacity
      );
      await fixture.events.keyboard.type('40');
      await fixture.events.keyboard.press('Enter');

      // verify the animations and styles were added
      let originalAnimations = [];
      let originalSelectedElement = null;
      await waitFor(async () => {
        const story = await fixture.renderHook(() =>
          useStory(({ state }) => ({
            animations: state.pages[0].animations,
            selectedElement: state.selectedElements[0],
          }))
        );
        ({
          animations: originalAnimations,
          selectedElement: originalSelectedElement,
        } = story);

        if (!originalSelectedElement) {
          throw new Error('story not ready');
        }

        expect(originalSelectedElement.opacity).toBe(40);
        expect(originalAnimations.length).toEqual(1);
      });

      // reset the element
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      );

      // verify that element has no animations or styles
      const { animations, selectedElement } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );
      expect(animations.length).toBe(0);
      expect(selectedElement.opacity).toBe(100);
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeNull();

      // wait for the undo button to appear
      await fixture.screen.findByRole('button', {
        name: /^Undo$/,
        hidden: true,
      });
      // click `undo` button on snackbar
      await fixture.events.click(
        await fixture.screen.findByRole('button', {
          name: /^Undo$/,
          hidden: true,
        })
      );

      // Verify that new animations and styles match original animation
      const {
        animations: revertedAnimations,
        selectedElement: revertedSelectedElement,
      } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[0].animations,
          selectedElement: state.selectedElements[0],
        }))
      );
      expect(revertedAnimations.length).toBe(1);
      expect(revertedAnimations[0]).toEqual(originalAnimations[0]);
      expect(revertedSelectedElement.opacity).toEqual(
        originalSelectedElement.opacity
      );
      expect(
        fixture.editor.canvas.quickActionMenu.resetElementButton
      ).toBeDefined();
    });
  });
});
