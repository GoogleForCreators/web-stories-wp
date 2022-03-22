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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';

export function initHelpers(data) {
  async function getElements() {
    const storyContext = await data.fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements;
  }

  async function setFontSize(size) {
    const fontSize =
      data.fixture.editor.inspector.designPanel.textStyle.fontSize;
    await data.fixture.events.click(fontSize, { clickCount: 3 });
    await data.fixture.events.keyboard.type(size);
    await data.fixture.events.keyboard.press('tab');
    // Give time for the font size to be applied.
    await data.fixture.events.sleep(100);
  }

  async function addInitialText(addExtra = false) {
    await data.fixture.editor.library.textTab.click();
    await data.fixture.events.click(
      data.fixture.editor.library.text.preset('Paragraph')
    );
    await waitFor(() => data.fixture.editor.canvas.framesLayer.frames[1].node);

    if (addExtra) {
      // Move the first text field 10 steps down to avoid placing these on top of each other.
      await repeatPress('ArrowDown', 10);
      await data.fixture.editor.library.textTab.click();
      // Select background for being able to insert another text.
      await data.fixture.events.mouse.clickOn(
        data.fixture.editor.canvas.framesLayer.frames[0].node,
        '90%',
        '90%'
      );
      await data.fixture.events.click(
        data.fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(
        () => data.fixture.editor.canvas.framesLayer.frames[2].node
      );
    }

    await richTextHasFocus();

    const elements = await getElements();
    data.bgId = elements[0].id;
    data.textId = elements[1].id;

    if (addExtra) {
      data.extraId = elements[2].id;

      // Second text field is currently selected as it was last to be added
      // Change value of second text field and exit edit mode
      await data.fixture.events.keyboard.press('Enter');
      await data.fixture.events.keyboard.type('Number #2');
      await data.fixture.events.keyboard.press('Escape');
    }
  }

  async function selectTextField(index = 0) {
    const node = data.fixture.editor.canvas.framesLayer.frame(
      index === 0 ? data.textId : data.extraId
    ).node;
    await data.fixture.events.click(node);
  }

  async function selectBothTextFields() {
    await selectTextField(0);
    await data.fixture.events.keyboard.down('shift');
    await selectTextField(1);
    await data.fixture.events.keyboard.up('shift');
  }

  function getTextContent(index = 0) {
    return data.fixture.editor.canvas.framesLayer.frame(
      index === 0 ? data.textId : data.extraId
    ).textContentHTML;
  }

  async function richTextHasFocus() {
    await data.fixture.editor.canvas.waitFocusedWithin();
  }

  function repeatPress(key, count) {
    let remaining = count;
    const press = () => {
      if (remaining === 0) {
        return Promise.resolve(true);
      }
      remaining--;
      return data.fixture.events.keyboard.press(key).then(press);
    };
    return press();
  }

  async function setSelection(startOffset, endOffset) {
    // Assume text is in edit-mode - click inside editable text field
    // and then press "up" a number of times to ensure cursor is at start
    const textEditor = data.fixture.querySelector('[data-testid="textEditor"]');
    const { height } = textEditor.getBoundingClientRect();
    await data.fixture.events.mouse.clickOn(textEditor, 30, height / 2);
    await repeatPress('ArrowUp', 10);
    // Move to start of selection and hold shift while selecting
    await repeatPress('ArrowRight', startOffset);
    await data.fixture.events.keyboard.down('shift');
    await repeatPress('ArrowRight', endOffset - startOffset);
    await data.fixture.events.keyboard.up('shift');
  }

  return {
    getElements,
    addInitialText,
    getTextContent,
    setSelection,
    richTextHasFocus,
    selectTextField,
    selectBothTextFields,
    setFontSize,
  };
}
