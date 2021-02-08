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
import { Fixture } from '../../../../karma/fixture';

describe('Shape library integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('add shape via clicking on shape preview', async () => {
    // Only background initially
    expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);

    // Switch to shapes tab and click the triangle
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));

    // Now background + 1 extra element
    expect(fixture.editor.canvas.framesLayer.frames.length).toBe(2);
  });

  it('add shape via dragging from shape preview', async () => {
    // Only background initially
    expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);

    // Switch to the shapes tab and drag the triangle to the canvas
    await fixture.events.click(fixture.editor.library.shapesTab);
    const triangle = fixture.editor.library.shapes.shape('Triangle');
    const bgFrame = fixture.editor.canvas.framesLayer.frames[0].node;
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(triangle, 10, 10),
      down(),
      /* The steps give time for Moveable to react and display a clone to drag */
      moveRel(bgFrame, 50, 50, { steps: 20 }),
      up(),
    ]);

    // Now background + 1 extra element
    expect(fixture.editor.canvas.framesLayer.frames.length).toBe(2);
  });

  it('should not add shape dragged out of the page area', async () => {
    // Only background initially
    expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);

    // Switch to the shapes tab and drag the triangle to the canvas
    await fixture.events.click(fixture.editor.library.shapesTab);
    const triangle = fixture.editor.library.shapes.shape('Triangle');
    const bgFrame = fixture.editor.canvas.framesLayer.frames[0].node;

    // Shape is 1/3 of the page's width by default.
    const { width: pageWidth } = bgFrame.getBoundingClientRect();
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(triangle, 10, 10),
      down(),
      /* The steps give time for Moveable to react and display a clone to drag */
      moveRel(bgFrame, -(pageWidth / 3 + 20), 50, { steps: 20 }),
      up(),
    ]);

    // Still only background.
    expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);
  });
});
