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
 * External dependencies
 */
import { useCallback } from '@googleforcreators/react';
import { MaskTypes } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import { useStory } from '../..';
import useInsertElement from '../../../components/canvas/useInsertElement';

const useShapeMask = () => {
  const { selectedElements, updateElementById, combineElements } = useStory(
    ({ state, actions }) => ({
      selectedElements: state.selectedElements,
      updateElementById: actions.updateElementById,
      combineElements: actions.combineElements,
    })
  );

  const insertElement = useInsertElement();

  const hasShapeMask = (element) =>
    element &&
    element?.type === 'image' &&
    element?.mask?.type !== MaskTypes.RECTANGLE;

  /**
   * Retrieve shape and image from selected elements.
   */
  const shapeMaskElements = useCallback(() => {
    if (selectedElements?.length > 2) {
      return {};
    }

    let image, shape;

    selectedElements.forEach((element) => {
      element.type === 'shape' && (shape = element);
      element.type === 'image' && (image = element);
    });

    if (shape && image) {
      return { shape, image };
    }

    return {};
  }, [selectedElements]);

  /**
   * Apply shape mask to element.
   *
   * @param {Object} shape Element to use for the mask.
   * @param {Object} image Element that the mask will be applied to.
   */
  const addShapeMask = (shape, image) => {
    combineElements({
      firstElement: image,
      secondId: shape.id,
    });
  };

  const removeShapeMask = useCallback(
    (element) => {
      if (!element) {
        return;
      }

      const { x, y, width, height, scale, rotationAngle } = element;

      insertElement('shape', {
        x,
        y,
        width,
        height,
        scale,
        rotationAngle,
        mask: {
          type: element.mask.type,
        },
      });

      updateElementById({
        elementId: element.id,
        properties: { mask: { type: MaskTypes.RECTANGLE } },
      });
    },
    [insertElement, updateElementById]
  );

  return {
    hasShapeMask,
    shapeMaskElements,
    addShapeMask,
    removeShapeMask,
  };
};

export default useShapeMask;
