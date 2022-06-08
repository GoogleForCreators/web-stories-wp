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
import { useStory } from '../app';
import useInsertElement from '../components/canvas/useInsertElement';
import objectPick from './objectPick';

const useShapeMask = (element) => {
  const { updateElementById } = useStory(({ actions }) => ({
    updateElementById: actions.updateElementById,
    combineElements: actions.combineElements,
  }));

  const insertElement = useInsertElement();

  const hasShapeMask =
    element?.type === 'image' && element?.mask?.type !== MaskTypes.RECTANGLE;

  const removeShapeMask = useCallback(() => {
    if (!element) {
      return;
    }

    const SHAPE_PROPS = ['x', 'y', 'width', 'height', 'scale', 'rotationAngle'];
    const shapeProps = objectPick(element, SHAPE_PROPS);
    insertElement('shape', {
      ...shapeProps,
      mask: {
        type: element.mask.type,
      },
    });

    updateElementById({
      elementId: element.id,
      properties: { mask: { type: MaskTypes.RECTANGLE } },
    });
  }, [element, insertElement, updateElementById]);

  return {
    hasShapeMask,
    removeShapeMask,
  };
};

export default useShapeMask;
