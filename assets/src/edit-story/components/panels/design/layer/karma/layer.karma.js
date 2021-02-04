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
import { Fixture } from '../../../../../karma';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../../app/font/defaultFonts';
import { useInsertElement } from '../../../../canvas';

describe('Layer Panel', () => {
  let fixture;
  let layerPanel;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    layerPanel = fixture.editor.inspector.designPanel.layerPanel;
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should show ellipsis for overflowing text', async () => {
    expect(layerPanel.layers.length).toBe(1);
    const insertElement = await fixture.renderHook(() => useInsertElement());
    await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt egestas velit quis tincidunt.',
        x: 40,
        y: 40,
        width: 250,
      })
    );

    expect(layerPanel.layers.length).toBe(2);

    await fixture.snapshot();
  });

  it('should allow changing the layer panel height via slider', async () => {
    expect(layerPanel.resizeHandle).toBeTruthy();
    const section = layerPanel.resizeHandle.closest('section');
    const initialHeight = section.clientHeight;
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(layerPanel.resizeHandle, 3, 3),
      down(),
      moveBy(0, -30, { steps: 6 }),
      up(),
    ]);
    expect(section.clientHeight).toBe(initialHeight + 30);
  });
});
