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
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import Mousetrap, { MousetrapInstance } from 'mousetrap';
import type {
  RefOrNode,
  KeyEffectCallback,
  KeyNameOrSpec,
  Keys,
} from '../../types/keyboard';

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

export interface HTMLElementWithMouseTrap extends HTMLElement {
  [PROP]: undefined | MousetrapInstance;
}
/**
 * @param node The DOM node.
 * @return The Mousetrap object that will be used to intercept
 * the keyboard events on the specified node.
 */
export function getOrCreateMousetrap(node: HTMLElementWithMouseTrap) {
  return node[PROP] || (node[PROP] = new Mousetrap(node));
}

export function getNodeFromRefOrNode(refOrNode: RefOrNode) {
  return refOrNode && 'current' in refOrNode ? refOrNode.current : refOrNode;
}

export function resolveKeySpec(keyDict: Keys, keyNameOrSpec: KeyNameOrSpec) {
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
  const mappedKeys = new Array<string>()
    .concat(keyOrArray)
    .map((key) => keyDict[key as keyof Keys] || key)
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

export function addMods(keys: string[], shift: boolean) {
  if (!shift) {
    return keys;
  }
  return keys.concat(keys.map((key) => `shift+${key}`));
}

interface KeyHandlerProps {
  repeat?: boolean;
  editable?: boolean;
  clickable?: boolean;
  dialog?: boolean;
  allowDefault?: boolean;
}

export function createKeyHandler(
  keyTarget: Element,
  {
    repeat: repeatAllowed,
    editable: editableAllowed,
    clickable: clickableAllowed,
    dialog: dialogAllowed,
    allowDefault = false,
  }: KeyHandlerProps,
  callback: KeyEffectCallback
) {
  return (evt: KeyboardEvent) => {
    const { repeat, target } = evt;
    if (!repeatAllowed && repeat) {
      return undefined;
    }
    if (!editableAllowed && isEditableTarget(target as HTMLInputElement)) {
      return undefined;
    }
    if (!clickableAllowed && isClickableTarget(target as HTMLInputElement)) {
      return undefined;
    }
    if (
      !dialogAllowed &&
      crossesDialogBoundary(target as HTMLElement, keyTarget)
    ) {
      return undefined;
    }
    callback(evt);
    // The default `false` value instructs Mousetrap to cancel event propagation
    // and default behavior.
    return allowDefault;
  };
}

type ClickableHTMLElement =
  | HTMLInputElement
  | HTMLAnchorElement
  | HTMLButtonElement
  | HTMLTextAreaElement;
export function isClickableTarget({ tagName, type }: ClickableHTMLElement) {
  if (['BUTTON', 'A'].includes(tagName)) {
    return true;
  }
  if (tagName === 'INPUT') {
    return CLICKABLE_INPUT_TYPES.includes(type);
  }
  return false;
}

export function isEditableTarget({
  tagName,
  isContentEditable,
  type,
  ...rest
}: ClickableHTMLElement) {
  if ('readOnly' in rest && rest.readOnly === true) {
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

export function crossesDialogBoundary(target: Element, keyTarget: Element) {
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
 */
export function isPlatformMacOS() {
  const { platform } = window.navigator;
  return platform.includes('Mac') || ['iPad', 'iPhone'].includes(platform);
}

/**
 * Get the key specific to operating system.
 */
export function getKeyForOS(key: string) {
  const isMacOS = isPlatformMacOS();

  const replacementKeyMap: Record<string, string> = {
    alt: isMacOS ? '⌥' : 'Alt',
    ctrl: isMacOS ? '^' : 'Ctrl',
    mod: isMacOS ? '⌘' : 'Ctrl',
    cmd: '⌘',
    shift: isMacOS ? '⇧' : 'Shift',
  };

  return replacementKeyMap[key] || key;
}

/**
 * Creates an aria label for a shortcut.
 *
 * Inspired from the worpress Gutenberg plugin:
 * https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/keycodes/src/index.js#L240-L277
 *
 * @example
 * createShortcutAriaLabel('mod alt del'); -> "Command Alt Del"
 */
export function createShortcutAriaLabel(shortcut: string) {
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
    cmd: command,
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

/**
 * Prettifies keyboard shortcuts in a platform-agnostic way.
 */
export function prettifyShortcut(shortcut: string) {
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
