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

describe('Panel: Color Presets', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    localStorage.setItem(
      'web_stories_ui_panel_settings:stylepreset-color',
      JSON.stringify({ isCollapsed: false, height: 200 })
    );
  });

  afterEach(() => {
    fixture.restore();
    localStorage.clear();
  });

  describe('CUJ: Creator can Apply or Save a Color from/to Their Preset Library: Display Panel', () => {
    it('should display color presets panel for a text element', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      const addButton = fixture.editor.inspector.designPanel.colorPreset.add;
      expect(addButton).toBeTruthy();
    });
  });

  describe('CUJ: Creator can Apply or Save a Color from/to Their Preset Library: Manage Color Presets', () => {
    it('should allow deleting a color preset', async () => {
      // Add text element and a color preset.
      await fixture.events.click(fixture.editor.library.textAdd);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.add
      );

      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.edit
      );

      await fixture.snapshot('Color presets in edit mode');

      // Verify being in edit mode.
      const exitEditButton =
        fixture.editor.inspector.designPanel.colorPreset.exit;
      expect(exitEditButton).toBeTruthy();
      const deletePresetButton =
        fixture.editor.inspector.designPanel.colorPreset.delete;

      expect(deletePresetButton).toBeTruthy();
      await fixture.events.click(deletePresetButton);

      // Verify the edit mode was exited (due to removing all elements).
      expect(
        () => fixture.editor.inspector.designPanel.colorPreset.exit
      ).toThrow();

      // Verify there is no edit button either (since we have no presets left).
      expect(
        () => fixture.editor.inspector.designPanel.colorPreset.edit
      ).toThrow();
    });
  });
});
