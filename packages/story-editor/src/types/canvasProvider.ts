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

interface CanvasActions {

}
interface CanvasState {
  pageContainer: Node;
  canvasContainer: Node;
  fullbleedContainer: Node;
  nodesById: Record<string, Node>;
  // @todo
  editingElement: any;
  editingElementState: any;
  isEditing: boolean;
  lastSelectionEvent;
  displayLinkGuidelines: boolean;
  pageAttachmentContainer: Node;
  designSpaceGuideline,
  isEyedropperActive: boolean;
  eyedropperCallback,
  eyedropperImg,
  eyedropperPixelData,
  boundingBoxes,
  clientRectObserver,
  onMoveableMount,
  renamableLayer,
  floatingMenuPosition: string;
  displayFloatingMenu: boolean;
}
export interface CanvasProviderState {
  state: CanvasState;
  actions: CanvasActions;
}
