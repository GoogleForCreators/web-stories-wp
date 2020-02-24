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
 * @param {Array} dataTransfer Array / List of type drag event.
 * @return {string} Simple string of type.
 */
export default function getDragType({ dataTransfer }) {
  if (dataTransfer) {
    if (Array.isArray(dataTransfer.types)) {
      if (dataTransfer.types.includes('Files')) {
        return 'file';
      }
      if (dataTransfer.types.includes('text/html')) {
        return 'html';
      }
    } else {
      // For Edge, types is DomStringList and not array.
      if (dataTransfer.types.contains('Files')) {
        return 'file';
      }
      if (dataTransfer.types.contains('text/html')) {
        return 'html';
      }
    }
  }
  return 'default';
}
