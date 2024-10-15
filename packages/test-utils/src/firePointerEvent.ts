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
import { fireEvent } from '@testing-library/react';

function _firePointerEvent(
  node: Element | Node | Document | Window,
  eventType: string,
  properties: MouseEventInit
) {
  fireEvent(node, new window.MouseEvent(eventType, properties));
}

const pointerEventTypes = [
  'pointerOver',
  'pointerEnter',
  'pointerDown',
  'pointerMove',
  'pointerUp',
  'pointerCancel',
  'pointerOut',
  'pointerLeave',
  'gotPointerCapture',
  'lostPointerCapture',
];

const firePointerEvent: Record<
  string,
  (node: Element | Node | Document | Window, properties: MouseEventInit) => void
> = {};

pointerEventTypes.forEach((type) => {
  firePointerEvent[type] = (
    node: Element | Node | Document | Window,
    properties: MouseEventInit
  ) =>
    _firePointerEvent(node, type.toLowerCase(), {
      bubbles: true,
      ...properties,
    });
});

export default firePointerEvent;
