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
import { within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';
import { clearableAttributes as imageAttributeDefaults } from '../../../elements/image';
import { clearableAttributes as textAttributeDefaults } from '../../../elements/text';
import { Fixture } from '../../../karma';
import objectPick from '../../../utils/objectPick';
import useInsertElement from '../useInsertElement';

describe('Right Click Menu integration', () => {
  let fixture;
  let duplicatePageCarouselButton;
  let insertElement;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    insertElement = await fixture.renderHook(() => useInsertElement());

    duplicatePageCarouselButton = fixture.screen.getByRole('button', {
      name: /Duplicate Page/,
    });
  });

  afterEach(async () => {
    await closeRightClickMenu();
    fixture.restore();
  });

  function rightClickMenu() {
    return fixture.screen.getByRole('group', {
      name: 'Context Menu for the selected element',
    });
  }

  function sendBackward() {
    return fixture.screen.getByRole('button', {
      name: /^Send Backward/i,
    });
  }

  function sendToBack() {
    return fixture.screen.getByRole('button', {
      name: /^Send to Back/i,
    });
  }

  function bringForward() {
    return fixture.screen.getByRole('button', {
      name: /^Bring Forward/i,
    });
  }

  function bringToFront() {
    return fixture.screen.getByRole('button', {
      name: /^Bring to Front/i,
    });
  }

  function setAsPageBackground() {
    return fixture.screen.getByRole('button', {
      name: /^Set as page Background/i,
    });
  }

  function scaleAndCropImage() {
    return fixture.screen.getByRole('button', {
      name: /^Scale & Crop Image/i,
    });
  }

  function scaleAndCropBackgroundImage() {
    return fixture.screen.getByRole('button', {
      name: /^Scale & Crop Background Image/i,
    });
  }

  function scaleAndCropVideo() {
    return fixture.screen.getByRole('button', {
      name: /^Scale & Crop Video/i,
    });
  }

  function scaleAndCropBackgroundVideo() {
    return fixture.screen.getByRole('button', {
      name: /^Scale & Crop Background Video/i,
    });
  }

  function duplicatePage() {
    const menu = rightClickMenu();

    return within(menu).queryByRole('button', {
      name: /^Duplicate Page/i,
    });
  }

  function deletePage() {
    const menu = rightClickMenu();

    return within(menu).queryByRole('button', {
      name: /^Delete Page/i,
    });
  }

  function copyImageStyles() {
    return fixture.screen.getByRole('button', {
      name: /^Copy Image Styles/i,
    });
  }

  function pasteImageStyles() {
    return fixture.screen.getByRole('button', {
      name: /^Paste Image Styles/i,
    });
  }

  function clearImageStyles() {
    return fixture.screen.getByRole('button', {
      name: /^Clear Image Styles/i,
    });
  }

  function detachImageFromBackground() {
    return fixture.screen.getByRole('button', {
      name: /^Detach Image From Background/i,
    });
  }

  function copyStyles() {
    return fixture.screen.getByRole('button', {
      name: /^Copy Style/i,
    });
  }

  function pasteStyles() {
    return fixture.screen.getByRole('button', {
      name: /^Paste Style/i,
    });
  }

  function addToSavedStyles() {
    return fixture.screen.getByRole('button', {
      name: /^Add Style to/i,
    });
  }

  function addToSavedColors() {
    return fixture.screen.getByRole('button', {
      name: /^Add Color to/i,
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
   * Click on the target in the fixture.
   *
   * @param {Object} target The element to be clicked
   */
  async function rightClickOnTarget(target) {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.mouse.click(x + width / 2, y + height / 2, {
      button: 'right',
    });
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
          type: 'image',
          mimeType: 'image/jpg',
          src: 'http://localhost:9876/__static__/earth.jpg',
          alt: 'Earth',
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
          type: 'image',
          mimeType: 'image/jpg',
          src: 'http://localhost:9876/__static__/ranger9.png',
          alt: 'Ranger',
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
          mimeType: 'image/jpg',
          src: 'http://localhost:9876/__static__/beach.mp4',
        },
      })
    );
  }

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
      await fixture.events.click(duplicatePageCarouselButton, {
        button: 'right',
      });
      expect(
        fixture.screen.queryByTestId(
          'right-click-context-menu[aria-expanded="true"]'
        )
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
  });

  describe('right click menu: foreground and background media actions', () => {
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
      ).toBe('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toBe('Video Content');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toBe('Ranger');

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
      ).toBe('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toBe('Ranger');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toBe('Video Content');

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
      ).toBe('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toBe('Video Content');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toBe('Ranger');

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
      ).toBe('Ranger');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toBe('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toBe('Video Content');

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
      ).toBe('Earth');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[1].textContent
      ).toBe('Video Content');
      expect(
        fixture.editor.inspector.designPanel.layerPanel.layers[0].textContent
      ).toBe('Ranger');

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

    describe('right click menu: copying, pasting, and clearing styles', () => {
      const clearableImageProperties = Object.keys(imageAttributeDefaults);

      it('should copy and paste styles', async () => {
        const earthImage = await addEarthImage();
        const rangerImage = await addRangerImage();

        // select earth image
        await fixture.events.click(
          fixture.editor.canvas.framesLayer.frame(earthImage.id).node
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

        // verify that the styles were copied and pasted
        const { currentPage } = await fixture.renderHook(() =>
          useStory(({ state }) => ({
            currentPage: state.currentPage,
          }))
        );

        const images = currentPage.elements.filter(
          (element) => !element.isBackground
        );

        const copiedProperties = objectPick(
          images[0],
          clearableImageProperties
        );
        const pastedProperties = objectPick(
          images[0],
          clearableImageProperties
        );

        expect(copiedProperties).toEqual(pastedProperties);
      });

      it('should reset styles to the default', async () => {
        const earthImage = await addEarthImage();

        // select earth image
        await fixture.events.click(
          fixture.editor.canvas.framesLayer.frame(earthImage.id).node
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

        // clear earth styles
        await rightClickOnTarget(
          fixture.editor.canvas.framesLayer.frame(earthImage.id).node
        );
        await fixture.events.click(clearImageStyles());

        // verify styles were reset to defaults
        const { currentPage } = await fixture.renderHook(() =>
          useStory(({ state }) => ({
            currentPage: state.currentPage,
          }))
        );

        const image = currentPage.elements.find(
          (element) => !element.isBackground
        );

        expect(objectPick(image, clearableImageProperties)).toEqual(
          imageAttributeDefaults
        );
      });
    });
  });

  describe('right click menu: text', () => {
    const { content: _, ...textAttributeDefaultsWithoutContent } =
      textAttributeDefaults;
    const clearableTextProperties = Object.keys(
      textAttributeDefaultsWithoutContent
    );

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

      const copiedProperties = objectPick(
        textElements[0],
        clearableTextProperties
      );
      const { content, ...pastedProperties } = objectPick(textElements[1], [
        ...clearableTextProperties,
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
});
