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

// Inspired by https://github.com/moxystudio/js-keyboard-only-outlines/blob/master/src/index.js

/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';

/**
 * Internal dependencies
 */
import {
  ACCEPTED_KEYS,
  KEYBOARD_USER_CLASS,
  KEYBOARD_USER_SELECTOR,
} from '../constants/keyboardOnlyOutline';

const OutlineStyles = createGlobalStyle`
    body:not(${KEYBOARD_USER_SELECTOR}) *:focus {
        outline: none !important;
    }
`;

export const KeyboardOnlyOutline = () => {
  const [usingKeyboard, setUsingKeyboard] = useState(false);
  const handleKeydown = (e) => {
    if (!usingKeyboard && ACCEPTED_KEYS.includes(e.code)) {
      setUsingKeyboard(true);
    }
  };

  const handleMousedown = () => {
    if (usingKeyboard) {
      setUsingKeyboard(false);
    }
  };

  document.addEventListener('keydown', handleKeydown, true);
  document.addEventListener('mousedown', handleMousedown, true);

  useEffect(() => {
    return function cleanup() {
      document.removeEventListener('keydown', handleKeydown, true);
      document.removeEventListener('mousedown', handleMousedown, true);
    };
  });

  useEffect(() => {
    document.body.classList.toggle(KEYBOARD_USER_CLASS, usingKeyboard);
  }, [usingKeyboard]);

  return <OutlineStyles />;
};

export function isKeyboardUser() {
  return document.body.classList.contains(KEYBOARD_USER_CLASS);
}

KeyboardOnlyOutline.propTypes = {};
