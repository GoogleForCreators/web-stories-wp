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
import { useEffect, createRef, useState } from 'react';

/**
 * Internal dependencies
 */
import useBatchingCallback from '../../utils/useBatchingCallback';
import { useContext } from '../../utils/context';
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

function setGlobalRef() {
  if (!globalRef.current) {
    globalRef.current = document;
  }
}

/**
 * See https://craig.is/killing/mice#keys for the supported key codes.
 *
 * @param {Node|{current: Node}} refOrNode
 * @param {string|Array|Object} keyNameOrSpec
 * @param {string|undefined} type
 * @param {function(KeyboardEvent)} callback
 * @param {Array|undefined} deps
 */
function useKeyEffectInternal(
  refOrNode,
  keyNameOrSpec,
  type,
  callback,
  deps = undefined
) {
  const { keys } = useContext(Context);
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const batchingCallback = useBatchingCallback(callback, deps || []);
  useEffect(
    () => {
      const node =
        typeof refOrNode.current !== 'undefined'
          ? refOrNode.current
          : refOrNode;
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
      const handler = createKeyHandler(node, keySpec, batchingCallback);
      mousetrap.bind(keySpec.key, handler, type);
      return () => {
        mousetrap.unbind(keySpec.key);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [batchingCallback, keys]
  );
}

/**
 * Depending on the key spec, this will bind to either the 'keypress' or
 * 'keydown' event type, by passing 'undefined' to the event type parameter of
 * Mousetrap.bind.
 *
 * See https://craig.is/killing/mice#api.bind.
 *
 * @param {Node|{current: Node}} refOrNode
 * @param {string|Array|Object} keyNameOrSpec
 * @param {function(KeyboardEvent)} callback
 * @param {Array|undefined} deps
 */
export function useKeyEffect(
  refOrNode,
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps
  useKeyEffectInternal(refOrNode, keyNameOrSpec, undefined, callback, deps);
}

/**
 * @param {Node|{current: Node}} refOrNode
 * @param {string|Array|Object} keyNameOrSpec
 * @param {function(KeyboardEvent)} callback
 * @param {Array|undefined} deps
 */
export function useKeyDownEffect(
  refOrNode,
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps
  useKeyEffectInternal(refOrNode, keyNameOrSpec, 'keydown', callback, deps);
}

/**
 * @param {Node|{current: Node}} refOrNode
 * @param {string|Array|Object} keyNameOrSpec
 * @param {function(KeyboardEvent)} callback
 * @param {Array|undefined} deps
 */
export function useKeyUpEffect(
  refOrNode,
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps
  useKeyEffectInternal(refOrNode, keyNameOrSpec, 'keyup', callback, deps);
}

/**
 * @param {{current: Node}} refOrNode
 * @param {string|Array|Object} keyNameOrSpec
 * @param {Array|undefined} deps
 * @return {boolean} Stateful boolean that tracks whether key is pressed.
 */
export function useIsKeyPressed(refOrNode, keyNameOrSpec, deps = undefined) {
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  //eslint-disable-next-line react-hooks/exhaustive-deps
  useKeyDownEffect(refOrNode, keyNameOrSpec, () => setIsKeyPressed(true), deps);
  //eslint-disable-next-line react-hooks/exhaustive-deps
  useKeyUpEffect(refOrNode, keyNameOrSpec, () => setIsKeyPressed(false), deps);
  return isKeyPressed;
}

/**
 * @param {string|Array|Object} keyNameOrSpec
 * @param {function(KeyboardEvent)} callback
 * @param {Array|undefined} deps
 */
export function useGlobalKeyDownEffect(
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  setGlobalRef();
  //eslint-disable-next-line react-hooks/exhaustive-deps
  useKeyDownEffect(globalRef, keyNameOrSpec, callback, deps);
}

/**
 * @param {string|Array|Object} keyNameOrSpec
 * @param {function(KeyboardEvent)} callback
 * @param {Array|undefined} deps
 */
export function useGlobalKeyUpEffect(
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  setGlobalRef();
  //eslint-disable-next-line react-hooks/exhaustive-deps
  useKeyUpEffect(globalRef, keyNameOrSpec, callback, deps);
}

/**
 * @param {string|Array|Object} keyNameOrSpec
 * @param {Array|undefined} deps
 * @return {boolean} Stateful boolean that tracks whether key is pressed.
 */
export function useGlobalIsKeyPressed(keyNameOrSpec, deps = undefined) {
  setGlobalRef();
  return useIsKeyPressed(globalRef, keyNameOrSpec, deps);
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
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
    dialog = false,
  } = keySpec;
  const mappedKeys = []
    .concat(keyOrArray)
    .map((key) => keyDict[key] || key)
    .flat();
  const allKeys = addMods(mappedKeys, shift);
  return { key: allKeys, shift, repeat, editable, dialog };
}

function addMods(keys, shift) {
  if (!shift) {
    return keys;
  }
  return keys.concat(keys.map((key) => `shift+${key}`));
}

function createKeyHandler(
  keyTarget,
  { repeat: repeatAllowed, editable: editableAllowed, dialog: dialogAllowed },
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
    if (!dialogAllowed && crossesDialogBoundary(target, keyTarget)) {
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
    return !NON_EDITABLE_INPUT_TYPES.includes(type);
  }
  return false;
}

function crossesDialogBoundary(target, keyTarget) {
  if (target.nodeType !== 1) {
    // Not an element. Most likely a document node. The dialog search
    // does not apply.
    return false;
  }
  // Check if somewhere between `keyTarget` and `target` there's a
  // dialog boundary.
  const dialog = target.closest('dialog,[role="dialog"]');
  return dialog && keyTarget !== dialog && keyTarget.contains(dialog);
}

/**
 * Prettifies keyboard shortcuts in a platform-agnostic way.
 *
 * @param {string} shortcut Keyboard shortcut combination, e.g. 'shift+mod+z'.
 * @return {string} Prettified keyboard shortcut.
 */
export function prettifyShortcut(shortcut) {
  const { platform } = global.navigator;
  const isMacOS =
    platform.includes('Mac') || ['iPad', 'iPhone'].includes(platform);

  const replacementKeyMap = {
    alt: isMacOS ? '⌥' : 'Alt',
    ctrl: isMacOS ? '^' : 'Ctrl',
    mod: isMacOS ? '⌘' : 'Ctrl',
    cmd: '⌘',
    shift: isMacOS ? '⇧' : 'Shift',
  };

  const delimiter = isMacOS ? '' : '+';

  return shortcut
    .toLowerCase()
    .replace('alt', replacementKeyMap.alt)
    .replace('ctrl', replacementKeyMap.ctrl)
    .replace('mod', replacementKeyMap.mod)
    .replace('cmd', replacementKeyMap.cmd)
    .replace('shift', replacementKeyMap.shift)
    .replace('left', '←')
    .replace('up', '↑')
    .replace('right', '→')
    .replace('down', '↓')
    .replace('delete', '⌫')
    .split('+')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(delimiter);
}
