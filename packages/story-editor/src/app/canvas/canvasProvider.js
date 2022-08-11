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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import { UnitsProvider } from '@googleforcreators/units';
import {
  LOCAL_STORAGE_PREFIX,
  localStore,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useLayout } from '../layout';
import { useStory } from '../story';

import useCanvasCopyPaste from './useCanvasCopyPaste';
import useEditingElement from './useEditingElement';

import Context from './context';
import { RECT_OBSERVATION_KEY } from './constants';

function CanvasProvider({ children }) {
  const [boundingBoxes, setBoundingBoxes] = useState({});
  const [lastSelectionEvent, setLastSelectionEvent] = useState(null);
  const lastSelectedElementId = useRef(null);
  const [canvasContainer, setCanvasContainer] = useState(null);
  const [pageContainer, setPageContainer] = useState(null);
  const [fullbleedContainer, setFullbleedContainer] = useState(null);
  const [designSpaceGuideline, setDesignSpaceGuideline] = useState(null);
  const [pageAttachmentContainer, setPageAttachmentContainer] = useState(null);
  const [displayLinkGuidelines, setDisplayLinkGuidelines] = useState(false);
  const [eyedropperImg, setEyedropperImg] = useState(null);
  const [eyedropperPixelData, setEyedropperPixelData] = useState(null);
  const [isEyedropperActive, setIsEyedropperActive] = useState(null);
  const [eyedropperCallback, setEyedropperCallback] = useState(null);
  const [renamableLayer, setRenamableLayer] = useState(null);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState(() => {
    const local = localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX.ELEMENT_TOOLBAR_SETTINGS
    );
    return local?.position;
  });
  const [displayFloatingMenu, setDisplayFloatingMenu] = useState(() => {
    const local = localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX.ELEMENT_TOOLBAR_SETTINGS
    );
    return local?.isDisplayed;
  });

  // IntersectionObserver tracks clientRects which is what we need here.
  // different from use case of useIntersectionEffect because this is extensible
  // to multiple nodes.
  const clientRectObserver = useMemo(
    () =>
      new window.IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.target.dataset[RECT_OBSERVATION_KEY]) {
            return;
          }
          setBoundingBoxes((boxes) => ({
            ...boxes,
            [entry.target.dataset[RECT_OBSERVATION_KEY]]:
              entry.boundingClientRect,
          }));
        }
      }),
    []
  );
  useEffect(() => () => clientRectObserver.disconnect(), [clientRectObserver]);

  const pageSize = useLayout(({ state: { pageWidth, pageHeight } }) => ({
    width: pageWidth,
    height: pageHeight,
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
    backgroundElementId,
    selectedElementIds,
    toggleElementInSelection,
    setSelectedElementsById,
  } = useStory(
    ({
      state: { currentPage, selectedElementIds },
      actions: { toggleElementInSelection, setSelectedElementsById },
    }) => {
      const elements = currentPage?.elements || [];
      return {
        backgroundElementId: elements[0]?.id,
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
        toggleElementInSelection({ elementId: elId, withLinked: !evt.altKey });
      } else {
        setSelectedElementsById({
          elementIds: [elId],
          withLinked: !evt.altKey,
        });
      }
      evt.currentTarget.focus({ preventScroll: true });
      if (backgroundElementId !== elId) {
        evt.stopPropagation();
      }

      if ('mousedown' === evt.type) {
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
      backgroundElementId,
      clearEditing,
      toggleElementInSelection,
      setSelectedElementsById,
    ]
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

  const [onMoveableMount, setMoveableMount] = useState(null);

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
        displayLinkGuidelines,
        pageAttachmentContainer,
        designSpaceGuideline,
        isEyedropperActive,
        eyedropperCallback,
        eyedropperImg,
        eyedropperPixelData,
        boundingBoxes,
        clientRectObserver,
        onMoveableMount,
        renamableLayer,
        floatingMenuPosition,
        displayFloatingMenu,
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
        setDisplayLinkGuidelines,
        setPageAttachmentContainer,
        setCanvasContainer,
        setDesignSpaceGuideline,
        setIsEyedropperActive,
        setEyedropperCallback,
        setEyedropperImg,
        setEyedropperPixelData,
        setMoveableMount,
        setRenamableLayer,
        setFloatingMenuPosition,
        setDisplayFloatingMenu,
      },
    }),
    [
      pageContainer,
      canvasContainer,
      fullbleedContainer,
      nodesById,
      editingElement,
      editingElementState,
      lastSelectionEvent,
      displayLinkGuidelines,
      pageAttachmentContainer,
      designSpaceGuideline,
      isEyedropperActive,
      eyedropperCallback,
      eyedropperImg,
      eyedropperPixelData,
      boundingBoxes,
      clientRectObserver,
      renamableLayer,
      getNodeForElement,
      floatingMenuPosition,
      displayFloatingMenu,
      setNodeForElement,
      setEditingElementWithoutState,
      setEditingElementWithState,
      clearEditing,
      handleSelectElement,
      onMoveableMount,
      setMoveableMount,
      setRenamableLayer,
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
