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
import type { PropsWithChildren } from 'react';
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
import type {
  BoundingBoxes,
  EyedropperCallback,
  RenamableLayer,
  VoidFuncWithNoProps,
} from '../../types';
import useCanvasCopyPaste from './useCanvasCopyPaste';
import useEditingElement from './useEditingElement';

import Context from './context';
import { RECT_OBSERVATION_KEY } from './constants';

interface Local {
  position: string;
  isDisplayed: boolean;
}
function CanvasProvider({ children }: PropsWithChildren<unknown>) {
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBoxes>({});
  const [lastSelectionEvent, setLastSelectionEvent] =
    useState<MouseEvent | null>(null);
  const lastSelectedElementId = useRef<string | null>(null);
  const [canvasContainer, setCanvasContainer] = useState<Node | null>(null);
  const [pageContainer, setPageContainer] = useState<Node | null>(null);
  const [fullbleedContainer, setFullbleedContainer] = useState<Node | null>(
    null
  );
  const [designSpaceGuideline, setDesignSpaceGuideline] = useState<Node | null>(
    null
  );
  const [pageAttachmentContainer, setPageAttachmentContainer] =
    useState<Node | null>(null);
  const [displayLinkGuidelines, setDisplayLinkGuidelines] =
    useState<boolean>(false);
  const [eyedropperImg, setEyedropperImg] = useState<string | null>(null);
  const [eyedropperPixelData, setEyedropperPixelData] =
    useState<Uint8ClampedArray | null>(null);
  const [isEyedropperActive, setIsEyedropperActive] = useState<boolean>(false);
  const [eyedropperCallback, setEyedropperCallback] =
    useState<EyedropperCallback | null>(null);
  const [renamableLayer, setRenamableLayer] = useState<RenamableLayer>(null);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState(() => {
    const local = localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX.ELEMENT_TOOLBAR_SETTINGS
    ) as Local | null;
    return local?.position;
  });
  const [displayFloatingMenu, setDisplayFloatingMenu] = useState(() => {
    const local = localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX.ELEMENT_TOOLBAR_SETTINGS
    ) as Local | undefined;
    return local?.isDisplayed;
  });

  // IntersectionObserver tracks clientRects which is what we need here.
  // different from use case of useIntersectionEffect because this is extensible
  // to multiple nodes.
  const clientRectObserver = useMemo(
    () =>
      new window.IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!(entry.target instanceof HTMLElement)) {
            return;
          }
          if (!entry.target.dataset[RECT_OBSERVATION_KEY]) {
            return;
          }
          const index = entry.target.dataset[RECT_OBSERVATION_KEY];
          setBoundingBoxes((boxes) => ({
            ...boxes,
            [index]: entry.boundingClientRect,
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
    (elId: string, evt: MouseEvent) => {
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
      if (evt.currentTarget instanceof HTMLElement) {
        evt.currentTarget.focus({ preventScroll: true });
      }
      if (backgroundElementId !== elId) {
        evt.stopPropagation();
      }

      if ('mousedown' === evt.type) {
        setLastSelectionEvent(evt);

        // Clear this selection event as soon as mouse is released
        // `setTimeout` is currently required to not break functionality.
        if (evt.target instanceof HTMLElement) {
          evt.target.ownerDocument.addEventListener(
            'mouseup',
            () => window.setTimeout(setLastSelectionEvent, 0, null),
            { once: true, capture: true }
          );
        }
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

  const [onMoveableMount, setMoveableMount] =
    useState<VoidFuncWithNoProps | null>(null);

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

export default CanvasProvider;
