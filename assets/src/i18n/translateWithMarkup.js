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
import { cloneElement, createElement } from 'react';
import PropTypes from 'prop-types';

/** @typedef {import('react').React.ReactNode} ReactNode */
/** @typedef {import('react').React.ReactElement} ReactElement */

/**
 * Recursively traverses through a DOM node and its children and transforms them
 * to React elements.
 *
 * @param {Node} node DOM node.
 * @param {Object.<string, ReactElement>} mapping Map of tag names to React components.
 * @return {ReactNode[]} List of transformed nodes.
 */
function transform(node, mapping) {
  const result = [];

  do {
    const children = node.childNodes?.length
      ? [...node.childNodes].map((child) => transform(child, mapping))
      : node.textContent || null;

    if (Node.TEXT_NODE === node.nodeType) {
      result.push(node.textContent);
    } else if (Object.keys(mapping).includes(node.localName)) {
      result.push(cloneElement(mapping[node.localName], null, children));
    } else {
      result.push(createElement(node.localName, null, children));
    }

    node = node.nextSibling;
  } while (node !== null);

  return result;
}

/**
 * Component to facilitate translation of strings containing markup.
 *
 * Parses a string using DOMParser and replaces found element nodes
 * with the provided React components.
 *
 * This way, using dangerouslySetInnerHTML can be avoided.
 *
 * @see https://github.com/google/web-stories-wp/issues/1578
 *
 * @param {Object} props Component props.
 * @param {Object.<string, ReactElement>} props.mapping Map of tag names to React components.
 * @param {ReactNode[]|string} props.children Children / string to parse.
 * @return {ReactNode[]} Transformed children.
 */
function TranslateWithMarkup({ mapping, children }) {
  //Ensure all Object keys are lowercase.
  mapping = Object.fromEntries(
    Object.entries(mapping).map(([k, v]) => [k.toLowerCase(), v])
  );

  return transform(
    new DOMParser().parseFromString(children, 'text/html').body.firstChild,
    mapping
  );
}

TranslateWithMarkup.propTypes = {
  mapping: PropTypes.object,
  children: PropTypes.node,
};

export default TranslateWithMarkup;
