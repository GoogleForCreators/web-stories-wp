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

describe('Background Drop-Target integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getBackgroundElement = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements[0];
  };

  describe('when there is nothing on the canvas', () => {
    it('should by default have transparent background', async () => {
      const bgElement = await getCanvasBackgroundElement(fixture);
      // Verify that it's empty
      expect(bgElement).toBeEmpty();
      // And that background color is transparent:
      expect(bgElement).toHaveStyle('backgroundColor', 'rgba(0, 0, 0, 0)');
    });

    it('should correctly handle image dragged from library straight to edge', async () => {
      const backgroundId = await getBackgroundElementId(fixture);

      // Verify that bg replacement is empty
      let rep1 = await getCanvasBackgroundReplacement(fixture);
      expect(rep1).toBeEmpty();

      // Get library element reference
      const libraryElement = getMediaLibraryElementByIndex(fixture, 0);
      const libraryImage = libraryElement.querySelector('img');

      // Drag the element to the background
      await dragToDropTarget(fixture, libraryElement, backgroundId);

      // Update to DOM mutations
      rep1 = await getCanvasBackgroundReplacement(fixture);

      // Verify that bg replacement is no longer empty
      expect(rep1).not.toBeEmpty();

      // Verify that replacement img has correct source
      const replaceImg = rep1.querySelector('img');
      expect(replaceImg).toHaveProperty('src', libraryImage.src);

      // Now drop the element
      await fixture.events.mouse.up();

      // Verify new background element has the correct image
      const bg = await getCanvasBackgroundElement(fixture);
      const bgImg = bg.querySelector('img');
      expect(bgImg).toHaveProperty('src', libraryImage.src);

      // And verify that we no longer have a replacement element
      const rep2 = await getCanvasBackgroundReplacement(fixture);
      expect(rep2).toBeEmpty();

      // Verify the background base color is handled as expected.
      const bgElement = await getBackgroundElement();
      expect(bgElement.resource.baseColor).toEqual([201, 201, 219]);
    });
  });

  describe('when there is an image on the canvas', () => {
    let imageData;

    beforeEach(async () => {
      await addDummyImage(fixture, 0);
      const {
        state: {
          currentPage: { elements },
        },
      } = await fixture.renderHook(() => useStory());
      imageData = elements[1];
    });

    it('should correctly handle image dropped on edge', async () => {
      const backgroundId = await getBackgroundElementId(fixture);

      // Verify that bg replacement is empty
      let rep1 = await getCanvasBackgroundReplacement(fixture);
      expect(rep1).toBeEmpty();

      // Drag the image element to the background
      await dragCanvasElementToDropTarget(fixture, imageData.id, backgroundId);

      // Update to DOM mutations
      rep1 = await getCanvasBackgroundReplacement(fixture);

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

  describe('when there is a background image and nothing else', () => {
    let bgImageData;

    beforeEach(async () => {
      await addDummyImage(fixture, 0);
      const setAsBackground = getButtonByText(fixture, 'Set as background');
      await fixture.events.click(setAsBackground);
      const {
        state: {
          currentPage: { elements },
        },
      } = await fixture.renderHook(() => useStory());
      bgImageData = elements[0];
    });

    it('should correctly handle image dragged from library straight to edge replacing old image', async () => {
      const backgroundId = await getBackgroundElementId(fixture);

      // Verify that background element has the correct image before doing anything
      const bg1 = await getCanvasBackgroundElement(fixture);
      const bgImg1 = bg1.querySelector('img');
      expect(bgImg1).toHaveProperty('src', bgImageData.resource.src);

      // Verify that bg replacement is empty
      let rep1 = await getCanvasBackgroundReplacement(fixture);
      expect(rep1).toBeEmpty();

      // Get library element reference
      const libraryElement = getMediaLibraryElementByIndex(fixture, 0);
      const libraryImage = libraryElement.querySelector('img');

      // Drag the element to the background
      await dragToDropTarget(fixture, libraryElement, backgroundId);

      // make sure rep1 is up to date with latest DOM updates.
      rep1 = await getCanvasBackgroundReplacement(fixture);

      // Verify that bg replacement is no longer empty
      expect(rep1).not.toBeEmpty();

      // Verify that replacement img has correct source
      const replaceImg = rep1.querySelector('img');
      expect(replaceImg).toHaveProperty('src', libraryImage.src);

      // Now drop the element
      await fixture.events.mouse.up();

      // Verify new background element has the correct image
      const bg2 = await getCanvasBackgroundElement(fixture);
      const bgImg2 = bg2.querySelector('img');
      expect(bgImg2).toHaveProperty('src', libraryImage.src);

      // And verify that we no longer have a replacement element
      const rep2 = await getCanvasBackgroundReplacement(fixture);
      expect(rep2).toBeEmpty();
    });

    describe('when there is second image on canvas', () => {
      let imageData;

      beforeEach(async () => {
        await addDummyImage(fixture, 1);
        const {
          state: {
            currentPage: { elements },
          },
        } = await fixture.renderHook(() => useStory());
        imageData = elements[1];
      });

      it('should correctly handle image dropped on edge replacing old image', async () => {
        // Verify that background element has the correct image before doing anything
        const bg1 = await getCanvasBackgroundElement(fixture);
        const bgImg1 = bg1.querySelector('img');
        expect(bgImg1).toHaveProperty('src', bgImageData.resource.src);

        // Verify that bg replacement is empty
        let rep1 = await getCanvasBackgroundReplacement(fixture);
        expect(rep1).toBeEmpty();

        // Drag the image element to the background
        await dragCanvasElementToDropTarget(
          fixture,
          imageData.id,
          bgImageData.id
        );

        // Update to DOM mutations
        rep1 = await getCanvasBackgroundReplacement(fixture);

        // Verify that bg replacement is no longer empty
        expect(rep1).not.toBeEmpty();

        // Verify that replacement img has correct source
        const replaceImg = rep1.querySelector('img');
        expect(replaceImg).toHaveProperty('src', imageData.resource.src);

        // Now drop the element
        await fixture.events.mouse.up();

        // Verify new background element has the correct image
        const bg2 = await getCanvasBackgroundElement(fixture);
        const bgImg2 = bg2.querySelector('img');
        expect(bgImg2).toHaveProperty('src', imageData.resource.src);

        // And verify that we no longer have a replacement element
        const rep2 = await getCanvasBackgroundReplacement(fixture);
        expect(rep2).toBeEmpty();
      });

      it('should correctly handle pressing "set as background" replacing old image', async () => {
        // Verify that background element has the correct image before doing anything
        const bg1 = await getCanvasBackgroundElement(fixture);
        const bgImg1 = bg1.querySelector('img');
        expect(bgImg1).toHaveProperty('src', bgImageData.resource.src);

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
        const bg2 = await getCanvasBackgroundElement(fixture);
        const bgImg2 = bg2.querySelector('img');
        expect(bgImg2).toHaveProperty('src', imageData.resource.src);

        // Verify the page average color is assigned as expected.
        const bgElement = await getBackgroundElement();
        expect(bgElement.resource.baseColor).toEqual([169, 132, 102]);
      });

      describe('when the background is flipped', () => {
        beforeEach(async () => {
          // Click the bg in the top left corner
          const bgElement = getCanvasElementWrapperById(
            fixture,
            bgImageData.id
          );
          const bgRect = bgElement.getBoundingClientRect();
          await fixture.events.mouse.click(bgRect.left + 1, bgRect.top + 1);
          // And flip it
          const flip = getInputByAriaLabel(fixture, 'Flip horizontally');
          const flipLabel = flip.parentElement;
          await fixture.events.click(flipLabel);
        });

        it('should correctly handle image dropped on edge without flip', async () => {
          // Verify that background element has the correct transform (flip) before doing anything
          const bg1 = await getCanvasBackgroundElementWrapper(fixture);
          const rep = bg1.querySelector(
            `[class^="displayElement__ReplacementContainer-"]`
          );
          const bgImg1 = bg1.querySelector('img');
          const combinedBgTransform1 = getAllTransformsBetween(bgImg1, bg1);
          expect(combinedBgTransform1).toBe('matrix(-1, 0, 0, 1, 0, 0)');

          // Drag the image element to the background
          await dragCanvasElementToDropTarget(
            fixture,
            imageData.id,
            bgImageData.id
          );

          // Verify that replacement img has correct transform
          const replaceImg = rep.querySelector('img');
          const combinedRepTransform = getAllTransformsBetween(replaceImg, bg1);
          expect(combinedRepTransform).toBe('');

          // Now drop the element
          await fixture.events.mouse.up();

          // Verify that new background is not flipped
          const bg2 = await getCanvasBackgroundElementWrapper(fixture);
          const bgImg2 = bg2.querySelector('img');
          const combinedBgTransform2 = getAllTransformsBetween(bgImg2, bg2);
          expect(combinedBgTransform2).toBe('');
        });

        it('should correctly handle pressing "set as background" without flip', async () => {
          // Verify that background element has the correct transform (flip) before doing anything
          const bg1 = await getCanvasBackgroundElementWrapper(fixture);
          const bgImg1 = bg1.querySelector('img');
          const combinedBgTransform1 = getAllTransformsBetween(bgImg1, bg1);
          expect(combinedBgTransform1).toBe('matrix(-1, 0, 0, 1, 0, 0)');

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

          // Verify that new background is not flipped
          const bg2 = await getCanvasBackgroundElementWrapper(fixture);
          const bgImg2 = bg2.querySelector('img');
          const combinedBgTransform2 = getAllTransformsBetween(bgImg2, bg2);
          expect(combinedBgTransform2).toBe('');
        });
      });

      describe('when the canvas element is flipped', () => {
        beforeEach(async () => {
          // Click the corner of the on-canvas element
          const element = getCanvasElementWrapperById(fixture, imageData.id);
          const rect = element.getBoundingClientRect();
          await fixture.events.mouse.click(rect.left + 1, rect.top + 1);
          // And flip it
          const flip = getInputByAriaLabel(fixture, 'Flip horizontally');
          const flipLabel = flip.parentElement;
          flipLabel.click();
        });

        it('should correctly handle image dropped on edge with flip', async () => {
          // Verify that background element has the correct transform (none) before doing anything
          let bg1 = await getCanvasBackgroundElementWrapper(fixture);
          let rep = (
            await getCanvasBackgroundElementWrapper(fixture)
          ).querySelector(`[class^="displayElement__ReplacementContainer-"]`);
          const bgImg1 = bg1.querySelector('img');
          const combinedBgTransform1 = getAllTransformsBetween(bgImg1, bg1);
          expect(combinedBgTransform1).toBe('');

          // Drag the image element to the background
          await dragCanvasElementToDropTarget(
            fixture,
            imageData.id,
            bgImageData.id
          );

          // Make sure rep is up to date with DOM mutations
          rep = (
            await getCanvasBackgroundElementWrapper(fixture)
          ).querySelector(`[class^="displayElement__ReplacementContainer-"]`);
          bg1 = await getCanvasBackgroundElementWrapper(fixture);

          // Verify that replacement img is flipped
          const replaceImg = rep.querySelector('img');
          const combinedRepTransform = getAllTransformsBetween(replaceImg, bg1);
          expect(combinedRepTransform).toBe('matrix(-1, 0, 0, 1, 0, 0)');

          // Now drop the element
          await fixture.events.mouse.up();

          // Verify that new background is flipped
          const bg2 = await getCanvasBackgroundElementWrapper(fixture);
          const bgImg2 = bg2.querySelector('img');
          const combinedBgTransform2 = getAllTransformsBetween(bgImg2, bg2);
          expect(combinedBgTransform2).toBe('matrix(-1, 0, 0, 1, 0, 0)');
        });

        it('should correctly handle pressing "set as background" with flip', async () => {
          // Verify that background element has the correct transform (none) before doing anything
          const bg1 = await getCanvasBackgroundElementWrapper(fixture);
          const bgImg1 = bg1.querySelector('img');
          const combinedBgTransform1 = getAllTransformsBetween(bgImg1, bg1);
          expect(combinedBgTransform1).toBe('');

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

          // Verify that new background is flipped
          const bg2 = await getCanvasBackgroundElementWrapper(fixture);
          const bgImg2 = bg2.querySelector('img');
          const combinedBgTransform2 = getAllTransformsBetween(bgImg2, bg2);
          expect(combinedBgTransform2).toBe('matrix(-1, 0, 0, 1, 0, 0)');
        });
      });
    });
  });
});

function getMediaLibraryElementByIndex(fixture, index) {
  return fixture.querySelectorAll('[data-testid^=mediaElement]')[index];
}

export async function addDummyImage(fixture, index) {
  await fixture.events.click(getMediaLibraryElementByIndex(fixture, index));
}

export async function dragCanvasElementToDropTarget(
  fixture,
  canvasElementId,
  targetId
) {
  // Find from element
  const from = await getCanvasElementWrapperById(fixture, canvasElementId);
  return dragToDropTarget(fixture, from, targetId);
}

async function dragToDropTarget(fixture, from, toId) {
  const to = getCanvasElementWrapperById(fixture, toId);

  // Find element dimensions
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();

  // Schedule a sequence of events by dragging from center of image to edge of bg
  await fixture.events.mouse.seq(({ move, down }) => [
    move(fromRect.x + fromRect.width / 2, fromRect.y + fromRect.height / 2),
    down(),
    move(toRect.x + 3, toRect.y + 103, { steps: 5 }),
  ]);
}

function getButtonByText(fixture, buttonText) {
  return Array.from(fixture.querySelectorAll('button')).find(
    (el) => el.innerText === buttonText
  );
}

function getInputByAriaLabel(fixture, ariaLabel) {
  return fixture.querySelector(`input[aria-label="${ariaLabel}"]`);
}

function getCanvasElementWrapperById(fixture, id) {
  return fixture.querySelector(`[data-element-id="${id}"]`);
}

export async function getBackgroundElementId(fixture) {
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

function getAllTransformsBetween(startElement, endElement) {
  let e = startElement;
  const transforms = [];
  while (e && e != endElement) {
    transforms.unshift(getComputedStyle(e).transform);
    e = e.parentNode;
  }

  return transforms.filter((t) => t !== 'none').join(' ');
}

function getComputedStyle(element) {
  return window.getComputedStyle(element);
}

export async function addBackgroundImage(fixture, options) {
  await addDummyImage(fixture, 1);
  const {
    actions: { updateElementById },
    state: {
      currentPage: { elements },
    },
  } = await fixture.renderHook(() => useStory());
  if (options?.properties) {
    updateElementById({
      elementId: elements[1].id,
      properties: options?.properties,
    });
  }
  const backgroundId = await getBackgroundElementId(fixture);
  await dragCanvasElementToDropTarget(fixture, elements[1].id, backgroundId);
  await fixture.events.mouse.up();
}
