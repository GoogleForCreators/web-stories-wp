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
import { Fixture } from '../../../karma';

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
    it('should be able to copy a page background and paste it to a new page', async () => {
      // apply a background to the page
      await fixture.events.click(fixture.screen.getByTestId('FramesLayer'));

      await fixture.events.click(
        fixture.editor.inspector.designPanel.pageBackground.backgroundColorInput
      );
      await fixture.events.keyboard.type('ab12dd');

      // copy the page background
      await openRightClickMenu();
      await fixture.events.click(fixture.editor.canvas.rightClickMenu.copy);

      // add new page
      await fixture.events.click(newPageButton);

      // paste page background
      await openRightClickMenu();
      await fixture.events.click(fixture.editor.canvas.rightClickMenu.paste);

      // confirm the paste worked.
      const { pages } = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          pages: state.pages,
        }))
      );

      expect(pages[0].backgroundColor).toStrictEqual(pages[1].backgroundColor);
    });
  });
});
