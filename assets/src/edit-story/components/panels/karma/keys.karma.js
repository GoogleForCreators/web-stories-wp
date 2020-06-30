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
import { useInsertElement } from '../../canvas';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';

describe('Canvas keys integration', () => {
  let fixture;
  let element1;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    const insertElement = await fixture.renderHook(() => useInsertElement());
    element1 = await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: `Page 1`,
        x: 40,
        y: 40,
        width: 250,
      })
    );

    await fixture.editor.canvas.framesLayer.waitFocusedWithin();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  async function getNonBackgroundElementIds() {
    const storyContext = await fixture.renderHook(() => useStory());
    const elements = storyContext.state.currentPage.elements;
    const nonBackgroundElements = elements.filter(
      ({ isBackground }) => !isBackground
    );
    return nonBackgroundElements.map(({ id }) => id);
  }

  it('should open the link panel when cmd + k is clicked', async () => {
    expect(await getNonBackgroundElementIds()).toEqual([element1.id]);
    expect(await getSelection()).toEqual([element1.id]);
    const linkInput = fixture.querySelector('[data-testid="link-input-field"]');
    expect(linkInput.contains(document.activeElement)).toBeFalse();
    await fixture.events.keyboard.shortcut('mod+k');
    expect(linkInput.contains(document.activeElement)).toBeTrue();
  });
});
