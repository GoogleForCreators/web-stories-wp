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
import { useStory } from '../../app/story';
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
  const { addElement, combineElements, backgroundElementId } = useStory(
    (state) => ({
      addElement: state.actions.addElement,
      combineElements: state.actions.combineElements,
      backgroundElementId: state.state.currentPage?.elements?.[0]?.id,
    })
  );

  const { setZoomSetting } = useLayout(({ actions: { setZoomSetting } }) => ({
    setZoomSetting,
  }));

  const focusCanvas = useFocusCanvas();

  /**
   * @param {string} type The element's type.
   * @param {Object} props The element's initial properties.
   * @param {boolean} insertAsBackground Whether to insert the element as a background element.
   */
  const insertElement = useCallback(
    (type, props, insertAsBackground = false) => {
      setZoomSetting(ZOOM_SETTING.FIT);
      const element = createElementForCanvas(type, props);
      const { id, resource } = element;
      addElement({ element });

      if (insertAsBackground) {
        combineElements({
          firstElement: element,
          secondId: backgroundElementId,
        });
      }

      const elementId = insertAsBackground ? backgroundElementId : id;

      // Auto-play on insert.
      if (type === 'video' && resource?.src && !resource.isPlaceholder) {
        setTimeout(() => {
          const videoEl = document.getElementById(`video-${elementId}`);
          if (videoEl) {
            videoEl.play().catch(() => {});
          }
        });
      }

      focusCanvas();

      return element;
    },
    [
      addElement,
      backgroundElementId,
      combineElements,
      focusCanvas,
      setZoomSetting,
    ]
  );

  return insertElement;
}

export default useInsertElement;
