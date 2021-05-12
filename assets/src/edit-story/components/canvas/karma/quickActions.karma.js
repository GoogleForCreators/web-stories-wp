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
import { ACTION_TEXT } from '../../../app/highlights';
import { Fixture } from '../../../karma';

describe('Quick Actions integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableQuickActionMenus: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
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
    });

    it(`clicking the \`${ACTION_TEXT.INSERT_BACKGROUND_MEDIA}\` button should select the background and open the media tab in the library`, async () => {
      // change the library pane so media isn't visible
      await fixture.events.click(fixture.editor.library.shapesTab);

      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.insertBackgroundMediaButton
      );

      expect(fixture.editor.library.media).not.toBeNull();
    });

    it(`clicking the \`${ACTION_TEXT.INSERT_TEXT}\` button should select the background and open the text tab in the library`, async () => {
      // click quick menu button
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.insertTextButton
      );

      expect(fixture.editor.library.text).not.toBeNull();
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
});
