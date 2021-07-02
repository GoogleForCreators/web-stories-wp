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

describe('Eyedropper', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should get color from the image to page background', async () => {
    // Insert image that will be the color source
    const image = fixture.editor.library.media.item(1);
    const canvas = fixture.editor.canvas.framesLayer.fullbleed;
    await fixture.events.mouse.seq(({ down, moveRel, up }) => [
      moveRel(image, 1, 1),
      down(),
      moveRel(canvas, 30, 30),
      up(),
    ]);

    // Click the background element
    await fixture.events.click(
      fixture.editor.canvas.framesLayer.frames[0].node
    );

    // Use eyedropper to select the color
    const bgPanel = fixture.editor.inspector.designPanel.pageBackground;
    await fixture.events.click(bgPanel.backgroundColor.button);
    await waitFor(() => expect(bgPanel.backgroundColor.picker).toBeDefined());
    await fixture.events.click(bgPanel.backgroundColor.picker.eyedropper);
    await waitFor(() => expect(bgPanel.backgroundColor.picker).toBeDefined());
    await waitFor(() => fixture.screen.getByTestId('eyedropperLayer'), {
      timeout: 4000,
    });
    const fullbleed = fixture.querySelector('[data-testid="fullbleed"]');
    const rect = fullbleed.getBoundingClientRect();
    await fixture.events.mouse.click(rect.left + 61, rect.top + 61);

    await fixture.snapshot('BG color from image');
    expect(bgPanel.backgroundColor.hex.value).toBe('C2A387');
  });
});
