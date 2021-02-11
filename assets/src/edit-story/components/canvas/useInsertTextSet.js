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
import { useBatchingCallback } from '../../../design-system';
import objectWithout from '../../utils/objectWithout';
import { useStory } from '../../app/story';
import { DANGER_ZONE_HEIGHT, FULLBLEED_HEIGHT } from '../../units/dimensions';
import { PAGE_WIDTH } from '../../constants';
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
    (elements, { offsetX, offsetY }) => {
      if (!elements.length) {
        return;
      }

      const positionedTextSet = elements
        .map((element) => {
          // Skip adding any elements that are outside of page.
          const x = element.normalizedOffsetX + offsetX;
          const y = element.normalizedOffsetY + offsetY;
          const { width, height } = element;
          if (
            x > PAGE_WIDTH ||
            x + width < 0 ||
            y > FULLBLEED_HEIGHT ||
            y + height < -DANGER_ZONE_HEIGHT
          ) {
            return null;
          }
          return {
            ...element,
            x,
            y,
          };
        })
        .filter((el) => el);

      insertTextSet(positionedTextSet);
    },
    [insertTextSet]
  );

  return { insertTextSet, insertTextSetByOffset };
}

export default useInsertTextSet;
