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
 * Internal dependencies
 */
import { Fixture } from '../../../../karma/fixture';
import { useInsertElement } from '../../../canvas';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';

describe('Panel: Style Presets', () => {
  let fixture;

  const ADD_BUTTON = 'Add color preset';
  const EDIT_BUTTON = 'Edit color presets';
  const EXIT_EDIT_MODE = 'Exit edit mode';

  const addText = async () => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'Hello, presets!',
      })
    );
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Display Panel', () => {
    it('should display color presets panel for a text element', async () => {
      await addText();
      const addButton = fixture.screen.getByRole('button', {
        name: ADD_BUTTON,
      });
      expect(addButton).toBeTruthy();
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Manage Text Style Presets', () => {
    it('should allow deleting a color preset', async () => {
      // Add text element and a color preset.
      await addText();
      const addButton = fixture.screen.getByRole('button', {
        name: ADD_BUTTON,
      });
      await addButton.click();

      const editButton = fixture.screen.getByRole('button', {
        name: EDIT_BUTTON,
      });
      await fixture.events.click(editButton);

      await fixture.snapshot('Color presets in edit mode');

      // Verify being in edit mode.
      const exitEditButton = fixture.screen.getByRole('button', {
        name: EXIT_EDIT_MODE,
      });
      expect(exitEditButton).toBeTruthy();
      const deletePresetButton = fixture.screen.getByRole('button', {
        name: 'Delete color preset',
      });

      expect(deletePresetButton).toBeTruthy();
      await fixture.events.click(deletePresetButton);

      // Verify the edit mode was exited (due to removing all elements).
      expect(
        fixture.screen.queryByRole('button', {
          name: EXIT_EDIT_MODE,
        })
      ).toBeFalsy();

      // Verify there is no edit button either (since we have no presets left).
      expect(
        fixture.screen.queryByRole('button', {
          name: EDIT_BUTTON,
        })
      ).toBeFalsy();
    });
  });
});
