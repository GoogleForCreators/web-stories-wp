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
import { Fixture } from '../../../karma';
import useInsertElement from '../useInsertElement';

describe('Element border click', () => {
  let fixture;
  let image;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    const insertElement = await fixture.renderHook(() => useInsertElement());
    image = await fixture.act(() =>
      insertElement('image', {
        x: 0,
        y: 0,
        width: 640 / 2,
        height: 529 / 2,
        resource: {
          id: 10,
          type: 'image',
          mimeType: 'image/jpg',
          src: 'http://localhost:9876/__static__/featured-media-1.png',
          alt: 'bear',
          width: 640,
          height: 529,
          baseColor: '#734727',
        },
      })
    );
  });

  it('should allow clicking on border of an element', async () => {
    // Open style pane
    await fixture.events.click(fixture.editor.sidebar.designTab);
    const panel = fixture.editor.sidebar.designPanel.border;
    await fixture.events.click(panel.width(), { clickCount: 3 });
    await fixture.events.keyboard.type('20');
    await fixture.events.keyboard.press('tab');

    // @todo click on background canvas
    // click image
    const imageFrame = fixture.editor.canvas.framesLayer.frame(image.id).node;
    const { x, y } = imageFrame.getBoundingClientRect();
    await fixture.events.mouse.click(x + 1, y + 1);
    // @todo -- test if floating menu is available
    // or something to indicate the image has a selection
  });
});
