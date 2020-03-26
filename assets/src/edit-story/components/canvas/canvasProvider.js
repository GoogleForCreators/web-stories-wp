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
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import {
  DEFAULT_EDITOR_PAGE_WIDTH,
  DEFAULT_EDITOR_PAGE_HEIGHT,
} from '../../constants';
import { UnitsProvider } from '../../units';
import useEditingElement from './useEditingElement';
import useCanvasSelectionCopyPaste from './useCanvasSelectionCopyPaste';
import Context from './context';

function CanvasProvider({ children }) {
  const [lastSelectionEvent, setLastSelectionEvent] = useState(null);
  const lastSelectedElementId = useRef(null);

  const [pageSize, setPageSize] = useState({
    width: DEFAULT_EDITOR_PAGE_WIDTH,
    height: DEFAULT_EDITOR_PAGE_HEIGHT,
  });
  const [pageContainer, setPageContainer] = useState(null);

  const {
    nodesById,
    editingElement,
    editingElementState,
    setEditingElementWithState,
    setEditingElementWithoutState,
    clearEditing,
    setNodeForElement,
  } = useEditingElement();

  const {
    state: { currentPage, selectedElementIds },
    actions: { toggleElementInSelection, setSelectedElementsById },
  } = useStory();

  const handleSelectElement = useCallback(
    (elId, evt) => {
      if (editingElement && editingElement !== elId) {
        clearEditing();
      }

      // Skip the focus that immediately follows mouse event.
      // Use the reference to the latest element because the events come in the
      // sequence in the same event loop.
      if (lastSelectedElementId.current === elId && evt.type === 'focus') {
        return;
      }
      lastSelectedElementId.current = elId;
      if (evt.shiftKey) {
        toggleElementInSelection({ elementId: elId });
      } else {
        setSelectedElementsById({ elementIds: [elId] });
      }
      evt.currentTarget.focus();
      if (currentPage?.backgroundElementId !== elId) {
        evt.stopPropagation();
      }

      if ('mousedown' === evt.type) {
        evt.persist();
        setLastSelectionEvent(evt);

        // Clear this selection event as soon as mouse is released
        // `setTimeout` is currently required to not break functionality.
        evt.target.ownerDocument.addEventListener(
          'mouseup',
          () => window.setTimeout(setLastSelectionEvent, 0, null),
          { once: true, capture: true }
        );
      }
    },
    [
      editingElement,
      currentPage,
      clearEditing,
      toggleElementInSelection,
      setSelectedElementsById,
    ]
  );

  const selectIntersection = useCallback(
    ({ x: lx, y: ly, width: lw, height: lh }) => {
      const newSelectedElementIds = currentPage.elements
        .filter(({ x, y, width, height }) => {
          return (
            x <= lx + lw && lx <= x + width && y <= ly + lh && ly <= y + height
          );
        })
        .map(({ id }) => id);
      setSelectedElementsById({ elementIds: newSelectedElementIds });
    },
    [currentPage, setSelectedElementsById]
  );

  // Reset editing mode when selection changes.
  useEffect(() => {
    if (
      editingElement &&
      (selectedElementIds.length !== 1 ||
        selectedElementIds[0] !== editingElement)
    ) {
      clearEditing();
    }
    if (
      lastSelectedElementId.current &&
      !selectedElementIds.includes(lastSelectedElementId.current)
    ) {
      lastSelectedElementId.current = null;
    }
  }, [editingElement, selectedElementIds, clearEditing]);

  useCanvasSelectionCopyPaste(pageContainer);

  const state = {
    state: {
      pageContainer,
      nodesById,
      editingElement,
      editingElementState,
      isEditing: Boolean(editingElement),
      lastSelectionEvent,
      pageSize,
    },
    actions: {
      setPageContainer,
      setNodeForElement,
      setEditingElement: setEditingElementWithoutState,
      setEditingElementWithState,
      clearEditing,
      handleSelectElement,
      selectIntersection,
      setPageSize,
    },
  };

  return (
    <Context.Provider value={state}>
      <UnitsProvider pageSize={pageSize}>{children}</UnitsProvider>
    </Context.Provider>
  );
}

CanvasProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default CanvasProvider;
