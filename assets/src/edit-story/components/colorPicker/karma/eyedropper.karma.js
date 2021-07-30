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
import { Fixture } from '../../../karma';
import { useStory } from '../../../app';

describe('Eyedropper', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableEyedropper: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getElements = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements;
  };

  function getCanvasElementWrapperById(id) {
    return fixture.querySelector(
      `[data-testid="safezone"] [data-element-id="${id}"]`
    );
  }

  it('should get color from the image to page background', async () => {
    // Insert image that will be the color source
    const image = fixture.editor.library.media.item(1);
    // Only regestering image click by clicking twice for some reason
    await fixture.events.click(image);
    await fixture.events.click(image);

    // Click the background element
    const bgCanvasRect =
      fixture.editor.canvas.framesLayer.frames[0].node.getBoundingClientRect();
    // Make sure to click on part of bg element not covered by media element previously
    // assed to canvas
    await fixture.events.mouse.click(
      bgCanvasRect.left + 10,
      bgCanvasRect.bottom - 10
    );

    // Use eyedropper to select the color
    const bgPanel = fixture.editor.inspector.designPanel.pageBackground;
    await fixture.events.click(bgPanel.backgroundColor.button);
    await waitFor(() => expect(bgPanel.backgroundColor.picker).toBeDefined());
    // Once picker is rendered, takes a moment for its internals to properly render
    await waitFor(() =>
      expect(bgPanel.backgroundColor.picker.eyedropper).toBeDefined()
    );
    await fixture.events.click(bgPanel.backgroundColor.picker.eyedropper);
    await waitFor(() => fixture.screen.getByTestId('eyedropperLayer'), {
      timeout: 4000,
    });
    const imageOnCanvas = (await getElements(fixture))[1];
    const imageOnCanvasRect = (
      await getCanvasElementWrapperById(imageOnCanvas.id)
    ).getBoundingClientRect();
    // uncomment and view karma run to see how this isn't properly aligned
    // await fixture.events.mouse.move(
    //   imageOnCanvasRect.right - 2,
    //   imageOnCanvasRect.top + 8
    // );
    // await fixture.events.sleep(10000);
    await fixture.events.mouse.click(
      imageOnCanvasRect.right - 2,
      imageOnCanvasRect.top + 8
    );

    await fixture.snapshot('BG color from image');
    expect(bgPanel.backgroundColor.hex.value).toBe('DBB198');
  });
});
