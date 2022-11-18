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
import {
  useEffect,
  useState,
  useContext,
  useBatchingCallback,
  useCallback,
} from '@googleforcreators/react';
import type { DependencyList } from 'react';

/**
 * Internal dependencies
 */
import type {
  KeyEffectCallback,
  KeyNameOrSpec,
  RefOrNode,
} from '../../types/keyboard';
import Context from './context';
import {
  getNodeFromRefOrNode,
  getOrCreateMousetrap,
  HTMLElementWithMouseTrap,
  resolveKeySpec,
  createKeyHandler,
  createShortcutAriaLabel,
  prettifyShortcut,
} from './utils';

const globalRef: { current: null | HTMLElement } = { current: null };

function setGlobalRef() {
  if (!globalRef.current) {
    globalRef.current = document.documentElement;
  }
}

/**
 * See https://craig.is/killing/mice#keys for the supported key codes.
 */
function useKeyEffectInternal(
  refOrNode: RefOrNode,
  keyNameOrSpec: KeyNameOrSpec,
  type: string | undefined,
  callback: KeyEffectCallback,
  deps: DependencyList
) {
  const { keys } = useContext(Context);
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  const batchingCallback = useBatchingCallback(callback, deps || []);
  useEffect(
    () => {
      const nodeEl = getNodeFromRefOrNode(refOrNode);
      if (!nodeEl) {
        return undefined;
      }
      if (
        nodeEl.nodeType !== /* ELEMENT */ 1 &&
        nodeEl.nodeType !== /* DOCUMENT */ 9
      ) {
        throw new Error('only an element or a document node can be used');
      }

      const keySpec = resolveKeySpec(keys, keyNameOrSpec);
      if (keySpec.key.length === 1 && keySpec.key[0] === '') {
        return undefined;
      }

      const mousetrap = getOrCreateMousetrap(
        nodeEl as HTMLElementWithMouseTrap
      );
      const handler = createKeyHandler(
        nodeEl as HTMLElement,
        keySpec,
        batchingCallback
      );
      mousetrap.bind(keySpec.key, handler, type);
      return () => {
        mousetrap.unbind(keySpec.key, type);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Deliberately don't want the other possible deps here.
    [batchingCallback, keys]
  );
}

/**
 * Depending on the key spec, this will bind to either the 'keypress' or
 * 'keydown' event type, by passing 'undefined' to the event type parameter of
 * Mousetrap.bind.
 *
 * See https://craig.is/killing/mice#api.bind.
 */
export function useKeyEffect(
  refOrNode: RefOrNode,
  keyNameOrSpec: KeyNameOrSpec,
  callback: KeyEffectCallback,
  deps: DependencyList
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyEffectInternal(refOrNode, keyNameOrSpec, undefined, callback, deps);
}

export function useKeyDownEffect(
  refOrNode: RefOrNode,
  keyNameOrSpec: KeyNameOrSpec,
  callback: KeyEffectCallback,
  deps: DependencyList
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyEffectInternal(refOrNode, keyNameOrSpec, 'keydown', callback, deps);
}

export function useKeyUpEffect(
  refOrNode: RefOrNode,
  keyNameOrSpec: KeyNameOrSpec,
  callback: KeyEffectCallback,
  deps: DependencyList
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyEffectInternal(refOrNode, keyNameOrSpec, 'keyup', callback, deps);
}

export function useIsKeyPressed(
  refOrNode: RefOrNode,
  keyNameOrSpec: KeyNameOrSpec,
  deps: DependencyList
) {
  const [isKeyPressed, setIsKeyPressed] = useState(false);

  const handleBlur = useCallback(() => {
    setIsKeyPressed(false);
  }, []);
  useEffect(() => {
    window.addEventListener('blur', handleBlur);
    return function () {
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleBlur]);

  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyDownEffect(refOrNode, keyNameOrSpec, () => setIsKeyPressed(true), deps);
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyUpEffect(refOrNode, keyNameOrSpec, () => setIsKeyPressed(false), deps);
  return isKeyPressed;
}

export function useGlobalKeyDownEffect(
  keyNameOrSpec: KeyNameOrSpec,
  callback: KeyEffectCallback,
  deps: DependencyList
) {
  setGlobalRef();
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyDownEffect(globalRef, keyNameOrSpec, callback, deps);
}
export function useGlobalKeyUpEffect(
  keyNameOrSpec: KeyNameOrSpec,
  callback: KeyEffectCallback,
  deps: DependencyList
) {
  setGlobalRef();
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyUpEffect(globalRef, keyNameOrSpec, callback, deps);
}

export function useGlobalIsKeyPressed(
  keyNameOrSpec: KeyNameOrSpec,
  deps: DependencyList
) {
  setGlobalRef();
  return useIsKeyPressed(globalRef, keyNameOrSpec, deps);
}

export function useEscapeToBlurEffect(
  refOrNode: RefOrNode,
  deps: DependencyList
) {
  useKeyDownEffect(
    refOrNode,
    { key: 'esc', editable: true },
    () => {
      const nodeEl = getNodeFromRefOrNode(refOrNode);
      const { activeElement } = document;
      if (nodeEl && activeElement && nodeEl.contains(activeElement)) {
        (activeElement as HTMLInputElement).blur();
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
    deps
  );
}

interface ShortcutProps {
  component: React.FC;
  shortcut?: string;
}
/**
 * Returns a prettified shortcut wrapped with a <kbd> element.
 */
export function Shortcut({
  component: Component,
  shortcut = '',
}: ShortcutProps) {
  const chars = shortcut.split(' ');

  return (
    <Component aria-label={createShortcutAriaLabel(shortcut)}>
      {chars.map((char, index) => (
        // eslint-disable-next-line react/no-array-index-key -- Should be OK due to also using the character.
        <Component key={`${index}-${char}`}>{prettifyShortcut(char)}</Component>
      ))}
    </Component>
  );
}
