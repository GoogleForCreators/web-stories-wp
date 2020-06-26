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
import { useStory } from '../../../app/story';

export function initHelpers(data) {
  async function getElements() {
    const storyContext = await data.fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements;
  }

  async function addInitialText() {
    await data.fixture.events.click(data.fixture.editor.library.textAdd);

    const [{ id: bgId }, { id: textId }] = await getElements();
    data.bgId = bgId;
    data.textId = textId;

    await data.fixture.editor.canvas.framesLayer
      .frame(data.textId)
      .waitFocusedWithin();
  }

  function getTextContent() {
    return data.fixture.editor.canvas.framesLayer.frame(data.textId)
      .textContent;
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
    const textEditor = data.fixture.editor.canvas.editLayer.text;
    await data.fixture.events.click(textEditor);
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
  };
}
