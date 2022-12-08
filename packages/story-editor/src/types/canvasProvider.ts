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
import type { Hex } from '@googleforcreators/patterns';
import type { EditingState } from '@googleforcreators/rich-text';
import type { Dispatch, SetStateAction } from 'react';

type NodeSetter = Dispatch<SetStateAction<Node | null>>;
type BoolSetter = Dispatch<SetStateAction<boolean>>;
type EyedropperCallback = (rgb: Hex) => void;
type RenamableLayer = null | {
  elementId: string;
};
type VoidFuncWithNoProps = () => void;

interface CanvasActions {
  setPageContainer: NodeSetter;
  setFullbleedContainer: NodeSetter;
  getNodeForElement: (id: string) => Node;
  setNodeForElement: (id: string, ref: Node) => void;
  setEditingElement: (element: string) => void;
  setEditingElementWithState: (state: EditingState) => void;
  clearEditing: VoidFuncWithNoProps;
  handleSelectElement: (id: string, evt: MouseEvent) => void;
  setDisplayLinkGuidelines: BoolSetter;
  setPageAttachmentContainer: NodeSetter;
  setCanvasContainer: NodeSetter;
  setDesignSpaceGuideline: NodeSetter;
  setIsEyedropperActive: BoolSetter;
  setEyedropperCallback: Dispatch<SetStateAction<EyedropperCallback | null>>;
  setEyedropperImg: Dispatch<SetStateAction<string | null>>;
  setEyedropperPixelData: Dispatch<SetStateAction<ImageData | null>>;
  setMoveableMount: Dispatch<SetStateAction<() => void | null>>;
  setRenamableLayer: Dispatch<SetStateAction<RenamableLayer>>;
  setFloatingMenuPosition: Dispatch<SetStateAction<string>>;
  setDisplayFloatingMenu: BoolSetter;
}
interface CanvasState {
  pageContainer: Node | null;
  canvasContainer: Node | null;
  fullbleedContainer: Node | null;
  nodesById: Record<string, Node>;
  // Element ID.
  editingElement: string | null;
  editingElementState: EditingState;
  isEditing: boolean;
  lastSelectionEvent: MouseEvent | null;
  displayLinkGuidelines: boolean;
  pageAttachmentContainer: Node | null;
  designSpaceGuideline: Node | null;
  isEyedropperActive: boolean;
  eyedropperCallback: null | EyedropperCallback;
  eyedropperImg: string | null;
  eyedropperPixelData: ImageData | null;
  boundingBoxes: {
    canvasContainer?: DOMRectReadOnly;
    pageContainer?: DOMRectReadOnly;
  };
  clientRectObserver: IntersectionObserver | null;
  onMoveableMount: VoidFuncWithNoProps | null;
  renamableLayer: RenamableLayer;
  floatingMenuPosition: string;
  displayFloatingMenu: boolean;
}
export interface CanvasProviderState {
  state: CanvasState;
  actions: CanvasActions;
}
