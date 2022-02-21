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
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';

describe('Canvas Keyboard Shortcuts', () => {
  let fixture;
  let elementIds;

  async function insertMediaByIndex(index) {
    const mediaItem = fixture.editor.library.media.item(index);
    await fixture.events.mouse.clickOn(mediaItem, 20, 20);
  }

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    // Let's insert three images
    await insertMediaByIndex(0);
    await insertMediaByIndex(1);
    await insertMediaByIndex(2);

    // And let's get the ID's of those three elements for easy access later
    const storyContext = await fixture.renderHook(() => useStory());
    elementIds = storyContext.state.currentPage.elements
      .slice(1)
      .map(({ id }) => id);
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  it('should have the last element selected by default', async () => {
    expect(await getSelection()).toEqual([elementIds[2]]);
  });

  it('should select all elements when pressing mod+a shortcut', async () => {
    await fixture.events.focus(fixture.editor.canvas.framesLayer.fullbleed);
    await fixture.events.keyboard.shortcut('mod+a');
    expect(await getSelection()).toEqual([...elementIds]);
  });
});
