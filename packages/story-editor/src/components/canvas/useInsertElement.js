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
import { useCallback } from '@googleforcreators/react';
import { createNewElement } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../app';
import { useLayout } from '../../app/layout';
import { ZOOM_SETTING } from '../../constants';
import useFocusCanvas from './useFocusCanvas';
import getElementProperties from './utils/getElementProperties';

/**
 * @param {string} type Element type.
 * @param {!Object} props The element's properties.
 * @return {Object} The new element.
 */
function createElementForCanvas(type, props) {
  return createNewElement(type, getElementProperties(type, props));
}

function useInsertElement() {
  const { addElement } = useStory(({ actions }) => ({
    addElement: actions.addElement,
  }));

  const { renamableLayer } = useCanvas(
    ({ state }) => ({
      renamableLayer: state.renamableLayer,
    })
  );

  const { setZoomSetting } = useLayout(({ actions: { setZoomSetting } }) => ({
    setZoomSetting,
  }));

  const focusCanvas = useFocusCanvas();

  /**
   * @param {string} type The element's type.
   * @param {Object} props The element's initial properties.
   */
  const insertElement = useCallback(
    (type, props) => {
      setZoomSetting(ZOOM_SETTING.FIT);
      const element = createElementForCanvas(type, props);
      const { id, resource } = element;
      addElement({ element });

      // Auto-play on insert.
      if (type === 'video' && resource?.src && !resource.isPlaceholder) {
        setTimeout(() => {
          const videoEl = document.getElementById(`video-${id}`);
          if (videoEl) {
            videoEl.play().catch(() => {});
          }
        });
      }

      if (renamableLayer?.elementId === '') {
        focusCanvas();
      }

      return element;
    },
    [addElement, focusCanvas, setZoomSetting]
  );

  return insertElement;
}

export default useInsertElement;
