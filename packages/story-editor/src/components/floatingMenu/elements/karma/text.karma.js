/*
 * Copyright 2022 Google LLC
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
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app/story';
import { initHelpers } from '../../../../karma/richText/_utils';

describe('Design Menu: Text Styles', () => {
  let fixture;
  const data = {};

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    await fixture.collapseHelpCenter();
    await fixture.showFloatingMenu();

    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    data.fixture = fixture;
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelectedElement = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements[0];
  };

  const setLinearGradient = async () => {
    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.button
    );

    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.picker.custom
    );

    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.picker
        .linearGradientPickerButton
    );
  };

  const setRadialGradient = async () => {
    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.button
    );

    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.picker.custom
    );

    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.picker
        .radialGradientPickerButton
    );
    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.picker
        .radialGradientPickerButton
    );

    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.picker.gradientStopEndButton
    );

    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.picker.hexInput
    );
    await fixture.events.keyboard.type('b05151');
    await new Promise((r) => setTimeout(r, 100));
  };

  const addText = async () => {
    // Enter edit-mode
    await fixture.events.keyboard.press('Enter');
    await fixture.screen.findByTestId('textEditor');

    // Increase the font size for making sure setting selection works as expected.
    await fixture.events.click(fixture.editor.canvas.designMenu.fontSize, {
      clickCount: 3,
    });
    await fixture.events.keyboard.type('30');
    await fixture.events.keyboard.press('tab');
  };

  const closeColorPicker = async () => {
    const colorPicker = fixture.screen.queryByRole('dialog', {
      name: /Color and gradient picker/,
    });
    const dismissPicker = within(colorPicker).queryByRole('button', {
      name: 'Close',
    });
    await fixture.events.click(dismissPicker);
  };

  const setSolidColor = async () => {
    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.button
    );

    await fixture.events.click(
      fixture.editor.canvas.designMenu.fontColor.picker.defaultColor('#ff7096')
    );
  };

  const exitEditMode = async () => {
    // Click on background to exit edit mode.
    await fixture.events.mouse.clickOn(
      fixture.editor.canvas.framesLayer.frames[0].node,
      '10%',
      '10%'
    );
  };

  it('should allow whole number font sizes', async () => {
    const fontSize = fixture.editor.canvas.designMenu.fontSize;

    const size = 42;

    await fixture.events.focus(fontSize);
    await fixture.events.keyboard.type(`${size}`);
    await fixture.events.keyboard.press('tab');

    const element = await getSelectedElement();
    expect(element.fontSize).toBe(size);
  });

  it('should allow fractional font sizes', async () => {
    const fontSize = fixture.editor.canvas.designMenu.fontSize;

    const size = 15.25;

    await fixture.events.focus(fontSize);
    await fixture.events.keyboard.type(`${size}`);
    await fixture.events.keyboard.press('tab');

    const element = await getSelectedElement();
    expect(element.fontSize).toBe(size);
  });

  describe('Text Color', () => {
    const { setSelection } = initHelpers(data);
    it('should allow changing text color from the design menu', async () => {
      await setSolidColor();
      const element = await getSelectedElement();
      expect(element.content).toBe(
        '<span style="color: #ff7096">Fill in some text</span>'
      );
    });

    it('should allow changing linear gradient text color from the design menu', async () => {
      await setLinearGradient();
      const element = await getSelectedElement();
      expect(element.content).toBe(
        '<span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: linear-gradient(0.5turn, #000 0%, #010101 100%); background-clip: text">Fill in some text</span>'
      );
    });

    it('should allow changing radial gradient text color from the design menu', async () => {
      await setRadialGradient();
      const element = await getSelectedElement();
      expect(element.content).toBe(
        '<span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: radial-gradient(#b05151 0%, #010101 100%); background-clip: text">Fill in some text</span>'
      );
    });

    it('should allow changing text color for a selection from the design menu', async () => {
      await addText();

      // Select character 6 and 7 (the part "in" in "Fill in some text")
      await setSelection(5, 7);
      await setSolidColor();
      await closeColorPicker();
      await exitEditMode();

      const element = await getSelectedElement();
      expect(element.content).toBe(
        'Fill <span style="color: #ff7096">in</span> some text'
      );

      await fixture.snapshot('Mixed color value in the floating menu');
    });

    it('should allow changing linear gradient color for a selection from the design menu', async () => {
      await addText();

      // Select character 6 and 7 (the part "in" in "Fill in some text")
      await setSelection(5, 7);
      await setLinearGradient();
      await closeColorPicker();
      await exitEditMode();

      const element = await getSelectedElement();
      expect(element.content).toBe(
        'Fill <span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: linear-gradient(0.5turn, #000 0%, #010101 100%); background-clip: text">in</span> some text'
      );
    });

    it('should allow changing radial gradient color for a selection from the design menu', async () => {
      await addText();

      // Select character 6 and 7 (the part "in" in "Fill in some text")
      await setSelection(5, 7);
      await setRadialGradient();
      await closeColorPicker();
      await exitEditMode();

      const element = await getSelectedElement();
      expect(element.content).toBe(
        'Fill <span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: radial-gradient(#b05151 0%, #010101 100%); background-clip: text">in</span> some text'
      );
    });

    it('should allow adding solid and linear gradient color for a selection from the design menu', async () => {
      await addText();

      await setSelection(0, 4);
      await setSolidColor();

      // Select character 6 and 7 (the part "in" in "Fill in some text")
      await setSelection(5, 7);
      await setLinearGradient();
      await closeColorPicker();
      await exitEditMode();

      const element = await getSelectedElement();
      expect(element.content).toBe(
        '<span style="color: #ff7096">Fill</span> <span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: linear-gradient(0.5turn, #000 0%, #010101 100%); background-clip: text">in</span> some text'
      );
    });

    it('should allow adding solid and radial gradient color for a selection from the design menu', async () => {
      await addText();
      await setSelection(0, 4);
      await setSolidColor();

      // Select character 6 and 7 (the part "in" in "Fill in some text")
      await setSelection(5, 7);
      await setRadialGradient();
      await closeColorPicker();
      await exitEditMode();

      const element = await getSelectedElement();
      expect(element.content).toBe(
        '<span style="color: #ff7096">Fill</span> <span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: radial-gradient(#b05151 0%, #010101 100%); background-clip: text">in</span> some text'
      );
    });

    it('should allow adding linear and radial gradient color for a selection from the design menu', async () => {
      await addText();
      await setSelection(0, 4);
      await setLinearGradient();

      // Select character 6 and 7 (the part "in" in "Fill in some text")
      await setSelection(5, 7);
      await setRadialGradient();
      await closeColorPicker();
      await exitEditMode();

      const element = await getSelectedElement();
      expect(element.content).toBe(
        '<span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: linear-gradient(0.5turn, #000 0%, #010101 100%); background-clip: text">Fill</span> <span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: radial-gradient(#b05151 0%, #010101 100%); background-clip: text">in</span> some text'
      );
    });

    it('should allow adding solid, linear and radial gradient color for a selection from the design menu', async () => {
      await addText();
      await setSelection(0, 4);
      await setLinearGradient();

      // Select character 6 and 7 (the part "in" in "Fill in some text")
      await setSelection(5, 7);
      await setRadialGradient();

      await setSelection(8, 12);
      await setSolidColor();

      await closeColorPicker();
      await exitEditMode();

      const element = await getSelectedElement();
      expect(element.content).toBe(
        '<span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: linear-gradient(0.5turn, #000 0%, #010101 100%); background-clip: text">Fill</span> <span style="-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-image: radial-gradient(#b05151 0%, #010101 100%); background-clip: text">in</span> <span style="color: #ff7096">some</span> text'
      );
    });
  });

  describe('Text Formatting', () => {
    const { setSelection } = initHelpers(data);

    it('should allow toggling bold, italic, underline from the design menu', async () => {
      await fixture.events.click(fixture.editor.canvas.designMenu.bold.node);
      await fixture.events.click(fixture.editor.canvas.designMenu.italic.node);
      await fixture.events.click(
        fixture.editor.canvas.designMenu.underline.node
      );

      expect(fixture.editor.canvas.designMenu.bold.checked).toBeTrue();
      expect(fixture.editor.canvas.designMenu.italic.checked).toBeTrue();
      expect(fixture.editor.canvas.designMenu.underline.checked).toBeTrue();

      const formattedText = await getSelectedElement();
      expect(formattedText.content).toBe(
        '<span style="font-weight: 700; font-style: italic; text-decoration: underline">Fill in some text</span>'
      );

      // Uncheck all again.
      await fixture.events.click(fixture.editor.canvas.designMenu.bold.node);
      await fixture.events.click(fixture.editor.canvas.designMenu.italic.node);
      await fixture.events.click(
        fixture.editor.canvas.designMenu.underline.node
      );

      expect(fixture.editor.canvas.designMenu.bold.checked).toBeFalse();
      expect(fixture.editor.canvas.designMenu.italic.checked).toBeFalse();
      expect(fixture.editor.canvas.designMenu.underline.checked).toBeFalse();

      const text = await getSelectedElement();
      expect(text.content).toBe('Fill in some text');
    });

    it('should allow format a selection of a text from the design menu', async () => {
      await addText();

      // Select character 6 and 7 (the part "in" in "Fill in some text")
      await setSelection(5, 7);

      await fixture.events.click(fixture.editor.canvas.designMenu.bold.node);
      await fixture.events.click(fixture.editor.canvas.designMenu.italic.node);
      await fixture.events.click(
        fixture.editor.canvas.designMenu.underline.node
      );

      expect(fixture.editor.canvas.designMenu.bold.checked).toBeTrue();
      expect(fixture.editor.canvas.designMenu.italic.checked).toBeTrue();
      expect(fixture.editor.canvas.designMenu.underline.checked).toBeTrue();

      await exitEditMode();

      const formattedText = await getSelectedElement();
      expect(formattedText.content).toBe(
        'Fill <span style="font-weight: 700; font-style: italic; text-decoration: underline">in</span> some text'
      );

      // Verify all toggles show false now since we have mixed values inside the text.
      expect(fixture.editor.canvas.designMenu.bold.checked).toBeFalse();
      expect(fixture.editor.canvas.designMenu.italic.checked).toBeFalse();
      expect(fixture.editor.canvas.designMenu.underline.checked).toBeFalse();
    });
  });
});
