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
import {
  createNewElement,
  elementIs,
  ElementType,
  type Element,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../../app/story';
import { useLayout } from '../../app/layout';
import { ZoomSetting } from '../../constants';
import { noop } from '../../utils/noop';
import useFocusCanvas from './useFocusCanvas';
import getElementProperties from './utils/getElementProperties';

function createElementForCanvas(type: ElementType, props: Element) {
  return createNewElement(type, getElementProperties(type, props));
}

interface ElementWithPageId extends Element {
  pageId?: string;
}
function useInsertElement() {
  const { addElement, combineElements, backgroundElementId } = useStory(
    ({ state, actions }) => ({
      addElement: actions.addElement,
      combineElements: actions.combineElements,
      backgroundElementId: state.currentPage?.elements?.[0]?.id,
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
    (
      type: ElementType,
      props: ElementWithPageId,
      insertAsBackground = false
    ) => {
      setZoomSetting(ZoomSetting.Fit);
      const element = createElementForCanvas(type, props);
      const { id } = element;
      addElement({ element });

      if (insertAsBackground && backgroundElementId) {
        combineElements({
          firstElement: element,
          secondId: backgroundElementId,
        });
      }

      const elementId = insertAsBackground ? backgroundElementId : id;

      // Auto-play on insert.
      if (
        elementId &&
        elementIs.video(element) &&
        element.resource.src &&
        !element.resource.isPlaceholder
      ) {
        setTimeout(() => {
          const videoEl = document.getElementById(
            `video-${elementId}`
          ) as HTMLVideoElement | null;
          if (videoEl) {
            videoEl.play().catch(noop);
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
