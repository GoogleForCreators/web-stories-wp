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
import { useStory } from '../../../app/story';

export function initHelpers(data) {
  async function enterEditMode() {
    await data.fixture.events.click(
      data.fixture.editor.canvas.framesLayer.frame(data.bgId)
    );
    await data.fixture.events.click(
      data.fixture.editor.canvas.framesLayer.frame(data.textId)
    );
    await data.fixture.events.keyboard.shortcut('Enter');
  }

  async function exitEditMode() {
    await data.fixture.events.keyboard.shortcut('Escape');
  }

  async function getElements() {
    const storyContext = await data.fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements;
  }

  async function addInitialText() {
    await data.fixture.events.click(data.fixture.editor.library.textAdd);

    const [{ id: bgId }, { id: textId }] = await getElements();
    data.bgId = bgId;
    data.textId = textId;

    await waitFor(() =>
      expect(data.fixture.editor.canvas.framesLayer.frame(textId)).toBeTruthy()
    );
  }

  function getTextContent() {
    return data.fixture.editor.canvas.framesLayer.frame(data.textId)
      .textContent;
  }

  return {
    enterEditMode,
    exitEditMode,
    getElements,
    addInitialText,
    getTextContent,
  };
}
