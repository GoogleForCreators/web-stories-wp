/*
 * Copyright 2021 Google LLC
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SAT from 'sat';

/**
 * Internal dependencies
 */
import { useLayout } from '../layout';
import { useStory } from '../story';
import { UnitsProvider } from '../../units';
import useCanvasCopyPaste from './useCanvasCopyPaste';
import useEditingElement from './useEditingElement';
import createPolygon from './utils/createPolygon';

import Context from './context';

function CanvasProvider({ children }) {
  const [lastSelectionEvent, setLastSelectionEvent] = useState(null);
  const lastSelectedElementId = useRef(null);
  const [canvasContainer, setCanvasContainer] = useState(null);
  const [pageContainer, setPageContainer] = useState(null);
  const [fullbleedContainer, setFullbleedContainer] = useState(null);
  const [designSpaceGuideline, setDesignSpaceGuideline] = useState(null);
  const [pageAttachmentContainer, setPageAttachmentContainer] = useState(null);
  const [displayLinkGuidelines, setDisplayLinkGuidelines] = useState(false);

  const { pageSize, setPageSize } = useLayout(({ state, actions }) => ({
    pageSize: state.canvasPageSize,
    setPageSize: actions.setCanvasPageSize,
  }));

  const {
    nodesById,
    editingElement,
    editingElementState,
    setEditingElementWithState,
    setEditingElementWithoutState,
    clearEditing,
    getNodeForElement,
    setNodeForElement,
  } = useEditingElement();

  const {
    currentPage,
    selectedElementIds,
    toggleElementInSelection,
    setSelectedElementsById,
  } = useStory(
    ({
      state: { currentPage, selectedElementIds },
      actions: { toggleElementInSelection, setSelectedElementsById },
    }) => {
      return {
        currentPage,
        selectedElementIds,
        toggleElementInSelection,
        setSelectedElementsById,
      };
    }
  );

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
      evt.currentTarget.focus({ preventScroll: true });
      if (currentPage?.elements[0].id !== elId) {
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
      currentPage?.elements,
      clearEditing,
      toggleElementInSelection,
      setSelectedElementsById,
    ]
  );

  const selectIntersection = useCallback(
    ({ x: lx, y: ly, width: lw, height: lh }) => {
      const lassoP = createPolygon(0, lx, ly, lw, lh);
      const newSelectedElementIds = currentPage.elements
        .filter(({ isBackground }) => !isBackground)
        .map(({ id, rotationAngle, x, y, width, height }) => {
          const elementP = createPolygon(rotationAngle, x, y, width, height);
          return SAT.testPolygonPolygon(lassoP, elementP) ? id : null;
        })
        .filter((id) => id);
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

  useCanvasCopyPaste();

  const state = useMemo(
    () => ({
      state: {
        pageContainer,
        canvasContainer,
        fullbleedContainer,
        nodesById,
        editingElement,
        editingElementState,
        isEditing: Boolean(editingElement),
        lastSelectionEvent,
        pageSize,
        displayLinkGuidelines,
        pageAttachmentContainer,
        designSpaceGuideline,
      },
      actions: {
        setPageContainer,
        setFullbleedContainer,
        getNodeForElement,
        setNodeForElement,
        setEditingElement: setEditingElementWithoutState,
        setEditingElementWithState,
        clearEditing,
        handleSelectElement,
        selectIntersection,
        setPageSize,
        setDisplayLinkGuidelines,
        setPageAttachmentContainer,
        setCanvasContainer,
        setDesignSpaceGuideline,
      },
    }),
    [
      pageContainer,
      fullbleedContainer,
      nodesById,
      editingElement,
      editingElementState,
      lastSelectionEvent,
      pageSize,
      setPageContainer,
      setFullbleedContainer,
      getNodeForElement,
      setNodeForElement,
      setEditingElementWithoutState,
      setEditingElementWithState,
      clearEditing,
      handleSelectElement,
      selectIntersection,
      setPageSize,
      displayLinkGuidelines,
      setDisplayLinkGuidelines,
      pageAttachmentContainer,
      setPageAttachmentContainer,
      canvasContainer,
      setCanvasContainer,
      designSpaceGuideline,
      setDesignSpaceGuideline,
    ]
  );
  return (
    <Context.Provider value={state}>
      <UnitsProvider pageSize={pageSize}>{children}</UnitsProvider>
    </Context.Provider>
  );
}

CanvasProvider.propTypes = {
  children: PropTypes.node,
};

export default CanvasProvider;
