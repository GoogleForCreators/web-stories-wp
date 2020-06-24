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

describe('TextEdit integration', () => {
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
    const canvas = fixture.editor.canvas.framesLayer.container;
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(triangle, 10, 10),
      down(),
      moveRel(canvas, 50, 50),
      up(),
    ]);

    // Now background + 1 extra element
    expect(fixture.editor.canvas.framesLayer.frames.length).toBe(2);
  });
});
