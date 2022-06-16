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
import PropTypes from 'prop-types';
import {
  useEffect,
  createRef,
  useState,
  useContext,
  useCallback,
} from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { __ } from '@googleforcreators/i18n';
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
const CLICKABLE_INPUT_TYPES = [
  'submit',
  'button',
  'checkbox',
  'radio',
  'image',
  'file',
  'reset',
];

const globalRef = createRef();

function setGlobalRef() {
  if (!globalRef.current) {
    globalRef.current = document.documentElement;
  }
}

/**
 * @callback KeyEffectCallback
 * @param {KeyboardEvent} event Event.
 */

/**
 * See https://craig.is/killing/mice#keys for the supported key codes.
 *
 * @param {Node|{current: Node}} refOrNode Node or reference to one.
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @param {string|undefined} type Event type, either 'keydown', 'keyup', or undefined to automatically determine it.
 * @param {KeyEffectCallback} callback Callback.
 * @param {Array|undefined} deps The effect's dependencies.
 */
function useKeyEffectInternal(
  refOrNode,
  keyNameOrSpec,
  type,
  callback,
  deps = undefined
) {
  const { keys } = useContext(Context);
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  const batchingCallback = useCallback(callback, deps || []);
  useEffect(
    () => {
      const node =
        typeof refOrNode?.current !== 'undefined'
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

      const keySpec = resolveKeySpec(keys, keyNameOrSpec);
      if (keySpec.key.length === 1 && keySpec.key[0] === '') {
        return undefined;
      }

      const mousetrap = getOrCreateMousetrap(node);
      const handler = createKeyHandler(node, keySpec, batchingCallback);
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
 *
 * @param {Node|{current: Node}} refOrNode Node or reference to one.
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @param {KeyEffectCallback} callback Callback.
 * @param {Array} [deps] The effect's dependencies.
 */
export function useKeyEffect(
  refOrNode,
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyEffectInternal(refOrNode, keyNameOrSpec, undefined, callback, deps);
}

/**
 * @param {Node|{current: Node}} refOrNode Node or reference to one.
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @param {KeyEffectCallback} callback Callback.
 * @param {Array} [deps] The effect's dependencies.
 */
export function useKeyDownEffect(
  refOrNode,
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyEffectInternal(refOrNode, keyNameOrSpec, 'keydown', callback, deps);
}

/**
 * @param {Node|{current: Node}} refOrNode Node or reference to one.
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @param {KeyEffectCallback} callback Callback.
 * @param {Array} [deps] The effect's dependencies.
 */
export function useKeyUpEffect(
  refOrNode,
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyEffectInternal(refOrNode, keyNameOrSpec, 'keyup', callback, deps);
}

/**
 * @param {{current: Node}} refOrNode Node or reference to one.
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @param {Array} [deps] The effect's dependencies.
 * @return {boolean} Stateful boolean that tracks whether key is pressed.
 */
export function useIsKeyPressed(refOrNode, keyNameOrSpec, deps = undefined) {
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

/**
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @param {KeyEffectCallback} callback Callback.
 * @param {Array} [deps] The effect's dependencies.
 */
export function useGlobalKeyDownEffect(
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  setGlobalRef();
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyDownEffect(globalRef, keyNameOrSpec, callback, deps);
}

/**
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @param {KeyEffectCallback} callback Callback.
 * @param {Array} [deps] The effect's dependencies.
 */
export function useGlobalKeyUpEffect(
  keyNameOrSpec,
  callback,
  deps = undefined
) {
  setGlobalRef();
  //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
  useKeyUpEffect(globalRef, keyNameOrSpec, callback, deps);
}

/**
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @param {Array} [deps] The effect's dependencies.
 * @return {boolean} Stateful boolean that tracks whether key is pressed.
 */
export function useGlobalIsKeyPressed(keyNameOrSpec, deps = undefined) {
  setGlobalRef();
  return useIsKeyPressed(globalRef, keyNameOrSpec, deps);
}

/**
 * @param {Node|{current: Node}} refOrNode Node or reference to one
 * @param {Array} [deps] The effect's dependencies.
 */
export function useEscapeToBlurEffect(refOrNode, deps = undefined) {
  useKeyDownEffect(
    refOrNode,
    { key: 'esc', editable: true },
    () => {
      const node =
        typeof refOrNode?.current !== 'undefined'
          ? refOrNode.current
          : refOrNode;
      const { activeElement } = document;
      if (node.contains(activeElement)) {
        activeElement.blur();
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps -- Pass through provided deps.
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
 * @param {Object} keyDict Key dictionary.
 * @param {string|Array|Object} keyNameOrSpec Single key name or key spec.
 * @return {Object} Key object.
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
    clickable = true,
    editable = false,
    dialog = false,
    allowDefault = false,
  } = keySpec;
  const mappedKeys = []
    .concat(keyOrArray)
    .map((key) => keyDict[key] || key)
    .flat();
  const allKeys = addMods(mappedKeys, shift);
  return {
    key: allKeys,
    shift,
    clickable,
    repeat,
    editable,
    dialog,
    allowDefault,
  };
}

function addMods(keys, shift) {
  if (!shift) {
    return keys;
  }
  return keys.concat(keys.map((key) => `shift+${key}`));
}

function createKeyHandler(
  keyTarget,
  {
    repeat: repeatAllowed,
    editable: editableAllowed,
    clickable: clickableAllowed,
    dialog: dialogAllowed,
    allowDefault = false,
  },
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
    if (!clickableAllowed && isClickableTarget(target)) {
      return undefined;
    }
    if (!dialogAllowed && crossesDialogBoundary(target, keyTarget)) {
      return undefined;
    }
    callback(evt);
    // The default `false` value instructs Mousetrap to cancel event propagation
    // and default behavior.
    return allowDefault;
  };
}

function isClickableTarget({ tagName, type }) {
  if (['BUTTON', 'A'].includes(tagName)) {
    return true;
  }
  if (tagName === 'INPUT') {
    return CLICKABLE_INPUT_TYPES.includes(type);
  }
  return false;
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
 * Determines if the current platform is a Mac or not.
 *
 * @return {boolean} True if platform is a Mac.
 */
export function isPlatformMacOS() {
  const { platform } = window.navigator;
  return platform.includes('Mac') || ['iPad', 'iPhone'].includes(platform);
}

/**
 * Get the key specific to operating system.
 *
 * @param {string} key The key to replace. Options: [alt, ctrl, mod, cmd, shift].
 * @return {string} the mapped key. Returns the argument if key is not in options.
 */
export function getKeyForOS(key) {
  const isMacOS = isPlatformMacOS();

  const replacementKeyMap = {
    alt: isMacOS ? '⌥' : 'Alt',
    ctrl: isMacOS ? '^' : 'Ctrl',
    mod: isMacOS ? '⌘' : 'Ctrl',
    cmd: '⌘',
    shift: isMacOS ? '⇧' : 'Shift',
  };

  return replacementKeyMap[key] || key;
}

/**
 * Prettifies keyboard shortcuts in a platform-agnostic way.
 *
 * @param {string} shortcut Keyboard shortcut combination, e.g. 'shift+mod+z'.
 * @return {string} Prettified keyboard shortcut.
 */
export function prettifyShortcut(shortcut) {
  const isMacOS = isPlatformMacOS();

  const delimiter = isMacOS ? '' : '+';

  return shortcut
    .toLowerCase()
    .replace('alt', getKeyForOS('alt'))
    .replace('ctrl', getKeyForOS('ctrl'))
    .replace('mod', getKeyForOS('mod'))
    .replace('cmd', getKeyForOS('cmd'))
    .replace('shift', getKeyForOS('shift'))
    .replace('left', '←')
    .replace('up', '↑')
    .replace('right', '→')
    .replace('down', '↓')
    .replace('delete', '⌫')
    .replace('enter', '⏎')
    .split('+')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(delimiter);
}

/**
 * Creates an aria label for a shortcut.
 *
 * Inspired from the worpress Gutenberg plugin:
 * https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/keycodes/src/index.js#L240-L277
 *
 * @example
 * createShortcutAriaLabel('mod alt del'); -> "Command Alt Del"
 * @param {string} shortcut The keyboard shortcut.
 * @return {string} The aria label.
 */
export function createShortcutAriaLabel(shortcut) {
  const isMacOS = isPlatformMacOS();

  /* translators: Command key on the keyboard */
  const command = __('Command', 'web-stories');
  /* translators: Control key on the keyboard */
  const control = __('Control', 'web-stories');
  /* translators: Option key on the keyboard */
  const option = __('Option', 'web-stories');
  /* translators: Alt key on the keyboard */
  const alt = __('Alt', 'web-stories');

  const replacementKeyMap = {
    alt: isMacOS ? option : alt,
    mod: isMacOS ? command : control,
    /* translators: Control key on the keyboard */
    ctrl: __('Control', 'web-stories'),
    /* translators: shift key on the keyboard */
    shift: __('Shift', 'web-stories'),
    /* translators: delete key on the keyboard */
    delete: __('Delete', 'web-stories'),
    /* translators: comma character ',' */
    ',': __('Comma', 'web-stories'),
    /* translators: period character '.' */
    '.': __('Period', 'web-stories'),
    /* translators: backtick character '`' */
    '`': __('Backtick', 'web-stories'),
  };

  const delimiter = isMacOS ? ' ' : '+';

  return shortcut
    .toLowerCase()
    .replace('alt', replacementKeyMap.alt)
    .replace('ctrl', replacementKeyMap.ctrl)
    .replace('mod', replacementKeyMap.mod)
    .replace('cmd', replacementKeyMap.cmd)
    .replace('shift', replacementKeyMap.shift)
    .replace('delete', replacementKeyMap.delete)
    .replace(',', replacementKeyMap[','])
    .replace('.', replacementKeyMap['.'])
    .replace('`', replacementKeyMap['`'])
    .split(/[\s+]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(delimiter);
}

const Kbd = () => <kbd />;

/**
 * Returns a prettified shortcut wrapped with a <kbd> element.
 *
 * @param {Object} props props
 * @param {import('react').Component} props.component Component used to render the shortcuts. Defaults to `<kbd/>`
 * @param {string} props.shortcut Keyboard shortcut combination, e.g. 'shift+mod+z'.
 * @return {Node} Prettified keyboard shortcut.
 */
export function Shortcut({ component: Component = Kbd, shortcut = '' }) {
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

Shortcut.propTypes = {
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.object]),
  shortcut: PropTypes.string,
};
