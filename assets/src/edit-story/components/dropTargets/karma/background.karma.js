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
import { useInsertElement } from '../../../components/canvas';

fdescribe('Background Drop-Target integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should by default have white background', async () => {
    const bgElement = await getCanvasBackgroundElement(fixture);
    // Verify that it's empty
    expect(bgElement.innerHTML).toEqual('');
    // And that the computed CSS background color is white:
    const bgColor = getComputedStyle(bgElement).backgroundColor;
    expect(bgColor).toEqual('rgb(255, 255, 255)');
  });

  fdescribe('when there is an image on the canvas', () => {
    let imageId;

    beforeEach(async () => {
      const data = await addDummyImage(fixture);
      imageId = data.id;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    });

    fit('should temp display image as background when dragging over droptarget edge', async () => {
      // Find bg element
      const bgElement = await getCanvasBackgroundElement(fixture);
      const bgRect = bgElement.getBoundingClientRect();

      // Find image element
      const imageElement = getCanvasElementWrapperById(fixture, imageId);
      const imageRect = imageElement.getBoundingClientRect();

      const bgReplacementElement = await getCanvasBackgroundReplacement(
        fixture
      );

      // Verify that bg replacement is empty
      expect(bgReplacementElement.innerHTML).toEqual('');

      // Schedule a sequence of events by dragging from center of image to edge of bg
      await fixture.events.mouse.seq([
        {
          type: 'move',
          x: imageRect.x + imageRect.width / 2,
          y: imageRect.y + imageRect.height / 2,
        },
        {
          type: 'down',
        },
        {
          type: 'move',
          x: bgRect.x + 7,
          y: bgRect.y + 107,
        },
      ]);

      // Pause for 100 seconds
      await new Promise((resolve) => setTimeout(resolve, 100000));

      // Verify that bg replacement is no longer empty
      expect(bgReplacementElement.innerHTML).not.toEqual('');
    });
  });
});

async function addDummyImage(fixture) {
  const insertElement = await fixture.renderHook(() => useInsertElement());
  return fixture.act(() =>
    insertElement('image', {
      resource: {
        src: 'http://localhost:9876/__static__/blue-marble.jpg',
        width: 600,
        height: 600,
      },
      x: 40,
      y: 40,
      width: 250,
      height: 250,
    })
  );
}

function getCanvasElementWrapperById(fixture, id) {
  return fixture.querySelector(`[data-element-id="${id}"]`);
}

async function getCanvasBackgroundElementWrapper(fixture) {
  const {
    state: {
      currentPage: {
        elements: [{ id }],
      },
    },
  } = await fixture.renderHook(() => useStory());
  return getCanvasElementWrapperById(fixture, id);
}

function getCanvasBackgroundElement(fixture) {
  return getCanvasBackgroundElementWrapper(fixture).then((e) =>
    e.querySelector(`[class^="display__Element-"]`)
  );
}

function getCanvasBackgroundReplacement(fixture) {
  return getCanvasBackgroundElementWrapper(fixture).then((e) =>
    e.querySelector(`[class^="displayElement__ReplacementContainer-"]`)
  );
}

function getComputedStyle(element) {
  return window.getComputedStyle(element);
}
