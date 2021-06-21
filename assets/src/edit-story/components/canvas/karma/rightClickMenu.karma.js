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
  let newPageButton;
  let duplicatePageButton;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableRightClickMenus: true });
    await fixture.render();

    newPageButton = fixture.screen.getByRole('button', {
      name: /New Page/,
    });
    duplicatePageButton = fixture.screen.getByRole('button', {
      name: /Duplicate Page/,
    });
  });

  afterEach(() => {
    fixture.restore();
  });

  const openRightClickMenu = async () => {
    // right click canvas
    await fixture.events.click(fixture.screen.getByTestId('FramesLayer'), {
      button: 'right',
    });
  };

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
      await openRightClickMenu();

      expect(fixture.editor.canvas.rightClickMenu).not.toBeNull();
    });

    // NOTE: this opens the real right click menu, which can't be closed
    // after it is opened :grimacing:.
    it('right clicking away from the canvas should not open the custom right click menu', async () => {
      // right click outside canvas
      await fixture.events.click(duplicatePageButton, {
        button: 'right',
      });
      expect(
        fixture.screen.queryByTestId(
          'right-click-context-menu[aria-expanded="true"]'
        )
      ).toBeNull();

      // close browser right click menu
      await fixture.events.click(fixture.screen.getByTestId('FramesLayer'));
    });
  });

  describe('right click menu: page/background', () => {
    it('should be able to copy a page and paste it to a new page', async () => {
      // insert element
      const insertElement = await fixture.renderHook(() => useInsertElement());
      await fixture.act(() =>
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

      // apply a background to the page
      await fixture.events.click(fixture.screen.getByTestId('FramesLayer'));

      await fixture.events.click(
        fixture.editor.inspector.designPanel.pageBackground.backgroundColorInput
      );
      await fixture.events.keyboard.type('ab12dd');

      // copy the page
      await openRightClickMenu();
      await fixture.events.click(fixture.editor.canvas.rightClickMenu.copy);

      // add new blank page
      await fixture.events.click(newPageButton);

      // paste page
      await openRightClickMenu();
      await fixture.events.click(fixture.editor.canvas.rightClickMenu.paste);

      // confirm the paste worked.
      const { pages } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          pages: state.pages,
        }))
      );

      verifyPageDuplicated(pages);
    });

    it('should duplicate the current page', async () => {
      // insert elements
      const insertElement = await fixture.renderHook(() => useInsertElement());
      await fixture.act(() =>
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
      await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Hello world!',
          x: 10,
          y: 20,
          width: 400,
        })
      );

      // duplicate page
      await openRightClickMenu();
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

    it('should delete the current page when clicking the "Delete" button', async () => {
      // duplicate page
      await openRightClickMenu();
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.duplicatePage
      );

      // insert elements on new page
      const insertElement = await fixture.renderHook(() => useInsertElement());
      await fixture.act(() =>
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
      await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Hello world!',
          x: 10,
          y: 20,
          width: 400,
        })
      );

      // delete page
      await openRightClickMenu();
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

    it('should delete the current page when clicking the "Delete Page" button', async () => {
      // duplicate page
      await openRightClickMenu();
      await fixture.events.click(
        fixture.editor.canvas.rightClickMenu.duplicatePage
      );

      // insert elements on new page
      const insertElement = await fixture.renderHook(() => useInsertElement());
      await fixture.act(() =>
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
      await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'Hello world!',
          x: 10,
          y: 20,
          width: 400,
        })
      );

      // delete page
      await openRightClickMenu();
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
});
