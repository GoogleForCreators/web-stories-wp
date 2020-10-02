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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import useBatchingCallback from '../../utils/useBatchingCallback';
import objectWithout from '../../utils/objectWithout';
import { useStory } from '../../app/story';
import useInsertElement from './useInsertElement';

function useInsertTextSet() {
  const insertElement = useInsertElement();

  const { setSelectedElementsById } = useStory(
    ({ actions: { setSelectedElementsById } }) => {
      return {
        setSelectedElementsById,
      };
    }
  );

  const insertTextSet = useBatchingCallback(
    (toAdd) => {
      const addedElements = [];
      toAdd.forEach((element) => {
        const toInsert = objectWithout(element, [
          'id',
          'normalizedOffsetX',
          'normalizedOffsetY',
          'textSetWidth',
          'textSetHeight',
        ]);
        addedElements.push(insertElement(element.type, toInsert));
      });
      // Select all added elements.
      setSelectedElementsById({
        elementIds: addedElements.map(({ id }) => id),
      });
    },
    [insertElement, setSelectedElementsById]
  );

  const insertTextSetByOffset = useCallback(
    (elements, { offsetX, offsetY }, boundary) => {
      if (!elements.length) {
        return;
      }

      let adjustedOffsetX = offsetX;
      let adjustedOffsetY = offsetY;

      if (boundary) {
        const { width, height } = boundary;
        const { textSetWidth, textSetHeight } = elements[0];

        if (offsetX < 0) {
          adjustedOffsetX = 0;
        } else if (offsetX > width) {
          adjustedOffsetX = width - textSetWidth;
        } else if (offsetX + textSetWidth > width) {
          adjustedOffsetX -= offsetX + textSetWidth - width;
        }

        if (offsetY < 0) {
          adjustedOffsetY = 0;
        } else if (offsetY > height) {
          adjustedOffsetY = height - textSetHeight;
        } else if (offsetY + textSetHeight > height) {
          adjustedOffsetY -= offsetY + textSetHeight - height;
        }
      }

      const positionedTextSet = elements.map((element) => ({
        ...element,
        x: element.normalizedOffsetX + adjustedOffsetX,
        y: element.normalizedOffsetY + adjustedOffsetY,
      }));

      insertTextSet(positionedTextSet);
    },
    [insertTextSet]
  );

  return { insertTextSet, insertTextSetByOffset };
}

export default useInsertTextSet;
