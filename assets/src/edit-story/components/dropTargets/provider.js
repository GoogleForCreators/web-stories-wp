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
import { useState, useCallback, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useTransform } from '../transform';
import { useStory } from '../../app';
import Context from './context';

const DROP_SOURCE_ALLOWED_TYPES = ['image', 'video'];
const DROP_TARGET_ALLOWED_TYPES = ['image', 'video', 'shape'];

function DropTargetsProvider({ children }) {
  const [draggingResource, setDraggingResource] = useState(null);
  const [dropTargets, setDropTargets] = useState({});
  const [activeDropTargetId, setActiveDropTargetId] = useState(null);
  const {
    actions: { pushTransform },
  } = useTransform();
  const {
    actions: { combineElements, updateElementById },
    state: { currentPage },
  } = useStory();

  const getDropTargetFromCursor = useCallback(
    (x, y, ignoreId = null) => {
      const underCursor = document.elementsFromPoint(x, y);
      return (
        Object.keys(dropTargets).find(
          (id) => underCursor.includes(dropTargets[id]) && id !== ignoreId
        ) || null
      );
    },
    [dropTargets]
  );

  /**
   * Registering drop targets
   */

  const registerDropTarget = useCallback((id, ref) => {
    setDropTargets((prev) => ({ ...prev, [id]: ref }));
  }, []);

  const unregisterDropTarget = useCallback((id) => {
    setDropTargets((prev) => {
      const { [id]: _, ...without } = prev;
      return without;
    });
  }, []);

  const isDropSource = (type) => {
    return DROP_SOURCE_ALLOWED_TYPES.includes(type);
  };

  const isDropTarget = (type) => {
    return DROP_TARGET_ALLOWED_TYPES.includes(type);
  };

  const activeDropTarget = useMemo(
    () => currentPage?.elements.find((el) => el.id === activeDropTargetId),
    [activeDropTargetId, currentPage]
  );

  /**
   * Dragging elements
   */
  const handleDrag = useCallback(
    (resource, x, y, selfId = null) => {
      if (!isDropSource(resource?.type)) {
        return;
      }

      const dropTargetId = getDropTargetFromCursor(x, y, selfId);

      if (dropTargetId && dropTargetId !== activeDropTargetId) {
        pushTransform(dropTargetId, {
          dropTargets: { active: true, replacement: resource },
        });
        if (selfId) {
          pushTransform(selfId, {
            dropTargets: { hover: true },
          });
        }
      } else if (!dropTargetId) {
        if (selfId) {
          pushTransform(selfId, {
            dropTargets: { hover: false },
          });
        }
      }
      setActiveDropTargetId(dropTargetId);
      (currentPage?.elements || [])
        .filter(({ id }) => id !== dropTargetId)
        .forEach((el) =>
          pushTransform(el.id, {
            dropTargets: { active: false, replacement: null },
          })
        );
    },
    [activeDropTargetId, currentPage, getDropTargetFromCursor, pushTransform]
  );

  /**
   * Dropping and merging elements
   */
  const handleDrop = useCallback(
    (resource, selfId = null) => {
      if (!isDropSource(resource?.type)) {
        return;
      }

      if (!activeDropTargetId || activeDropTargetId === selfId) {
        return;
      }

      const {
        scale = 100,
        focalX = 50,
        focalY = 50,
        isFill = false,
      } = activeDropTarget;

      if (selfId) {
        combineElements({ firstId: selfId, secondId: activeDropTargetId });
      } else {
        updateElementById({
          elementId: activeDropTargetId,
          properties: {
            resource,
            type: resource.type,
            scale,
            focalX,
            focalY,
            isFill,
          },
        });
      }

      // Reset styles on visisble elements
      (currentPage?.elements || [])
        .filter(({ id }) => !(id in Object.keys(dropTargets)) && id !== selfId)
        .forEach((el) => {
          pushTransform(el.id, {
            dropTargets: {
              active: false,
              replacement: null,
            },
          });
        });

      setActiveDropTargetId(null);
    },
    [
      activeDropTarget,
      activeDropTargetId,
      currentPage,
      dropTargets,
      combineElements,
      pushTransform,
      updateElementById,
    ]
  );

  const state = {
    state: {
      dropTargets,
      activeDropTargetId,
      draggingResource,
    },
    actions: {
      registerDropTarget,
      unregisterDropTarget,
      isDropSource,
      isDropTarget,
      handleDrag,
      handleDrop,
      setDraggingResource,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

DropTargetsProvider.propTypes = {
  children: PropTypes.node,
};

export default DropTargetsProvider;
