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
 * External dependencies
 */
import { waitForElementToBeRemoved } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../karma/fixture';
import { useInsertElement } from '../../../canvas';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';
import createSolid from '../../../../utils/createSolid';
import { BACKGROUND_TEXT_MODE } from '../../../../constants';
import { useStory } from '../../../../app/story';

describe('Panel: Style Presets', () => {
  let fixture;
  let frame;

  const ADD_BUTTON = 'Add style preset';
  const APPLY_BUTTON = 'Apply style preset';

  const addText = async (extraProps = null) => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    const element = await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'Hello, presets!',
        x: 40,
        y: 40,
        width: 250,
        ...extraProps,
      })
    );
    return element;
  };

  const selectTarget = async (target) => {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.keyboard.down('Shift');
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
    await fixture.events.keyboard.up('Shift');
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Display Panel', () => {
    it('should display text styles panel for a text element', async () => {
      await addText();
      const addButton = fixture.screen.getByRole('button', {
        name: ADD_BUTTON,
      });
      expect(addButton).toBeTruthy();
    });

    it('should not display text styles panel in case of mixed multi-selection', async () => {
      await addText();
      // Add a shape element.
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const element = await fixture.act(() =>
        insertElement('shape', {
          x: 10,
          y: 10,
          width: 50,
          height: 50,
          backgroundColor: createSolid(1, 15, 15, 0.2),
          backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
        })
      );
      const target = fixture.editor.canvas.framesLayer.frame(element.id).node;
      await selectTarget(target);
      // Verify that the panel is not found.
      const addButton = fixture.screen.queryByRole('button', {
        name: ADD_BUTTON,
      });
      expect(addButton).toBeNull();
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Save Text Style', () => {
    beforeEach(async () => {
      const element = await addText({
        backgroundColor: createSolid(15, 15, 15, 0.2),
        backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
        content: '<span style="font-style: italic">Hello world</span>',
        lineHeight: 2,
      });
      frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
    });

    it('should allow adding new text style from a text element', async () => {
      const addButton = fixture.screen.getByRole('button', {
        name: ADD_BUTTON,
      });
      await addButton.click();
      const applyPresetButton = fixture.screen.queryByRole('button', {
        name: APPLY_BUTTON,
      });
      // Verify that the preset has been added
      expect(applyPresetButton).toBeDefined();
    });

    it('should allow adding new text style from multi-selection', async () => {
      // Add a second text element & select both.
      await addText({
        x: 200,
        y: 200,
        width: 250,
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: '<span style="font-weight: 700">Second text</span>',
      });
      await selectTarget(frame);

      // Verify that two presets have been added.
      const addButton = fixture.screen.getByRole('button', {
        name: ADD_BUTTON,
      });
      await addButton.click();
      const applyPresetButtons = fixture.screen.getAllByRole('button', {
        name: APPLY_BUTTON,
      });
      expect(applyPresetButtons.length).toBe(2);
      await fixture.snapshot('2 style presets added');
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Manage Text Style Presets', () => {
    // Disable reason: edit icon does not work in test mode for some reason.
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should allow deleting a text style preset', async () => {
      // Add text element and style preset.
      await addText();
      const addButton = fixture.screen.getByRole('button', {
        name: ADD_BUTTON,
      });
      await addButton.click();

      const applyPresetButton = fixture.screen.queryByRole('button', {
        name: APPLY_BUTTON,
      });

      const editButton = fixture.screen.getByRole('button', {
        name: 'Edit style presets',
      });
      await fixture.events.click(editButton);

      // Apply button should get replaced by delete button.
      await waitForElementToBeRemoved(applyPresetButton);

      const deletePresetButton = fixture.screen.getByRole('button', {
        name: 'Delete style preset',
      });
      await fixture.events.click(deletePresetButton);
      await waitForElementToBeRemoved(deletePresetButton);
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Apply Text Style Presets', () => {
    beforeEach(async () => {
      const element = await addText();
      frame = fixture.editor.canvas.framesLayer.frame(element.id).node;
    });

    it('should apply text style to a single text element', async () => {
      // Add a preset
      const addButton = fixture.screen.getByRole('button', {
        name: ADD_BUTTON,
      });
      await addButton.click();
      await addText({
        x: 200,
        y: 200,
        backgroundColor: createSolid(0, 0, 0),
        backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
      });
      const applyPresetButton = fixture.screen.queryByRole('button', {
        name: APPLY_BUTTON,
      });
      await applyPresetButton.click();
      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElements[0].backgroundTextMode).toEqual(
        BACKGROUND_TEXT_MODE.NONE
      );
      await fixture.snapshot('2 texts same attributes');
    });

    it('should apply text style to multiple text elements', async () => {
      const addButton = fixture.screen.getByRole('button', {
        name: ADD_BUTTON,
      });
      await addButton.click();
      await addText({
        x: 200,
        y: 200,
        backgroundColor: createSolid(0, 0, 0),
        backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
      });
      // Select both texts
      await selectTarget(frame);

      const applyPresetButton = fixture.screen.queryByRole('button', {
        name: APPLY_BUTTON,
      });
      await applyPresetButton.click();
      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElements[0].backgroundTextMode).toEqual(
        BACKGROUND_TEXT_MODE.NONE
      );
      expect(storyContext.state.selectedElements[1].backgroundTextMode).toEqual(
        BACKGROUND_TEXT_MODE.NONE
      );
      await fixture.snapshot('2 selected texts, same style');
    });
  });
});
