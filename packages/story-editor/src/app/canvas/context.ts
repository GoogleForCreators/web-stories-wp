/*
 * Copyright 2022 Google LLC
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
import { createContext } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import type { CanvasProviderState } from '../../types';
import { noop } from '../../utils/noop';

export default createContext<CanvasProviderState>({
  state: {
    pageContainer: null,
    canvasContainer: null,
    fullbleedContainer: null,
    nodesById: {},
    editingElement: null,
    editingElementState: {},
    isEditing: false,
    lastSelectionEvent: null,
    displayLinkGuidelines: false,
    pageAttachmentContainer: null,
    designSpaceGuideline: null,
    isEyedropperActive: false,
    eyedropperCallback: null,
    eyedropperImg: null,
    eyedropperPixelData: null,
    boundingBoxes: {},
    clientRectObserver: null,
    onMoveableMount: null,
    renamableLayer: null,
    floatingMenuPosition: undefined,
    displayFloatingMenu: undefined,
  },
  actions: {
    setPageContainer: noop,
    setFullbleedContainer: noop,
    getNodeForElement: noop,
    setNodeForElement: noop,
    setEditingElement: noop,
    setEditingElementWithState: noop,
    clearEditing: noop,
    handleSelectElement: noop,
    setDisplayLinkGuidelines: noop,
    setPageAttachmentContainer: noop,
    setCanvasContainer: noop,
    setDesignSpaceGuideline: noop,
    setIsEyedropperActive: noop,
    setEyedropperCallback: noop,
    setEyedropperImg: noop,
    setEyedropperPixelData: noop,
    setMoveableMount: noop,
    setRenamableLayer: noop,
    setFloatingMenuPosition: noop,
    setDisplayFloatingMenu: noop,
  },
});
