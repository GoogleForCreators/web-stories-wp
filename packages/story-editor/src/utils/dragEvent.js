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
 * Get Drag Type from event.
 *
 * @param {DragEvent} e The drag event.
 * @param {string} type The type of transfer payload to test against
 * @return {boolean} Whether the drag is of the specified type
 */
export function isDragType(e, type) {
  if (!e?.dataTransfer?.types) {
    return false;
  }
  return Array.isArray(e.dataTransfer.types)
    ? e.dataTransfer.types.includes(type)
    : e.dataTransfer.types.contains(type);
}

/**
 * Get Drag Type from event.
 *
 * @param {DragEvent} e The drag event.
 * @return {boolean} Whether the drag event is relating to a file transfer
 */
export function isDraggingFile(e) {
  return isDragType(e, 'Files');
}
