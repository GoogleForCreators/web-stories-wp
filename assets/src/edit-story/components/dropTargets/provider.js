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
import { useState, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useTransform } from '../transform';
import { useStory } from '../../app';
import { getTypeFromResource } from '../../elements';
import Context from './context';

function DropTargetsProvider({ children }) {
  const [dropTargets, setDropTargets] = useState({});
  const [activeDropTargetId, setActiveDropTargetId] = useState(null);
  const {
    actions: { pushTransform },
  } = useTransform();
  const {
    actions: { deleteElementById, setSelectedElementsById, updateElementById },
    state: { currentPage },
  } = useStory();

  const getDropTargetFromCursor = useCallback(
    (x, y) => {
      const underCursor = document.elementsFromPoint(x, y);
      return (
        Object.keys(dropTargets).find((id) =>
          underCursor.includes(dropTargets[id])
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
    (resourceOrElement, x, y) => {
      const id = resourceOrElement.id;
      const resource = resourceOrElement.resource || resourceOrElement;
      const dropTargetId = getDropTargetFromCursor(x, y);

      if (
        dropTargetId &&
        dropTargetId !== id &&
        dropTargetId !== activeDropTargetId
      ) {
        pushTransform(dropTargetId, {
          updates: { dropTargetActive: true, replacement: resource },
        });
        if (id) {
          pushTransform(id, {
            updates: { overDropTarget: true },
          });
        }
      } else if (!dropTargetId) {
        (currentPage?.elements || []).forEach((el) =>
          pushTransform(el.id, {
            updates: { dropTargetActive: false, replacement: null },
          })
        );
        if (id) {
          pushTransform(id, {
            updates: { overDropTarget: false },
          });
        }
      }
      if (dropTargetId !== id) {
        setActiveDropTargetId(dropTargetId);
      }
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
  const handleDrop = useCallback(
    (resourceOrElement) => {
      const id = resourceOrElement.id;
      const resource = resourceOrElement.resource || resourceOrElement;

      if (activeDropTargetId && activeDropTargetId !== id) {
        updateElementById({
          elementId: activeDropTargetId,
          properties: { resource, type: getTypeFromResource(resource) },
        });
        if (id) {
          deleteElementById({ elementId: id });
        }
        // Reset styles on all other elements
        (currentPage?.elements || []).forEach((el) =>
          pushTransform(el.id, {
            updates: { dropTargetActive: false, replacement: null },
          })
        );
        setSelectedElementsById({ elementIds: activeDropTargetId });
        setActiveDropTargetId(null);
      }
    },
    [
      activeDropTargetId,
      currentPage,
      deleteElementById,
      pushTransform,
      setSelectedElementsById,
      updateElementById,
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
