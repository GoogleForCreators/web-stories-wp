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
import Mousetrap from 'mousetrap';

/**
 * WordPress dependencies
 */
import { useContext, useEffect, createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Context from './context';

const PROP = '__WEB_STORIES_MT__';
const NON_EDITABLE_INPUT_TYPES = [
  'submit',
  'button',
  'checkbox',
  'radio',
  'image',
  'file',
  'range',
  'reset',
  'hidden',
];

const globalRef = createRef();

/**
 * See https://craig.is/killing/mice#keys for the supported key codes.
 *
 * @param {{current: Node}} ref
 * @param {string|Array|Object} keyNameOrSpec
 * @param {function(KeyboardEvent)} callback
 * @param {Array|undefined} deps
 */
export function useKeyDownEffect(
  ref,
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  const { keys } = useContext(Context);
  useEffect(
    () => {
      const node = ref.current;
      if (!node) {
        return undefined;
      }
      if (
        node.nodeType !== /* ELEMENT */ 1 &&
        node.nodeType !== /* DOCUMENT */ 9
      ) {
        throw new Error('only an element or a document node can be used');
      }
      const mousetrap = getOrCreateMousetrap(node);
      const keySpec = resolveKeySpec(keys, keyNameOrSpec);
      const handler = createKeyHandler(keySpec, callback);
      mousetrap.bind(keySpec.key, handler);
      return () => {
        mousetrap.unbind(keySpec.key);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps || []
  );
}

/**
 * See https://craig.is/killing/mice#keys for the supported key codes.
 *
 * @param {string|Array|Object} keyNameOrSpec
 * @param {function(KeyboardEvent)} callback
 * @param {Array|undefined} deps
 */
export function useGlobalKeyDownEffect(
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  if (!globalRef.current) {
    globalRef.current = document;
  }
  useKeyDownEffect(globalRef, keyNameOrSpec, callback, deps);
}

/**
 * @param {{current: Node}} ref
 * @param {Array|undefined} deps
 */
export function useEscapeToBlurEffect(ref, deps = undefined) {
  useKeyDownEffect(
    ref,
    { key: 'esc', editable: true },
    () => {
      const { current } = ref;
      const { activeElement } = document;
      if (current.contains(activeElement)) {
        activeElement.blur();
      }
    },
    deps
  );
}

/**
 * @param {Node} node The DOM node.
 * @return {Mousetrap} The Mousetrap object that will be used to intercept
 * the keyboard events on the specified node.
 */
function getOrCreateMousetrap(node) {
  return node[PROP] || (node[PROP] = new Mousetrap(node));
}

/**
 * @param {Object} keyDict
 * @param {string|Object} keyNameOrSpec
 */
function resolveKeySpec(keyDict, keyNameOrSpec) {
  const keySpec =
    typeof keyNameOrSpec === 'string' || Array.isArray(keyNameOrSpec)
      ? { key: keyNameOrSpec }
      : keyNameOrSpec;
  const {
    key: keyOrArray,
    shift = false,
    repeat = true,
    editable = false,
  } = keySpec;
  const mappedKeys = []
    .concat(keyOrArray)
    .map((key) => keyDict[key] || key)
    .flat();
  const allKeys = addMods(mappedKeys, shift);
  return { key: allKeys, shift, repeat, editable };
}

function addMods(keys, shift) {
  if (!shift) {
    return keys;
  }
  return keys.concat(keys.map((key) => `shift+${key}`));
}

function createKeyHandler(
  { repeat: repeatAllowed, editable: editableAllowed },
  callback
) {
  return (evt) => {
    const { repeat, target } = evt;
    if (!repeatAllowed && repeat) {
      return undefined;
    }
    if (!editableAllowed && isEditableTarget(target)) {
      return undefined;
    }
    callback(evt);
    // The `false` value instructs Mousetrap to cancel event propagation
    // and default behavior.
    return false;
  };
}

function isEditableTarget({ tagName, isContentEditable, type, readOnly }) {
  if (readOnly === true) {
    return false;
  }
  if (isContentEditable || tagName === 'TEXTAREA') {
    return true;
  }
  if (tagName === 'INPUT') {
    return !NON_EDITABLE_INPUT_TYPES.contains(type);
  }
  return false;
}
