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
import { clearableAttributes } from '../../../elements/image';
import { Fixture } from '../../../karma';
import objectPick from '../../../utils/objectPick';
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
    it('should be able to copy a page and paste it to a new page', async () => {
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

  describe('right click menu: copying, pasting, and clearing styles', () => {
    const clearableImageProperties = Object.keys(clearableAttributes);

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
        fixture.editor.inspector.designPanel.borderRadius.radius()
      );
      await fixture.events.keyboard.type('50');

      // add filter
      await fixture.events.click(
        fixture.editor.inspector.designPanel.filters.solid
      );

      // add opacity
      await fixture.events.click(
        fixture.editor.inspector.designPanel.layerStyle.opacity
      );
      await fixture.events.keyboard.type('40');

      // copy earth image styles
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.copyImageStyles
      );

      // paste styles onto ranger image
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(rangerImage.id).node
      );
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.pasteImageStyles
      );

      // verify that the styles were copied and pasted
      const { currentPage } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          currentPage: state.currentPage,
        }))
      );

      const images = currentPage.elements.filter(
        (element) => !element.isBackground
      );

      const copiedProperties = objectPick(images[0], clearableImageProperties);
      const pastedProperties = objectPick(images[0], clearableImageProperties);

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
        fixture.editor.inspector.designPanel.borderRadius.radius()
      );
      await fixture.events.keyboard.type('50');

      // add filter
      await fixture.events.click(
        fixture.editor.inspector.designPanel.filters.solid
      );

      // add opacity
      await fixture.events.click(
        fixture.editor.inspector.designPanel.layerStyle.opacity
      );
      await fixture.events.keyboard.type('40');

      // clear earth styles
      await rightClickOnTarget(
        fixture.editor.canvas.framesLayer.frame(earthImage.id).node
      );
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.clearImageStyles
      );

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
        clearableAttributes
      );
    });
  });
});
