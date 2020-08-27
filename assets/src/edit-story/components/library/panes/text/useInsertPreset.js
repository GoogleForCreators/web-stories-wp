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
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import getInsertedElementSize from '../../../../utils/getInsertedElementSize';
import { PAGE_HEIGHT } from '../../../../constants';
import useLibrary from '../../useLibrary';
import { useHistory } from '../../../../app/history';
import { dataFontEm } from '../../../../units';

const POSITION_MARGIN = dataFontEm(1);
const TYPE = 'text';

function useInsertPreset() {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const {
    state: { versionNumber },
  } = useHistory();

  const lastPreset = useRef(null);

  const getPosition = useCallback(
    (element) => {
      const { y } = element;
      // If the difference between the new and the previous version number is not 1,
      // the preset wasn't clicked right after the previous.
      if (
        !lastPreset.current ||
        versionNumber - lastPreset.current.versionNumber !== 1
      ) {
        return y;
      }
      const {
        element: { height: lastHeight, y: lastY },
      } = lastPreset.current;
      let positionedY = lastY + lastHeight + POSITION_MARGIN;
      // Let's get the width/height of the element about to be inserted.
      const { width, height } = getInsertedElementSize(
        TYPE,
        element.width,
        element.height,
        {
          ...element,
          y: positionedY,
        }
      );
      // If the element is going out of page, use the default position.
      if (positionedY + height >= PAGE_HEIGHT) {
        positionedY = y;
      }
      return {
        width,
        height,
        y: positionedY,
      };
    },
    [versionNumber]
  );

  const insertPreset = useCallback(
    (element) => {
      const atts = getPosition(element);
      const addedElement = insertElement(TYPE, {
        ...element,
        ...atts,
      });
      lastPreset.current = {
        versionNumber,
        element: addedElement,
      };
    },
    [getPosition, versionNumber, insertElement]
  );
  return insertPreset;
}

export default useInsertPreset;
