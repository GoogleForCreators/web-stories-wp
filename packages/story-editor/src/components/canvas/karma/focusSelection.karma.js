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
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { Fixture } from '../../../karma';
import useInsertElement from '../useInsertElement';

describe('LibraryTabs integration', () => {
  let fixture;
  let image;
  let imageFrame;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    const insertElement = await fixture.renderHook(() => useInsertElement());

    // add element to canvas
    image = await fixture.act(() =>
      insertElement('image', {
        x: 200,
        y: 0,
        width: 640 / 2,
        height: 529 / 2,
        resource: {
          id: 10,
          type: 'image',
          mimeType: 'image/jpg',
          src: 'http://localhost:9876/__static__/earth.jpg',
          alt: 'Earth',
          width: 640,
          height: 529,
          baseColor: '#734727',
        },
      })
    );
    imageFrame = fixture.editor.canvas.framesLayer.frame(image.id).node;
  });

  afterEach(() => {
    fixture.restore();
  });

  it('focusing the canvas from the library should change the selected element', async () => {
    // verify background is not selected
    const initialSelectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(initialSelectedElements.length).toBe(1);
    expect(Boolean(initialSelectedElements[0].isBackground)).toBe(false);

    // focus first item in media panel
    await fixture.events.focus(fixture.editor.library.media.upload);

    // tab into media elements
    await fixture.events.keyboard.press('Tab');
    // tab over to next button on media element mask
    await fixture.events.keyboard.press('Tab');
    // tab into canvas
    await fixture.events.keyboard.press('Tab');

    // verify background is selected
    const selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].isBackground).toBe(true);
  });

  it('canvas element focus changes should set the selected element', async () => {
    // focus element in canvas
    await fixture.events.focus(imageFrame);

    const initialSelectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );

    expect(initialSelectedElements.length).toBe(1);

    // Shift tab and background should be selected
    await fixture.events.keyboard.down('Shift');
    await fixture.events.keyboard.press('Tab');
    await fixture.events.keyboard.up('Shift');

    const selectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );

    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].id).not.toBe(initialSelectedElements[0].id);
    expect(selectedElements[0].isBackground).toBe(true);
  });

  it('focus changes external to the canvas should not change the selected element', async () => {
    // verify initial selected element is the image
    const initialSelectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(initialSelectedElements.length).toBe(1);
    expect(Boolean(initialSelectedElements[0].isBackground)).toBe(false);

    // select new image element
    await fixture.events.click(imageFrame);

    // tab away from canvas
    await fixture.events.keyboard.press('Tab');

    // verify that the selected element remained the same
    const finalSelectedElements = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElements)
    );
    expect(finalSelectedElements.length).toBe(1);
    expect(finalSelectedElements[0].id).toBe(initialSelectedElements[0].id);
  });
});
