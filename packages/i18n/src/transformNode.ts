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
import type { ReactElement, ReactNode } from 'react';
import { cloneElement, createElement } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import type { Mapping } from './types';

/**
 * Recursively traverses through a DOM node and its children and transforms them
 * to React elements.
 *
 * @param node DOM node.
 * @param mapping Map of tag names to React components.
 * @return List of transformed nodes.
 */
export function transform(node: Element, mapping: Mapping = {}): ReactNode[] {
  const result = [];

  do {
    result.push(transformNode(node, mapping));
    node = node.nextSibling as Element;
  } while (node !== null);

  return result;
}

/**
 * Transforms a single DOM node.
 *
 * @param node DOM node.
 * @param mapping Map of tag names to React components.
 * @return Transformed node.
 */
export function transformNode(
  node: Element | Text,
  mapping: Mapping = {}
): ReactElement | string | null {
  const { childNodes, nodeType, textContent } = node;
  if (Node.TEXT_NODE === nodeType) {
    return textContent;
  }

  const children = node.hasChildNodes()
    ? Array.from(childNodes).map((child) =>
        transform(child as Element, mapping)
      )
    : null;

  const { localName } = node as Element;

  if (localName in mapping) {
    return cloneElement(mapping[localName], {}, children);
  }

  return createElement(localName, null, children);
}
