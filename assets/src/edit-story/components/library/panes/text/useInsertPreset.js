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
import { useCallback, useEffect, useRef } from 'react';

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

  useEffect(() => {
    // Version number change is happening due to adding a preset.
    // If we have set the last element but not the history version number yet,
    // Set the version number that was the result of adding the preset.
    if (lastPreset.current?.element && !lastPreset.current.versionNumber) {
      lastPreset.current.versionNumber = versionNumber;
    } else if (lastPreset.current?.versionNumber) {
      // If the version number changes meanwhile and we already have it set
      // something else changed meanwhile so clear the lastPreset, too.
      lastPreset.current = null;
    }
  }, [versionNumber]);

  const getPosition = useCallback((element) => {
    const { y } = element;
    if (!lastPreset.current) {
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
  }, []);

  const insertPreset = useCallback(
    (element) => {
      const atts = getPosition(element);
      const addedElement = insertElement(TYPE, {
        ...element,
        ...atts,
      });
      lastPreset.current = {
        versionNumber: null,
        element: addedElement,
      };
    },
    [getPosition, insertElement]
  );
  return insertPreset;
}

export default useInsertPreset;
