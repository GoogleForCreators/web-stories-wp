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
import { waitFor, within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';
import { ATTRIBUTES_TO_COPY } from '../../../app/story/useStoryReducer/reducers/copySelectedElement';
import { Fixture } from '../../../karma';
import objectPick from '../../../utils/objectPick';
import useInsertElement from '../useInsertElement';

describe('Right Click Menu integration', () => {
  let fixture;
  let insertElement;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    insertElement = await fixture.renderHook(() => useInsertElement());

    // Remove empty state message by changing the background
    await fixture.events.click(
      fixture.editor.canvas.quickActionMenu.changeBackgroundColorButton
    );
    await fixture.events.keyboard.type('ef');
    await fixture.events.keyboard.press('Tab');
  });

  afterEach(async () => {
    await closeRightClickMenu();
    fixture.restore();
  });

  function rightClickMenu() {
    return within(
      fixture.screen.getByRole('dialog', {
        name: 'Context Menu for the selected element',
      })
    ).getByRole('menu');
  }

  function sendBackward() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Send Backward/i,
    });
  }

  function sendToBack() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Send to Back/i,
    });
  }

  function bringForward() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Bring Forward/i,
    });
  }

  function bringToFront() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Bring to Front/i,
    });
  }

  function selectLayerButton() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Select Layer/i,
    });
  }

  function setAsPageBackground() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Set as page Background/i,
    });
  }

  function scaleAndCropImage() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Scale & Crop Image/i,
    });
  }

  function scaleAndCropBackgroundImage() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Scale & Crop Background Image/i,
    });
  }

  function scaleAndCropVideo() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Scale & Crop Video/i,
    });
  }

  function scaleAndCropBackgroundVideo() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Scale & Crop Background Video/i,
    });
  }

  function duplicatePage() {
    const menu = rightClickMenu();

    return within(menu).queryByRole('menuitem', {
      name: /^Duplicate Page/i,
    });
  }

  function deletePage() {
    const menu = rightClickMenu();

    return within(menu).queryByRole('menuitem', {
      name: /^Delete Page/i,
    });
  }

  function copyImageStyles() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Copy Image Styles/i,
    });
  }

  function pasteImageStyles() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Paste Image Styles/i,
    });
  }

  function detachImageFromBackground() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Detach Image From Background/i,
    });
  }

  function copyStyles() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Copy Style/i,
    });
  }

  function pasteStyles() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Paste Style/i,
    });
  }

  function addToSavedStyles() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Add Style to/i,
    });
  }

  function addToSavedColors() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Add Color to/i,
    });
  }

  function duplicateElements() {
    return fixture.screen.getByRole('menuitem', {
      name: /^Duplicate Element/i,
    });
  }

  function getMenuItemByName(name) {
    return fixture.screen.getByRole('menuitem', {
      name,
    });
  }

  /**
   * Closes the browser right click menu by left clicking
   */
  async function closeRightClickMenu() {
    const framesLayer = fixture.screen.getByTestId('FramesLayer');
    // close browser default (only shows in puppeteer tests)
    const rect = framesLayer.getBoundingClientRect();
    await fixture.events.mouse.click(rect.left + 1, rect.top + 1);
    // close right click menu
    await fixture.events.mouse.click(rect.left + 1, rect.top + 1);
  }

  /**
   * Right click on the target in the fixture.
   *
   * @param {Object} target The element to be clicked.
   */
  async function rightClickOnTarget(target) {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.mouse.click(x + width / 2, y + height / 2, {
      button: 'right',
    });
  }

  /**
   * Click on the target in the fixture.
   *
   * @param {Object} target The element to be clicked.
   * @param {string} key The key to be held down while clicking
   */
  async function clickOnTarget(target, key = false) {
    const { x, y, width, height } = target.getBoundingClientRect();
    if (key) {
      await fixture.events.keyboard.down(key);
    }
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
    if (key) {
      await fixture.events.keyboard.up(key);
    }
  }

  /**
   * Add text to canvas
   *
   * @param {Object} textPartial text element partial
   * @return {Object} the text element
   */
  function addText(textPartial = {}) {
    return fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'Hello world!',
        x: 10,
        y: 20,
        width: 400,
        ...textPartial,
      })
    );
  }

  /**
   * Add earth image to canvas
   *
   * @return {Object} the image element
   */
  function addEarthImage() {
    return fixture.act(() =>
      insertElement('image', {
        x: 200,
        y: 0,
        width: 640 / 2,
        height: 529 / 2,
        resource: {
          id: 10,
          type: 'image',
          mimeType: 'image/jpg',
          src: 'http://localhost:9876/__static__/earth.jpg',
          alt: 'Earth',
          width: 640,
          height: 529,
          baseColor: '#734727',
        },
      })
    );
  }

  /**
   * Add ranger image to canvas
   *
   * @return {Object} the image element
   */
  function addRangerImage() {
    return fixture.act(() =>
      insertElement('image', {
        x: 50,
        y: 200,
        width: 640 / 2,
        height: 529 / 2,
        resource: {
          id: 6,
          type: 'image',
          mimeType: 'image/jpg',
          src: 'http://localhost:9876/__static__/ranger9.png',
          alt: 'Ranger',
          width: 640,
          height: 480,
        },
      })
    );
  }

  /**
   * Add video to canvas
   *
   * @return {Object} the video element
   */
  function addVideo() {
    return fixture.act(() =>
      insertElement('video', {
        x: 0,
        y: 0,
        width: 640 / 2,
        height: 529 / 2,
        resource: {
          width: 640,
          height: 529,
          type: 'video',
          mimeType: 'video/mp4',
          src: 'http://localhost:9876/__static__/beach.mp4',
          alt: 'beach',
        },
      })
    );
  }

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  /**
   * Add shape to canvas
   *
   * @param {Object} shapePartial Object with shape properties to override defaults.
   * @return {Object} the shape element
   */
  function addShape(shapePartial = {}) {
    return fixture.act(() =>
      insertElement('shape', {
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
        link: null,
        ...shapePartial,
      })
    );
  }

  const verifyPageDuplicated = (pages = []) => {
    expect(pages[0].backgroundColor).toEqual(pages[1].backgroundColor);
    pages[0].elements.map((elem, index) => {
      // ids won't match
      const { id, ...originalElement } = elem;
      const { id: newId, basedOn, ...newElement } = pages[1].elements[index];

      expect(originalElement).toEqual(newElement);
    });
  };

  /**
   * Verifies that one element is a duplicate of the other
   *
   * @param {Object} element1 The original element
   * @param {Object} element2 The duplicate element
   */
  function verifyElementDuplicated(element1, element2) {
    for (const property in element1) {
      if (!['x', 'y', 'id'].includes(property)) {
        expect(element1[property]).toEqual(element2[property]);
      } else {
        expect(element1[property]).not.toEqual(element2[property]);
      }
    }

    expect(element2.basedOn).toBe(element1.id);
  }

  describe('menu visibility', () => {
    it('right clicking on the canvas should open the custom right click menu', async () => {
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });

      expect(rightClickMenu()).not.toBeNull();
    });

    // NOTE: this opens the real right click menu, which can't be closed
    // after it is opened :grimacing:.
    it('right clicking away from the canvas should not open the custom right click menu', async () => {
      // right click outside canvas
      await fixture.events.click(
        fixture.editor.canvas.pageActions.duplicatePage,
        {
          button: 'right',
        }
      );
      expect(
        fixture.screen.queryByRole('menu', {
          name: 'Context Menu for the selected element',
        })
      ).toBeNull();
    });

    it('right clicking a layer in the layer panel should open the custom right click menu', async () => {
      await addEarthImage();

      await fixture.events.click(
        fixture.editor.inspector.designPanel.layerPanel.layers[0],
        {
          button: 'right',
        }
      );

      expect(rightClickMenu()).not.toBeNull();
    });

    it('should open and close the context menu using keyboard shortcuts', async () => {
      // add an element to the page
      await fixture.events.click(fixture.editor.inspector.insertTab);
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        const node = fixture.editor.canvas.framesLayer.frames[1].node;
        if (!node) {
          throw new Error('node not ready');
        }
        expect(node).toBeTruthy();
      });
      const frame1 = fixture.editor.canvas.framesLayer.frames[1].node;

      // only possible if element in canvas is focused
      await fixture.events.focus(frame1);

      // open right click menu
      await fixture.events.keyboard.shortcut('mod+alt+shift+m');

      expect(
        fixture.screen.queryByRole('dialog', {
          name: 'Context Menu for the selected element',
        })
      ).not.toBeNull();

      // close right click menu
      await fixture.events.keyboard.press('esc');
      expect(
        fixture.screen.queryByRole('dialog', {
          name: 'Context Menu for the selected element',
        })
      ).toBeNull();
    });
  });

  describe('Right click menu: Select Layer', () => {
    it('should allow selecting a layer from the point where the menu was opened from', async () => {
      // Add a Triangle and an image to the same place.
      await fixture.events.click(fixture.editor.inspector.insertTab);
      await fixture.events.sleep(100);
      const mediaItem = fixture.editor.library.media.item(0);
      await fixture.events.mouse.clickOn(mediaItem, 20, 20);
      await fixture.events.click(fixture.editor.library.shapesTab);
      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );
      // Add a Text a different place.
      await addText({ x: 200 });

      // Right-click on the top-left corner of the triangle.
      const triangle = fixture.editor.canvas.framesLayer.frames[2].node;
      const { x, y } = triangle.getBoundingClientRect();
      await fixture.events.mouse.click(x + 10, y + 10, {
        button: 'right',
      });

      // Open the Select Layer submenu.
      await fixture.events.click(selectLayerButton());
      // Verify if displays Background, Triangle, Image as options but not the text.
      expect(getMenuItemByName('Background')).not.toBeNull();
      expect(getMenuItemByName('Triangle')).not.toBeNull();
      expect(getMenuItemByName('blue-marble')).not.toBeNull();
      expect(() =>
        getMenuItemByName(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        )
      ).toThrow();

      // Verify that clicking on the background button selects background.
      await fixture.events.click(getMenuItemByName('Background'));
      const [element] = await getSelection();
      expect(element.isDefaultBackground).toBeTrue();
    });

    it('should not display the option to select layer when opening from the layer panel', async () => {
      await addEarthImage();

      await fixture.events.click(
        fixture.editor.inspector.designPanel.layerPanel.layers[0],
        {
          button: 'right',
        }
      );

      expect(() => selectLayerButton()).toThrow();
    });
  });

  describe('right click menu: shared foreground and background media actions', () => {
    it('should set an image as the background and detach an image from the background', async () => {
      const earthImage = await addEarthImage();

      // right click image
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );

      // set image as page background
      await fixture.events.click(setAsPageBackground());

      // verify the image has been set as the background
      const { currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );

      expect(currentPage.elements.length).toBe(1);
      expect(currentPage.elements[0].isBackground).toBeTrue();

      // right click background image
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );

      // remove from image background
      await fixture.events.click(detachImageFromBackground());

      // verify the image has been removed from the background
      const { currentPage: newCurrentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );

      expect(newCurrentPage.elements.length).toBe(2);
      expect(
        newCurrentPage.elements.find((element) => element.id === earthImage.id)
          .isBackground
      ).toBe(undefined);
    });

    it('should let a user scale and crop image', async () => {
      const earthImage = await addEarthImage();

      // right click video
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );

      // foreground: click 'scale and crop image' button
      await fixture.events.click(scaleAndCropImage());

      // Verify element is being edited
      expect(fixture.screen.getByTestId('edit-panel-slider')).toBeDefined();

      // escape edit mode
      await fixture.events.keyboard.press('Esc');

      // right click video
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );

      // set video as page background
      await fixture.events.click(setAsPageBackground());

      // right click video
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );

      // background: click 'scale and crop image' button
      await fixture.events.click(scaleAndCropBackgroundImage());

      // Verify element is being edited
      expect(fixture.screen.getByTestId('edit-panel-slider')).toBeDefined();
    });

    it('should let a user scale and crop video', async () => {
      const video = await addVideo();

      // right click video
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(video.id).node
      );

      // foreground: click 'scale and crop video' button
      await fixture.events.click(scaleAndCropVideo());

      // Verify element is being edited
      expect(fixture.screen.getByTestId('edit-panel-slider')).toBeDefined();

      // escape edit mode
      await fixture.events.keyboard.press('Esc');

      // right click video
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(video.id).node
      );

      // set video as page background
      await fixture.events.click(setAsPageBackground());

      // right click video
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(video.id).node
      );

      // background: click 'scale and crop video' button
      await fixture.events.click(scaleAndCropBackgroundVideo());

      // Verify element is being edited
      expect(fixture.screen.getByTestId('edit-panel-slider')).toBeDefined();
    });
  });

  describe('right click menu: page/background with no media', () => {
    it("should duplicate the current page when clicking 'Duplicate page'", async () => {
      await addEarthImage();
      await addText();

      const { currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );
      const backgroundElement = currentPage.elements.find(
        (element) => element.isBackground
      );

      // duplicate page
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(backgroundElement.id).node
      );
      await fixture.events.click(duplicatePage());

      // verify duplication of all content
      const { pages } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          pages: state.pages,
        }))
      );

      verifyPageDuplicated(pages);
    });

    it('should delete the current page when clicking the "Delete Page" button', async () => {
      // duplicate page
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });
      await fixture.events.click(duplicatePage());

      // insert elements on new page
      await addEarthImage();
      await addText();

      // delete page
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });
      await fixture.events.click(deletePage());

      // verify the correct page was deleted
      const { pages } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          pages: state.pages,
        }))
      );

      expect(pages.length).toBe(1);
      expect(pages[0].elements.length).toBe(1);
      expect(pages[0].elements[0].isBackground).toBe(true);
    });
  });

  describe('right click menu: foreground media', () => {
    it('should duplicate the element', async () => {
      const image = await addEarthImage();

      const imageFrame = fixture.editor.canvas.framesLayer.frame(image.id).node;

      // multiple elements should be selected
      const { initialElements, selectedElements } = await fixture.renderHook(
        () =>
          useStory(({ state }) => ({
            selectedElements: state.selectedElements,
            initialElements: state.currentPage.elements,
          }))
      );

      expect(selectedElements.length).toBe(1);
      expect(initialElements.length).toBe(2);

      // open right click menu
      await rightClickOnTarget(imageFrame);

      // duplicate elements
      await fixture.events.click(duplicateElements());

      // verify elements were duplicated
      const { finalElements } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          finalElements: state.currentPage.elements,
        }))
      );

      expect(finalElements.length).toBe(
        initialElements.length + selectedElements.length
      );

      // verify image duplication
      const imageElements = finalElements.filter(
        (element) => element.type === 'image'
      );
      expect(imageElements.length).toBe(2);
      verifyElementDuplicated(imageElements[0], imageElements[1]);
    });

    it('should be able to move media forwards and backwards when possible', async () => {
      const earthImage = await addEarthImage();

      // right click image
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );

      // movement buttons should be disabled
      expect(sendBackward().disabled).toBeTrue();
      expect(sendToBack().disabled).toBeTrue();
      expect(bringForward().disabled).toBeTrue();
      expect(bringToFront().disabled).toBeTrue();

      await closeRightClickMenu();

      // add more elements to enable movement buttons
      await addVideo();
      const rangerImage = await addRangerImage();

      // right click image
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(rangerImage.id).node
      );

      // verify multiple layers
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers.length
      ).toBe(4);
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[2].textContent
      ).toContain('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toContain('beach');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toContain('Ranger');

      // More than one layer so some movement buttons will be enabled
      expect(sendBackward().disabled).toBeFalse();
      expect(sendToBack().disabled).toBeFalse();
      expect(bringForward().disabled).toBeTrue();
      expect(bringToFront().disabled).toBeTrue();

      // Move image with 'Send backward'
      await fixture.events.click(sendBackward());

      // verify new layer order
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[2].textContent
      ).toContain('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toContain('Ranger');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toContain('beach');

      // right click image
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(rangerImage.id).node
      );

      // verify all buttons are enabled now that there
      // are layers above and below
      expect(sendBackward().disabled).toBeFalse();
      expect(sendToBack().disabled).toBeFalse();
      expect(bringForward().disabled).toBeFalse();
      expect(bringToFront().disabled).toBeFalse();

      // Move image with 'Bring forward' button
      await fixture.events.click(bringForward());

      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[2].textContent
      ).toContain('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toContain('beach');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toContain('Ranger');

      // Move image all the way to back
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(rangerImage.id).node
      );
      await fixture.events.click(sendToBack());

      // verify positioning
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(rangerImage.id).node
      );
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[2].textContent
      ).toContain('Ranger');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toContain('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toContain('beach');

      // verify 'back' buttons are disabled since ranger image is under everything
      // except the background
      expect(sendBackward().disabled).toBeTrue();
      expect(sendToBack().disabled).toBeTrue();
      expect(bringForward().disabled).toBeFalse();
      expect(bringToFront().disabled).toBeFalse();

      // Move image all the way to the front
      await fixture.events.click(bringToFront());

      // verify positioning
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[2].textContent
      ).toContain('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toContain('beach');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toContain('Ranger');

      // verify 'forward' buttons are disabled since ranger image is under everything
      // except the background
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(rangerImage.id).node
      );
      expect(sendBackward().disabled).toBeFalse();
      expect(sendToBack().disabled).toBeFalse();
      expect(bringForward().disabled).toBeTrue();
      expect(bringToFront().disabled).toBeTrue();
    });

    describe('right click menu: copying and pasting styles', () => {
      it('should copy and paste styles', async () => {
        const earthImage = await addEarthImage();
        const rangerImage = await addRangerImage();

        // select earth image
        await fixture.events.click(
          fixture.editor.canvas.framesLayer.frame(earthImage.id).node
        );

        // add animation
        const effectChooserToggle =
          fixture.editor.inspector.designPanel.animation.effectChooser;

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
              fixture.screen.getByRole('button', {
                name: 'Stop Page Animations',
              })
            );
          },
          { timeout: 4000 }
        );

        // add border
        await fixture.events.click(
          fixture.editor.inspector.designPanel.border.width()
        );
        await fixture.events.keyboard.type('20');

        // add border radius
        await fixture.events.click(
          fixture.editor.inspector.designPanel.sizePosition.radius()
        );
        await fixture.events.keyboard.type('50');

        // add filter
        await fixture.events.click(
          fixture.editor.inspector.designPanel.filters.solid
        );

        // add opacity
        await fixture.events.click(
          fixture.editor.inspector.designPanel.sizePosition.opacity
        );
        await fixture.events.keyboard.type('40');

        // track initial animation
        const { initialAnimations, initialElements } = await fixture.renderHook(
          () =>
            useStory(({ state }) => ({
              initialAnimations: state.currentPage.animations,
              initialElements: state.currentPage.elements,
            }))
        );

        expect(initialAnimations.length).toBe(1);
        expect(initialElements[1].id).toBe(initialAnimations[0].targets[0]);

        // copy earth image styles
        await rightClickOnTarget(
          fixture.editor.canvas.framesLayer.frame(earthImage.id).node
        );
        await fixture.events.click(copyImageStyles());

        // paste styles onto ranger image
        await rightClickOnTarget(
          fixture.editor.canvas.framesLayer.frame(rangerImage.id).node
        );
        await fixture.events.click(pasteImageStyles());

        // verify that the styles and animations were copied and pasted
        const { finalAnimations, finalElements } = await fixture.renderHook(
          () =>
            useStory(({ state }) => ({
              finalAnimations: state.currentPage.animations,
              finalElements: state.currentPage.elements,
            }))
        );

        // validate copied styles
        const images = finalElements.filter((element) => !element.isBackground);

        const copiedProperties = objectPick(images[0], ATTRIBUTES_TO_COPY);
        const pastedProperties = objectPick(images[1], ATTRIBUTES_TO_COPY);

        expect(copiedProperties).toEqual(pastedProperties);

        // validate copied animations
        expect(finalAnimations.length).toEqual(2);
        const { id: id1, targets: targets1, ...anim1 } = finalAnimations[0];
        const { id: id2, targets: targets2, ...anim2 } = finalAnimations[1];

        expect(anim1).toEqual(anim2);
        expect(targets1).toEqual([images[0].id]);
        expect(targets2).toEqual([images[1].id]);
      });
    });
  });

  describe('right click menu: text', () => {
    it('should duplicate the element', async () => {
      const text = await addText({
        backgroundColor: {
          color: {
            r: 196,
            g: 196,
            b: 196,
          },
        },
        fontSize: 60,
        content: '<span style="color: #00ff00">Another Text Element</span>',
      });

      const textFrame = fixture.editor.canvas.framesLayer.frame(text.id).node;

      // multiple elements should be selected
      const { initialElements, selectedElements } = await fixture.renderHook(
        () =>
          useStory(({ state }) => ({
            selectedElements: state.selectedElements,
            initialElements: state.currentPage.elements,
          }))
      );

      expect(selectedElements.length).toBe(1);
      expect(initialElements.length).toBe(2);

      // open right click menu
      await rightClickOnTarget(textFrame);

      // duplicate elements
      await fixture.events.click(duplicateElements());

      // verify elements were duplicated
      const { finalElements } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          finalElements: state.currentPage.elements,
        }))
      );

      expect(finalElements.length).toBe(
        initialElements.length + selectedElements.length
      );

      // verify text duplication
      const textElements = finalElements.filter(
        (element) => element.type === 'text'
      );
      expect(textElements.length).toBe(2);
      verifyElementDuplicated(textElements[0], textElements[1]);
    });

    it('should not copy and paste content directly with styles', async () => {
      const textA = await addText({
        fontSize: 60,
        content: '<span style="color: #ff0110">Some Text Element</span>',
        backgroundColor: { r: 10, g: 0, b: 200 },
        lineHeight: 1.4,
        textAlign: 'center',
        border: {
          left: 1,
          right: 1,
          top: 1,
          bottom: 1,
          lockedWidth: true,
          color: {
            color: {
              r: 0,
              g: 0,
              b: 0,
            },
          },
        },
        padding: {
          vertical: 0,
          horizontal: 20,
          locked: true,
        },
      });
      const textB = await addText({
        y: 300,
        fontSize: 40,
        content: '<span style="color: #10ff01">Another Text Element</span>',
      });

      // copy text element A styles
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(textA.id).node
      );
      await fixture.events.click(copyStyles());

      // paste text element A styles onto text element B
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(textB.id).node
      );
      await fixture.events.click(pasteStyles());

      // verify that the styles were copied and pasted
      const { currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );

      const textElements = currentPage.elements.filter(
        (element) => !element.isBackground
      );

      const { content: _copiedContent, ...copiedProperties } = objectPick(
        textElements[0],
        ATTRIBUTES_TO_COPY
      );
      const { content, ...pastedProperties } = objectPick(textElements[1], [
        ...ATTRIBUTES_TO_COPY,
        'content',
      ]);
      expect(content).toBe(
        '<span style="color: #ff0110">Another Text Element</span>'
      );
      expect(copiedProperties).toEqual(pastedProperties);

      // should update bounding box size when updating fontSize
      expect(textB.height).not.toBe(textElements[1].height);
    });

    it('should add color to "Saved Colors"', async () => {
      const text = await addText({
        fontSize: 60,
        content: '<span style="color: #00ff00">Another Text Element</span>',
      });

      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(text.id).node
      );
      await fixture.events.click(addToSavedColors());

      // verify that the global color was added
      const { colors } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          colors: state.story.globalStoryStyles.colors,
        }))
      );
      expect(colors.map(({ color }) => color)).toContain({
        r: 0,
        g: 255,
        b: 0,
      });
    });

    it('should add style to "Saved Styles"', async () => {
      const text = await addText({
        backgroundColor: {
          color: {
            r: 196,
            g: 196,
            b: 196,
          },
        },
        fontSize: 60,
        content: '<span style="color: #00ff00">Another Text Element</span>',
      });

      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(text.id).node
      );
      await fixture.events.click(addToSavedStyles());

      // verify that the global color was added
      const { textStyles } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          textStyles: state.story.globalStoryStyles.textStyles,
        }))
      );
      expect(textStyles).toContain({
        backgroundColor: {
          color: {
            r: 196,
            g: 196,
            b: 196,
          },
        },
        backgroundTextMode: 'NONE',
        font: TEXT_ELEMENT_DEFAULT_FONT,
        fontSize: 60,
        lineHeight: 1.3,
        padding: {
          vertical: 0,
          horizontal: 0,
          locked: true,
        },
        textAlign: 'initial',
        color: {
          color: {
            r: 0,
            g: 255,
            b: 0,
          },
        },
        fontWeight: 400,
        isItalic: false,
        isUnderline: false,
        letterSpacing: 0,
      });
    });
  });

  describe('right click menu: shapes', () => {
    it('should duplicate the element', async () => {
      const shape = await addShape({
        backgroundColor: {
          color: {
            r: 203,
            g: 103,
            b: 103,
          },
        },
      });
      const shapeFrame = fixture.editor.canvas.framesLayer.frame(shape.id).node;

      // multiple elements should be selected
      const { initialElements, selectedElements } = await fixture.renderHook(
        () =>
          useStory(({ state }) => ({
            selectedElements: state.selectedElements,
            initialElements: state.currentPage.elements,
          }))
      );

      expect(selectedElements.length).toBe(1);
      expect(initialElements.length).toBe(2);

      // open right click menu
      await rightClickOnTarget(shapeFrame);

      // duplicate elements
      await fixture.events.click(duplicateElements());

      // verify elements were duplicated
      const { finalElements } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          finalElements: state.currentPage.elements,
        }))
      );

      expect(finalElements.length).toBe(
        initialElements.length + selectedElements.length
      );

      // verify shape duplication
      const shapeElements = finalElements.filter(
        (element) => element.type === 'shape' && !element.isBackground
      );
      expect(shapeElements.length).toBe(2);
      verifyElementDuplicated(shapeElements[0], shapeElements[1]);
    });

    it('should add style to "Saved Colors"', async () => {
      const shape = await addShape({
        backgroundColor: {
          color: {
            r: 203,
            g: 103,
            b: 103,
          },
        },
      });

      // Save color to saved colors
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(shape.id).node
      );
      await fixture.events.click(addToSavedColors());

      // verify that the global color was added
      const { colors } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          colors: state.story.globalStoryStyles.colors,
        }))
      );
      expect(colors).toContain({
        color: {
          r: 203,
          g: 103,
          b: 103,
        },
      });
    });
  });

  describe('right click menu: multiple elements selected', () => {
    it('should duplicate all selected elements', async () => {
      await addText({
        y: 300,
        fontSize: 40,
        content: '<span style="color: #10ff01">Another Text Element</span>',
      });
      const image = await addEarthImage();
      const shape = await addShape({
        backgroundColor: {
          color: {
            r: 203,
            g: 103,
            b: 103,
          },
        },
      });

      const imageFrame = fixture.editor.canvas.framesLayer.frame(image.id).node;
      const shapeFrame = fixture.editor.canvas.framesLayer.frame(shape.id).node;

      // select multiple targets
      await clickOnTarget(imageFrame);
      await clickOnTarget(shapeFrame, 'Shift');

      // multiple elements should be selected
      const { initialElements, selectedElements } = await fixture.renderHook(
        () =>
          useStory(({ state }) => ({
            selectedElements: state.selectedElements,
            initialElements: state.currentPage.elements,
          }))
      );

      expect(selectedElements.length).toBe(2);
      expect(initialElements.length).toBe(4);

      // open right click menu
      await rightClickOnTarget(imageFrame);

      // duplicate elements
      await fixture.events.click(duplicateElements());

      // verify elements were duplicated
      const { finalElements } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          finalElements: state.currentPage.elements,
        }))
      );

      expect(finalElements.length).toBe(
        initialElements.length + selectedElements.length
      );

      // verify text element was not duplicated
      expect(
        finalElements.filter((element) => element.type === 'text').length
      ).toBe(1);

      // verify image duplication
      const imageElements = finalElements.filter(
        (element) => element.type === 'image'
      );
      expect(imageElements.length).toBe(2);
      verifyElementDuplicated(imageElements[0], imageElements[1]);

      // verify shape duplication
      const shapeElements = finalElements.filter(
        (element) => element.type === 'shape' && !element.isBackground
      );
      expect(shapeElements.length).toBe(2);
      verifyElementDuplicated(shapeElements[0], shapeElements[1]);
    });
  });
});
