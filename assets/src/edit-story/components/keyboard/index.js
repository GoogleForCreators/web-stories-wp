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
 * WordPress dependencies
 */
import { useContext, useEffect, createRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Context from './context';

const BLACKLIST_ELEMENTS = ['INPUT', 'TEXTAREA'];

const globalRef = createRef();

export function useKeyDownEffect(ref, keyNameOrSpec, callback, opts) {
  const { keys } = useContext(Context);
  useEffect(
    () => {
      const node = ref.current;
      if (!node) {
        return undefined;
      }
      const handler = createKeyHandler(keys, keyNameOrSpec, callback);
      node.addEventListener('keydown', handler);
      return () => {
        node.removeEventListener('keydown', handler);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current].concat(opts || [])
  );
}

export function useGlobalKeyDownEffect(keySpec, callback, opts) {
  if (!globalRef.current) {
    globalRef.current = document.documentElement;
  }
  useKeyDownEffect(globalRef, keySpec, callback, opts);
}

export function useEscapeToBlurEffect(ref, opts) {
  useKeyDownEffect(
    ref,
    { name: 'escape', input: true },
    () => {
      const { current } = ref;
      const { activeElement } = document;
      if (current.contains(activeElement)) {
        activeElement.blur();
      }
    },
    opts
  );
}

function createKeyHandler(keys, keyNameOrSpec, callback) {
  const {
    key: keyOrPrefixOrArray,
    altKey = false,
    ctrlKey = false,
    metaKey = false,
    shiftKey = false,
    repeat = false,
    input = false,
  } = resolveKeySpec(keys, keyNameOrSpec);
  const matchKey = createKeyMatcher(keyOrPrefixOrArray);
  return (evt) => {
    if (
      (input || isValidTarget(evt.target)) &&
      (altKey === '*' || evt.altKey === altKey) &&
      (ctrlKey === '*' || evt.ctrlKey === ctrlKey) &&
      (metaKey === '*' || evt.metaKey === metaKey) &&
      (shiftKey === '*' || evt.shiftKey === shiftKey) &&
      (repeat === '*' || evt.repeat === repeat) &&
      matchKey(evt.key)
    ) {
      callback(evt);
      evt.stopPropagation();
      evt.stopImmediatePropagation();
    }
  };
}

function resolveKeySpec(keys, keyNameOrSpec) {
  if (typeof keyNameOrSpec === 'string') {
    return keys[keyNameOrSpec];
  }
  if (typeof keyNameOrSpec === 'object' && Boolean(keyNameOrSpec.name)) {
    return {
      ...keyNameOrSpec,
      ...keys[keyNameOrSpec.name],
    };
  }
  return keyNameOrSpec;
}

function createKeyMatcher(keyOrPrefixOrArray) {
  const keyOrPrefixArray = [].concat(keyOrPrefixOrArray);
  return (aKey) =>
    keyOrPrefixArray.some((keyOrPrefix) => {
      const isKeyPrefix = keyOrPrefix[keyOrPrefix.length - 1] === '*';
      const key = isKeyPrefix
        ? keyOrPrefix.substring(0, keyOrPrefix.length - 1)
        : keyOrPrefix;
      return aKey === key || (isKeyPrefix && aKey.startsWith(key));
    });
}

function isValidTarget(target) {
  return (
    target &&
    !BLACKLIST_ELEMENTS.includes(target.tagName) &&
    !target.closest('[contenteditable="true"]')
  );
}
