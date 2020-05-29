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

describe('Background Drop-Target integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    jasmine.addMatchers(customMatchers);
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should by default have white background', async () => {
    const bgElement = await getCanvasBackgroundElement(fixture);
    // Verify that it's empty
    expect(bgElement).toBeEmpty();
    // And that background color is white:
    expect(bgElement).toHaveStyle('backgroundColor', 'rgb(255, 255, 255)');
  });

  describe('when there is an image on the canvas', () => {
    let imageData;

    beforeEach(async () => {
      imageData = await addDummyImage(fixture);
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000000;
    });

    it('should correctly handle image dropped on edge', async () => {
      const backgroundId = await getBackgroundElementId(fixture);

      // Verify that bg replacement is empty
      const rep1 = await getCanvasBackgroundReplacement(fixture);
      expect(rep1).toBeEmpty();

      // Drag the image element to the background
      await dragToDropTarget(fixture, imageData.id, backgroundId);

      // Verify that bg replacement is no longer empty
      expect(rep1).not.toBeEmpty();

      // Verify that replacement img has correct source
      const replaceImg = rep1.querySelector('img');
      expect(replaceImg).toHaveProperty('src', imageData.resource.src);

      // Now drop the element
      await fixture.events.mouse.up();

      // Verify new background element has the correct image
      const bg = await getCanvasBackgroundElement(fixture);
      const bgImg = bg.querySelector('img');
      expect(bgImg).toHaveProperty('src', imageData.resource.src);

      // And verify that we no longer have a replacement element
      const rep2 = await getCanvasBackgroundReplacement(fixture);
      expect(rep2).toBeEmpty();
    });

    it('should correctly handle pressing "set as background"', async () => {
      // Find element
      const el = getCanvasElementWrapperById(fixture, imageData.id);
      const rect = el.getBoundingClientRect();

      // Click the element center
      await fixture.events.mouse.click(
        rect.x + rect.width / 2,
        rect.y + rect.height / 2
      );

      // Click the "set as background" button
      const setAsBackground = getButtonByText(fixture, 'Set as background');
      await fixture.events.click(setAsBackground);

      // Verify new background element has the correct image
      const bg = await getCanvasBackgroundElement(fixture);
      const bgImg = bg.querySelector('img');
      expect(bgImg).toHaveProperty('src', imageData.resource.src);
    });
  });
});

async function addDummyImage(fixture) {
  const insertElement = await fixture.renderHook(() => useInsertElement());
  return fixture.act(() =>
    insertElement('image', {
      resource: {
        type: 'image',
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

async function dragToDropTarget(fixture, fromId, toId) {
  // Find from element dimensions
  const from = await getCanvasElementWrapperById(fixture, fromId);
  const fromRect = from.getBoundingClientRect();

  // Find to element dimensions
  const to = getCanvasElementWrapperById(fixture, toId);
  const toRect = to.getBoundingClientRect();

  // Schedule a sequence of events by dragging from center of image to edge of bg
  await fixture.events.mouse.seq([
    {
      type: 'move',
      x: fromRect.x + fromRect.width / 2,
      y: fromRect.y + fromRect.height / 2,
    },
    {
      type: 'down',
    },
    {
      type: 'move',
      x: toRect.x + 3,
      y: toRect.y + 103,
      // I don't know why it needs this many steps.
      // I tried 2, I tried moving it one pixel first
      // and then all the way, but neither works. 10 does
      options: { steps: 12 },
    },
  ]);
}

const customMatchers = {
  toBeEmpty: () => ({
    compare: function (actual) {
      const innerHTML = actual?.innerHTML ?? '';
      const pass = innerHTML === '';
      return {
        pass,
        message: pass
          ? `Expected element to not be empty`
          : `Expected element to be empty`,
      };
    },
  }),
  toHaveStyle: (util, customEqualityTesters) => ({
    compare: function (element, property, expected) {
      const actual = getComputedStyle(element)[property];
      const pass = util.equals(actual, expected, customEqualityTesters);
      return {
        pass,
        message: pass
          ? `Expected element to not have background color "${expected}"`
          : `Expected element to have background color "${expected}" but found "${actual}"`,
      };
    },
  }),
  toHaveProperty: (util, customEqualityTesters) => ({
    compare: function (element, property, expected) {
      const actual = element?.[property] ?? '';
      const pass = util.equals(actual, expected, customEqualityTesters);
      return {
        pass,
        message: pass
          ? `Expected element to not have src "${expected}"`
          : `Expected element to have src "${expected}" but found "${actual}"`,
      };
    },
  }),
};

function getButtonByText(fixture, buttonText) {
  return Array.from(fixture.querySelectorAll('button')).find(
    (el) => el.innerText === buttonText
  );
}

function getCanvasElementWrapperById(fixture, id) {
  return fixture.querySelector(`[data-element-id="${id}"]`);
}

async function getBackgroundElementId(fixture) {
  const {
    state: {
      currentPage: {
        elements: [{ id }],
      },
    },
  } = await fixture.renderHook(() => useStory());
  return id;
}

async function getCanvasBackgroundElementWrapper(fixture) {
  const id = await getBackgroundElementId(fixture);
  return getCanvasElementWrapperById(fixture, id);
}

async function getCanvasBackgroundElement(fixture) {
  const wrapper = await getCanvasBackgroundElementWrapper(fixture);
  // TODO fix this selector
  return wrapper.querySelector(`[class^="display__Element-"]`);
}

async function getCanvasBackgroundReplacement(fixture) {
  const wrapper = await getCanvasBackgroundElementWrapper(fixture);
  // TODO fix this selector
  return wrapper.querySelector(
    `[class^="displayElement__ReplacementContainer-"]`
  );
}

function getComputedStyle(element) {
  return window.getComputedStyle(element);
}
