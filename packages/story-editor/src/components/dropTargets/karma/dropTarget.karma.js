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
import { useStory } from '../../../app/story';
import { useLocalMedia } from '../../../app/media';

describe('Drop-Target integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getElements = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements;
  };

  describe('when there is nothing on the canvas', () => {
    it('should by default have transparent background', async () => {
      const backgroundId = (await getElements(fixture))[0].id;
      const bgElement =
        fixture.editor.canvas.displayLayer.display(backgroundId).element;

      // Verify that it's empty
      expect(bgElement).toBeEmpty();

      // And that background color is transparent:
      expect(bgElement).toHaveStyle('backgroundColor', 'rgba(0, 0, 0, 0)');
    });

    it('should correctly handle image dragged from library straight to edge', async () => {
      const backgroundId = (await getElements(fixture))[0].id;

      // Verify that bg replacement is empty
      let rep1 =
        fixture.editor.canvas.displayLayer.display(backgroundId).replacement;
      expect(rep1).toBeEmpty();

      // Get library element reference
      const libraryElement = fixture.editor.library.media.item(0);

      // Drag the element to the background
      await dragToDropTarget(fixture, libraryElement, backgroundId);

      // Update to DOM mutations
      rep1 =
        fixture.editor.canvas.displayLayer.display(backgroundId).replacement;

      // Verify that bg replacement is no longer empty
      expect(rep1).not.toBeEmpty();

      // Verify that replacement img has correct source
      const replaceImg = rep1.querySelector('img');
      const libraryImage = libraryElement.querySelector('img');
      expect(replaceImg).toHaveProperty('src', libraryImage.src);

      // Now drop the element
      await fixture.events.mouse.up();

      // And then wait a frame before invoking story hook
      await fixture.events.sleep(100);

      // Verify new background element has the correct image
      const bgElement = (await getElements(fixture))[0];
      expect(bgElement.type).toBe('image');
      const bg = fixture.editor.canvas.displayLayer.display(
        bgElement.id
      ).element;
      const bgImg = bg.querySelector('img');
      expect(bgImg).toHaveProperty('src', libraryImage.src);

      // And verify that we no longer have a replacement element
      const rep2 = fixture.editor.canvas.displayLayer.display(
        bgElement.id
      ).replacement;
      expect(rep2).toBeEmpty();

      // Verify the background base color is handled as expected.
      expect(bgElement.resource.baseColor).toEqual('#734727');
    });

    it('should correctly handle image dragged from library straight to edge (no cached base color)', async () => {
      const backgroundId = (await getElements(fixture))[0].id;

      // Verify that bg replacement is empty
      let rep1 =
        fixture.editor.canvas.displayLayer.display(backgroundId).replacement;
      expect(rep1).toBeEmpty();

      // Get library element reference
      const mediaIndex = 4;
      const { mediaResource } = await fixture.renderHook(() =>
        useLocalMedia(({ state }) => ({
          mediaResource: state.media[mediaIndex],
        }))
      );
      const libraryElement = fixture.editor.library.media.item(mediaIndex);

      // Drag the element to the background
      await dragToDropTarget(fixture, libraryElement, backgroundId);

      // Update to DOM mutations
      rep1 =
        fixture.editor.canvas.displayLayer.display(backgroundId).replacement;

      // Verify that bg replacement is no longer empty
      expect(rep1).not.toBeEmpty();

      // Verify that replacement img has correct source
      const replaceImg = rep1.querySelector('img');
      const libraryImage = libraryElement.querySelector('img');
      expect(replaceImg).toHaveProperty('src', libraryImage.src);

      // Now drop the element
      await fixture.events.mouse.up();

      // And then wait a frame before invoking story hook
      await fixture.events.sleep(100);

      // Verify new background element has the correct image
      const bgElement = (await getElements(fixture))[0];
      expect(bgElement.type).toBe('image');
      const bg = fixture.editor.canvas.displayLayer.display(
        bgElement.id
      ).element;
      const bgImg = bg.querySelector('img');
      expect(bgImg).toHaveProperty('src', libraryImage.src);

      // And verify that we no longer have a replacement element
      const rep2 = fixture.editor.canvas.displayLayer.display(
        bgElement.id
      ).replacement;
      expect(rep2).toBeEmpty();

      // Verify the background base color is handled as expected.
      await waitFor(() => {
        if (bgElement.resource.baseColor === mediaResource.baseColor) {
          return;
        }
        throw new Error('Background element image loading');
      });
      expect(bgElement.resource.baseColor).toEqual(mediaResource.baseColor);
    });
  });

  describe('when there is an image on the canvas', () => {
    let imageData;

    beforeEach(async () => {
      await insertMediaByIndex(fixture, 0);
      imageData = (await getElements(fixture))[1];
    });

    it('should correctly handle image dropped on edge', async () => {
      const backgroundId = (await getElements(fixture))[0].id;

      // Verify that bg replacement is empty
      let rep1 =
        fixture.editor.canvas.displayLayer.display(backgroundId).replacement;
      expect(rep1).toBeEmpty();

      // Drag the image element to the background
      await dragCanvasElementToDropTarget(fixture, imageData.id, backgroundId);

      // Update to DOM mutations
      rep1 =
        fixture.editor.canvas.displayLayer.display(backgroundId).replacement;

      // Verify that bg replacement is no longer empty
      expect(rep1).not.toBeEmpty();

      // Verify that replacement img has correct source
      const replaceImg = rep1.querySelector('img');
      expect(replaceImg).toHaveProperty('src', imageData.resource.src);

      // Now drop the element
      await fixture.events.mouse.up();

      // Verify new background element has the correct image
      const newBackgroundId = (await getElements(fixture))[0].id;
      const bg =
        fixture.editor.canvas.displayLayer.display(newBackgroundId).element;
      const bgImg = bg.querySelector('img');
      expect(bgImg).toHaveProperty('src', imageData.resource.src);

      // And verify that we no longer have a replacement element
      const rep2 =
        fixture.editor.canvas.displayLayer.display(newBackgroundId).replacement;
      expect(rep2).toBeEmpty();
    });
  });

  describe('when there is a background image and nothing else', () => {
    let bgImageData;

    beforeEach(async () => {
      const libraryElement = fixture.editor.library.media.item(0);
      const backgroundId = (await getElements(fixture))[0].id;
      await dragToDropTarget(fixture, libraryElement, backgroundId);
      await fixture.events.mouse.up();
      await fixture.events.sleep(100);

      bgImageData = (await getElements(fixture))[0];
    });

    it('should correctly handle image dragged from library straight to edge replacing old image', async () => {
      // Verify that background element has the correct image before doing anything
      const bg1 = fixture.editor.canvas.displayLayer.display(
        bgImageData.id
      ).element;
      const bgImg1 = bg1.querySelector('img');
      expect(bgImg1).toHaveProperty('src', bgImageData.resource.src);

      // Verify that bg replacement is empty
      let rep1 = fixture.editor.canvas.displayLayer.display(
        bgImageData.id
      ).replacement;
      expect(rep1).toBeEmpty();

      // Get library element reference
      const libraryElement = fixture.editor.library.media.item(1);
      const libraryImage = libraryElement.querySelector('img');

      // Drag the element to the background
      await dragToDropTarget(fixture, libraryElement, bgImageData.id);

      // make sure rep1 is up to date with latest DOM updates.
      rep1 = fixture.editor.canvas.displayLayer.display(
        bgImageData.id
      ).replacement;

      // Verify that bg replacement is no longer empty
      expect(rep1).not.toBeEmpty();

      // Verify that replacement img has correct source
      const replaceImg = rep1.querySelector('img');
      expect(replaceImg).toHaveProperty('src', libraryImage.src);

      // Now drop the element
      await fixture.events.mouse.up();

      // Verify new background element has the correct image
      const newBackgroundId = (await getElements(fixture))[0].id;
      const bg2 =
        fixture.editor.canvas.displayLayer.display(newBackgroundId).element;
      const bgImg2 = bg2.querySelector('img');
      expect(bgImg2).toHaveProperty('src', libraryImage.src);

      // And verify that we no longer have a replacement element
      const rep2 =
        fixture.editor.canvas.displayLayer.display(newBackgroundId).replacement;
      expect(rep2).toBeEmpty();
    });

    describe('when there is second image on canvas', () => {
      let imageData;

      beforeEach(async () => {
        await insertMediaByIndex(fixture, 1);
        imageData = (await getElements(fixture))[1];
      });

      it('should correctly handle image dropped on edge replacing old image', async () => {
        // Verify that background element has the correct image before doing anything
        const bg1 = fixture.editor.canvas.displayLayer.display(
          bgImageData.id
        ).element;
        const bgImg1 = bg1.querySelector('img');
        expect(bgImg1).toHaveProperty('src', bgImageData.resource.src);

        // Verify that bg replacement is empty
        let rep1 = fixture.editor.canvas.displayLayer.display(
          bgImageData.id
        ).replacement;
        expect(rep1).toBeEmpty();

        // Drag the image element to the background
        await dragCanvasElementToDropTarget(
          fixture,
          imageData.id,
          bgImageData.id
        );

        // Update to DOM mutations
        rep1 = fixture.editor.canvas.displayLayer.display(
          bgImageData.id
        ).replacement;

        // Verify that bg replacement is no longer empty
        expect(rep1).not.toBeEmpty();

        // Verify that replacement img has correct source
        const replaceImg = rep1.querySelector('img');
        expect(replaceImg).toHaveProperty('src', imageData.resource.src);

        // Now drop the element
        await fixture.events.mouse.up();

        // Verify new background element has the correct image
        const newBackgroundId = (await getElements(fixture))[0].id;
        const bg2 =
          fixture.editor.canvas.displayLayer.display(newBackgroundId).element;
        const bgImg2 = bg2.querySelector('img');
        expect(bgImg2).toHaveProperty('src', imageData.resource.src);

        // And verify that we no longer have a replacement element
        const rep2 =
          fixture.editor.canvas.displayLayer.display(
            newBackgroundId
          ).replacement;
        expect(rep2).toBeEmpty();
      });

      describe('when the background is flipped', () => {
        beforeEach(async () => {
          // Click the bg in the top left corner
          const bgElement = fixture.editor.canvas.framesLayer.frame(
            bgImageData.id
          ).node;
          await fixture.events.mouse.clickOn(bgElement, 5, 5);

          // And flip it
          await fixture.events.click(fixture.editor.sidebar.designTab);
          await fixture.events.click(
            fixture.editor.sidebar.designPanel.pageBackground.flipHorizontal
          );
        });

        it('should correctly handle image dropped on edge without flip', async () => {
          // Verify that background element has the correct transform (flip) before doing anything
          const bg1 = fixture.editor.canvas.displayLayer.display(
            bgImageData.id
          ).node;
          const rep = fixture.editor.canvas.displayLayer.display(
            bgImageData.id
          ).replacement;
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
          const newBackgroundId = (await getElements(fixture))[0].id;
          const bg2 =
            fixture.editor.canvas.displayLayer.display(newBackgroundId).node;
          const bgImg2 = bg2.querySelector('img');
          const combinedBgTransform2 = getAllTransformsBetween(bgImg2, bg2);
          expect(combinedBgTransform2).toBe('');
        });
      });

      describe('when the canvas element is flipped', () => {
        beforeEach(async () => {
          // Click the corner of the on-canvas element
          const element = fixture.editor.canvas.framesLayer.frame(
            imageData.id
          ).node;
          await fixture.events.mouse.clickOn(element, 1, 1);

          // And flip it
          await fixture.events.click(fixture.editor.sidebar.designTab);
          await fixture.events.click(
            fixture.editor.sidebar.designPanel.sizePosition.flipHorizontal
          );
        });

        it('should correctly handle image dropped on edge with flip', async () => {
          // Verify that background element has the correct transform (flip) before doing anything
          let bg1 = fixture.editor.canvas.displayLayer.display(
            bgImageData.id
          ).node;
          let rep = fixture.editor.canvas.displayLayer.display(
            bgImageData.id
          ).replacement;
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
          bg1 = fixture.editor.canvas.displayLayer.display(bgImageData.id).node;
          rep = fixture.editor.canvas.displayLayer.display(
            bgImageData.id
          ).replacement;

          // Verify that replacement img has correct transform
          const replaceImg = rep.querySelector('img');
          const combinedRepTransform = getAllTransformsBetween(replaceImg, bg1);
          expect(combinedRepTransform).toBe('matrix(-1, 0, 0, 1, 0, 0)');

          // Now drop the element
          await fixture.events.mouse.up();

          // Verify that new background is flipped
          const newBackgroundId = (await getElements(fixture))[0].id;
          const bg2 =
            fixture.editor.canvas.displayLayer.display(newBackgroundId).node;
          const bgImg2 = bg2.querySelector('img');
          const combinedBgTransform2 = getAllTransformsBetween(bgImg2, bg2);
          expect(combinedBgTransform2).toBe('matrix(-1, 0, 0, 1, 0, 0)');
        });
      });

      describe('when there is a third flipped image on the canvas', () => {
        let flippedImageData;

        beforeEach(async () => {
          await insertMediaByIndex(fixture, 2);
          flippedImageData = (await getElements(fixture))[2];

          await fixture.events.click(fixture.editor.sidebar.designTab);
          await fixture.events.click(
            fixture.editor.sidebar.designPanel.sizePosition.flipHorizontal
          );

          const element = fixture.editor.canvas.displayLayer.display(
            flippedImageData.id
          ).node;

          await fixture.events.mouse.seq(({ moveRel, down, up }) => [
            moveRel(element, '50%', '50%'),
            down(),
            moveRel(element, '50%', '200%'),
            up(),
          ]);
        });

        it('should correctly handle flipped image dropped into non-flipped image', async () => {
          // Verify that non-flipped element has the correct transform (flip) before doing anything
          let target = fixture.editor.canvas.displayLayer.display(
            imageData.id
          ).node;
          let rep = fixture.editor.canvas.displayLayer.display(
            imageData.id
          ).replacement;
          const targetImg = target.querySelector('img');
          const transformBefore = getAllTransformsBetween(targetImg, target);
          expect(transformBefore).toBe('');

          // Drag the flipped image element to the non-flipped target
          await dragCanvasElementToDropTarget(
            fixture,
            flippedImageData.id,
            imageData.id
          );

          // Make sure rep is up to date with DOM mutations
          target = fixture.editor.canvas.displayLayer.display(
            imageData.id
          ).node;
          rep = fixture.editor.canvas.displayLayer.display(
            imageData.id
          ).replacement;

          // Verify that replacement img has correct transform
          const replaceImg = rep.querySelector('img');
          const replTransform = getAllTransformsBetween(replaceImg, target);
          expect(replTransform).toBe('');

          // Now drop the element
          await fixture.events.mouse.up();

          // Verify that new combined element is still not flipped
          const newElementId = (await getElements(fixture))[1].id;
          const newTarget =
            fixture.editor.canvas.displayLayer.display(newElementId).node;
          const newTargetImg = newTarget.querySelector('img');
          const transformAfter = getAllTransformsBetween(
            newTargetImg,
            newTarget
          );
          expect(transformAfter).toBe('');
        });

        it('should correctly handle non-flipped image dropped into flipped image', async () => {
          // Verify that non-flipped element has the correct transform (flip) before doing anything
          let target = fixture.editor.canvas.displayLayer.display(
            flippedImageData.id
          ).node;
          let rep = fixture.editor.canvas.displayLayer.display(
            flippedImageData.id
          ).replacement;
          const targetImg = target.querySelector('img');
          const transformBefore = getAllTransformsBetween(targetImg, target);
          expect(transformBefore).toBe('matrix(-1, 0, 0, 1, 0, 0)');

          // Drag the image element to the background
          await dragCanvasElementToDropTarget(
            fixture,
            imageData.id,
            flippedImageData.id
          );

          // Make sure rep is up to date with DOM mutations
          target = fixture.editor.canvas.displayLayer.display(
            flippedImageData.id
          ).node;
          rep = fixture.editor.canvas.displayLayer.display(
            flippedImageData.id
          ).replacement;

          // Verify that replacement img has correct transform
          const replaceImg = rep.querySelector('img');
          const replTransform = getAllTransformsBetween(replaceImg, target);
          expect(replTransform).toBe('matrix(-1, 0, 0, 1, 0, 0)');

          // Now drop the element
          await fixture.events.mouse.up();

          // Verify that new combined element is still flipped
          const newElementId = (await getElements(fixture))[1].id;
          const newTarget =
            fixture.editor.canvas.displayLayer.display(newElementId).node;
          const newTargetImg = newTarget.querySelector('img');
          const transformAfter = getAllTransformsBetween(
            newTargetImg,
            newTarget
          );
          expect(transformAfter).toBe('matrix(-1, 0, 0, 1, 0, 0)');
        });
      });
    });
  });
});

function dragCanvasElementToDropTarget(fixture, fromId, toId) {
  const from = fixture.editor.canvas.framesLayer.frame(fromId).node;
  return dragToDropTarget(fixture, from, toId);
}

async function insertMediaByIndex(fixture, index) {
  const mediaItem = fixture.editor.library.media.item(index);
  await fixture.events.mouse.clickOn(mediaItem, 20, 20);
}

async function dragToDropTarget(fixture, from, toId) {
  const to = fixture.editor.canvas.framesLayer.frame(toId).node;

  // Schedule a sequence of events by dragging from center of image
  // to corner of target
  await fixture.events.mouse.seq(({ moveRel, down }) => [
    moveRel(from, '20%', '20%'),
    down(),
    moveRel(to, 5, 5, { steps: 5 }),
  ]);
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
