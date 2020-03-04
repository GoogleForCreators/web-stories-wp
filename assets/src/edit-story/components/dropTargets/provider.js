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
import { useState, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { mergeElements } from '../../elements';
import { useTransform } from '../transform';
import { useStory } from '../../app';
import Context from './context';

function DropTargetsProvider({ children }) {
  const [dropTargets, setDropTargets] = useState({});
  const [activeDropTargetId, setactiveDropTargetId] = useState(null);
  const {
    actions: { pushTransform },
  } = useTransform();
  const {
    actions: { deleteElementById, setSelectedElementsById, updateElementById },
    state: { currentPage },
  } = useStory();

  const getDropTargetFromCursor = useCallback(
    (x, y, element) => {
      const underCursor = document.elementsFromPoint(x, y);
      return (
        Object.keys(dropTargets).find(
          (id) => underCursor.includes(dropTargets[id]) && id !== element.id
        ) || null
      );
    },
    [dropTargets]
  );

  /**
   * Registering drop targets
   */

  const registerDropTarget = useCallback(
    (id, ref) => {
      if (id in dropTargets) {
        return;
      }
      setDropTargets({ ...dropTargets, [id]: ref });
    },
    [dropTargets]
  );

  /**
   * Dragging elements
   */
  const handleDrag = useCallback(
    (element, x, y) => {
      const dropTargetId = getDropTargetFromCursor(x, y, element);
      if (dropTargetId && activeDropTargetId !== dropTargetId) {
        pushTransform(dropTargetId, {
          updates: { dropTargetActive: true, elementReplacement: element },
        });
        pushTransform(element.id, {
          updates: { overDropTarget: true },
        });
      } else if (!dropTargetId) {
        (currentPage?.elements || []).forEach((el) =>
          pushTransform(el.id, {
            updates: { dropTargetActive: false, elementReplacement: null },
          })
        );
        pushTransform(element.id, {
          updates: { overDropTarget: false },
        });
      }
      setactiveDropTargetId(dropTargetId);
    },
    [activeDropTargetId, currentPage, getDropTargetFromCursor, pushTransform]
  );

  const throttledHandleDrag = useCallback(
    throttle(300, (element, x, y) => handleDrag(element, x, y)),
    [handleDrag]
  );

  /**
   * Dropping and merging elements
   */
  const combineElements = useCallback(
    (dropTargetId, selectedElement) => {
      const dropTarget = currentPage?.elements.find(
        (element) => element.id === dropTargetId
      );
      updateElementById({
        elementId: dropTargetId,
        properties: mergeElements(selectedElement, dropTarget),
      });
      deleteElementById({ elementId: selectedElement.id });
    },
    [currentPage, deleteElementById, updateElementById]
  );

  const handleDrop = useCallback(
    (element) => {
      if (activeDropTargetId && activeDropTargetId !== element.id) {
        combineElements(activeDropTargetId, element);
        // Reset styles on all other elements
        (currentPage?.elements || []).forEach((el) =>
          pushTransform(el.id, {
            updates: { dropTargetActive: false, elementReplacement: null },
          })
        );
        setSelectedElementsById({ elementIds: activeDropTargetId });
        setactiveDropTargetId(null);
      }
    },
    [
      activeDropTargetId,
      combineElements,
      currentPage,
      pushTransform,
      setSelectedElementsById,
    ]
  );

  const state = {
    state: {
      dropTargets,
      activeDropTargetId,
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
