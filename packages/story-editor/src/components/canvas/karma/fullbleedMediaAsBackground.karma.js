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
import { useInsertElement } from '..';

describe('Fullbleed Media as Background', () => {
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
          src: 'http://localhost:9876/__static__/earth.jpg',
          alt: 'earth',
          width: 640,
          height: 529,
          baseColor: '#734727',
        },
      })
    );
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should set image as background when resized to cover the canvas', async () => {
    const imageFrame = fixture.editor.canvas.framesLayer.frame(image.id);
    const canvas = fixture.editor.canvas.framesLayer.fullbleed;
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(imageFrame.node, 0, 0),
      down(),
      moveRel(canvas, '-1%', '-1%'),
      up(),
    ]);
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(imageFrame.node, '100%', '100%'),
      down(),
      moveRel(canvas, '101%', '101%'),
      up(),
    ]);
    const elements = await getElements(fixture);
    expect(elements.length).toBe(1);
    expect(elements[0].isDefaultBackground).not.toBeDefined();
    expect(elements[0].resource).toEqual(image.resource);
  });

  it('should not set image as background when media background is already set', async () => {
    const tempImage = fixture.editor.library.media.item(1);
    await fixture.events.mouse.clickOn(tempImage, 20, 20);
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.sizePosition.setAsBackground
    );

    const imageFrame = fixture.editor.canvas.framesLayer.frame(image.id);
    const canvas = fixture.editor.canvas.framesLayer.fullbleed;
    await fixture.events.mouse.clickOn(imageFrame.node, 10, 10);
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(imageFrame.node, 0, 0),
      down(),
      moveRel(canvas, 0, 0),
      up(),
    ]);
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(imageFrame.node, '100%', '100%'),
      down(),
      moveRel(canvas, '100%', '100%'),
      up(),
    ]);
    const elements = await getElements(fixture);
    expect(elements.length).toBe(2);
    expect(elements[0].isDefaultBackground).not.toBeDefined();
    expect(elements[0].resource).not.toEqual(image.resource);
  });
});

async function getElements(fixture) {
  const {
    state: {
      currentPage: { elements },
    },
  } = await fixture.renderHook(() => useStory());
  return elements;
}
