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
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';
import { Fixture } from '../../../karma';
import useInsertElement from '../useInsertElement';

describe('Right Click Menu integration', () => {
  let fixture;
  let newPageCarouselButton;
  let duplicatePageCarouselButton;
  let insertElement;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableRightClickMenus: true });
    await fixture.render();

    insertElement = await fixture.renderHook(() => useInsertElement());

    newPageCarouselButton = fixture.screen.getByRole('button', {
      name: /New Page/,
    });
    duplicatePageCarouselButton = fixture.screen.getByRole('button', {
      name: /Duplicate Page/,
    });
  });

  afterEach(async () => {
    await closeRightClickMenu();
    fixture.restore();
  });

  /**
   * Closes the browser right click menu by left clicking
   */
  async function closeRightClickMenu() {
    const framesLayer = fixture.screen.getByTestId('FramesLayer');
    // close browser default (only shows in puppeteer tests)
    await fixture.events.click(framesLayer);
    // close right click menu
    await fixture.events.click(framesLayer);
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
   * @return {Object} the element
   */
  function addText() {
    return fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'Hello world!',
        x: 10,
        y: 20,
        width: 400,
      })
    );
  }

  /**
   * Add earth image to canvas
   *
   * @return {Object} the element
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
   * @return {Object} the element
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
   * @return {Object} the element
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

  const verifyPageDuplicated = (pages = []) => {
    expect(pages[0].backgroundColor).toEqual(pages[1].backgroundColor);
    pages[0].elements.map((elem, index) => {
      // ids won't match
      const { id, ...originalElement } = elem;
      const { id: newId, ...newElement } = pages[1].elements[index];

      expect(originalElement).toEqual(newElement);
    });
  };

  describe('menu visibility', () => {
    it('right clicking on the canvas should open the custom right click menu', async () => {
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });

      expect(fixture.editor.canvas.rightClickMenu).not.toBeNull();
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
  });

  describe('default actions', () => {
    // TODO: #8024 fix flakey test.
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should be able to copy a page and paste it to a new page', async () => {
      // insert element
      await addEarthImage();

      // apply a background to the page
      await fixture.events.click(fixture.screen.getByTestId('FramesLayer'));

      await fixture.events.click(
        fixture.editor.inspector.designPanel.pageBackground.backgroundColorInput
      );
      await fixture.events.keyboard.type('ab12dd');

      // copy the page
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });
      await fixture.events.click(fixture.editor.canvas.rightClickMenu.copy);

      // add new blank page
      await fixture.events.click(newPageCarouselButton);

      // paste page
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });
      await fixture.events.click(fixture.editor.canvas.rightClickMenu.paste);

      // confirm the paste worked.
      const { pages } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          pages: state.pages,
        }))
      );

      verifyPageDuplicated(pages);
    });

    it('should delete the current page when clicking the "Delete" button', async () => {
      // duplicate page
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.duplicatePage
      );

      // insert elements on new page
      await addEarthImage();
      await addText();

      // delete page
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });
      await fixture.events.click(fixture.editor.canvas.rightClickMenu.delete);

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

  describe('right click menu: page/background', () => {
    it("should duplicate the current page when clicking 'Duplicate page'", async () => {
      // insert elements
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
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.duplicatePage
      );

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
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.duplicatePage
      );

      // insert elements on new page
      await addEarthImage();
      await addText();

      // delete page
      await fixture.events.click(fixture.editor.canvas.framesLayer.container, {
        button: 'right',
      });
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.deletePage
      );

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
    it('should set media as the background', async () => {
      const earthImage = await addEarthImage();

      // right click image
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );

      // set image as page background
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.setAsPageBackground
      );

      // verify the image has been set as the background
      // verify the correct page was deleted
      const { currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );

      expect(currentPage.elements.length).toBe(1);
      expect(currentPage.elements[0].isBackground).toBeTrue(1);
    });

    it('should let a user scale and crop media', async () => {
      const video = await addVideo();

      // right click video
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(video.id).node
      );

      // click 'scale and crop image' button
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.scaleAndCropImage
      );

      // Verify element is being edited
      expect(fixture.screen.getByRole('slider')).toBeDefined();
    });

    it('should be able to move media forwards and backwards when possible', async () => {
      const earthImage = await addEarthImage();

      // right click image
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );

      // movement buttons should be disabled
      expect(
        fixture.editor.canvas.rightClickMenu.sendBackward.disabled
      ).toBeTrue();
      expect(
        fixture.editor.canvas.rightClickMenu.sendToBack.disabled
      ).toBeTrue();
      expect(
        fixture.editor.canvas.rightClickMenu.bringForward.disabled
      ).toBeTrue();
      expect(
        fixture.editor.canvas.rightClickMenu.bringToFront.disabled
      ).toBeTrue();

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
      expect(
        fixture.editor.canvas.rightClickMenu.sendBackward.disabled
      ).toBeFalse();
      expect(
        fixture.editor.canvas.rightClickMenu.sendToBack.disabled
      ).toBeFalse();
      expect(
        fixture.editor.canvas.rightClickMenu.bringForward.disabled
      ).toBeTrue();
      expect(
        fixture.editor.canvas.rightClickMenu.bringToFront.disabled
      ).toBeTrue();

      // Move image with 'Send backward'
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.sendBackward
      );

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
      expect(
        fixture.editor.canvas.rightClickMenu.sendBackward.disabled
      ).toBeFalse();
      expect(
        fixture.editor.canvas.rightClickMenu.sendToBack.disabled
      ).toBeFalse();
      expect(
        fixture.editor.canvas.rightClickMenu.bringForward.disabled
      ).toBeFalse();
      expect(
        fixture.editor.canvas.rightClickMenu.bringToFront.disabled
      ).toBeFalse();

      // Move image with 'Bring forward' button
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.bringForward
      );

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
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.sendToBack
      );

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
      expect(
        fixture.editor.canvas.rightClickMenu.sendBackward.disabled
      ).toBeTrue();
      expect(
        fixture.editor.canvas.rightClickMenu.sendToBack.disabled
      ).toBeTrue();
      expect(
        fixture.editor.canvas.rightClickMenu.bringForward.disabled
      ).toBeFalse();
      expect(
        fixture.editor.canvas.rightClickMenu.bringToFront.disabled
      ).toBeFalse();

      // Move image all the way to the front
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.bringToFront
      );

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
      expect(
        fixture.editor.canvas.rightClickMenu.sendBackward.disabled
      ).toBeFalse();
      expect(
        fixture.editor.canvas.rightClickMenu.sendToBack.disabled
      ).toBeFalse();
      expect(
        fixture.editor.canvas.rightClickMenu.bringForward.disabled
      ).toBeTrue();
      expect(
        fixture.editor.canvas.rightClickMenu.bringToFront.disabled
      ).toBeTrue();
    });
  });
});
