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
import PropTypes from 'prop-types';
import { throttle } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
import { useState, useRef, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import elementsFromPoint from '../../utils/elementsFromPoint';
import { mergeElements } from '../../elements';
import { useStory } from '../../app';
import Context from './context';

function DropTargetsProvider({ children }) {
  const [dropTargets, setDropTargets] = useState([]);
  const [savedElement, setSavedElement] = useState(null);
  const {
    actions: { updateElementById },
    state: { currentPage },
  } = useStory();

  /**
   * Registering drop targets
   */

  const registerDropTarget = useCallback(
    (id, ref) => {
      setDropTargets({ ...dropTargets, [id]: ref });
    },
    [dropTargets]
  );

  /**
   * Dragging and previewing elements
   */
  const previewElement = useCallback(
    (dropTargetId, selectedElement) => {
      const dropTarget = currentPage?.elements.find(
        (element) => element.id === dropTargetId
      );
      setSavedElement({ ...dropTarget });
      updateElementById({
        elementId: dropTargetId,
        properties: mergeElements(selectedElement, dropTarget),
      });
    },
    [currentPage, updateElementById]
  );

  const restoreElementPreview = useCallback(() => {
    updateElementById({
      elementId: savedElement.id,
      properties: savedElement,
    });
    setSavedElement(null);
  }, [savedElement, updateElementById]);

  const handleDrag = useCallback(
    (x, y, element) => {
      const underCursor = elementsFromPoint(x, y);
      const dropTargetId =
        Object.keys(dropTargets).find((id) =>
          underCursor.includes(dropTargets[id])
        ) || null;
      if (dropTargetId && dropTargetId !== element.id) {
        previewElement(dropTargetId, element);
      } else if (savedElement) {
        restoreElementPreview();
      }
    },
    [dropTargets, previewElement, restoreElementPreview, savedElement]
  );

  const throttledHandleDrag = useCallback(
    throttle(300, (x, y, element) => handleDrag(x, y, element)),
    [handleDrag]
  );

  /**
   * Dropping and merging elements
   */
  const handleDrop = useCallback(
    (x, y, element) => {
      const underCursor = elementsFromPoint(x, y);
      const dropTargetId =
        Object.keys(dropTargets).find((id) =>
          underCursor.includes(dropTargets[id])
        ) || null;
      if (dropTargetId && dropTargetId !== element.id) {
        previewElement(dropTargetId, element);
      }
    },
    [dropTargets, previewElement]
  );

  const state = {
    state: {
      dropTargets,
    },
    actions: {
      registerDropTarget,
      handleDrag: throttledHandleDrag,
      handleDrop,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

DropTargetsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default DropTargetsProvider;
