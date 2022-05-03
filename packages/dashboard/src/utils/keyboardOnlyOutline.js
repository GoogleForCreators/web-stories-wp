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
import { useEffect, useState } from '@googleforcreators/react';
import { createGlobalStyle } from 'styled-components';

/**
 * Internal dependencies
 */
import { KEYBOARD_USER_CLASS } from '../constants';

export const OutlineStyles = createGlobalStyle`
    *:focus {
        outline: none !important;
    }
`;

const ACCEPTED_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
];

const KeyboardOnlyOutline = () => {
  const [usingKeyboard, setUsingKeyboard] = useState(false);
  const handleKeydown = (e) => {
    if (!usingKeyboard && ACCEPTED_KEYS.includes(e.key)) {
      setUsingKeyboard(true);
    }
  };

  const handleMousedown = () => {
    if (usingKeyboard) {
      setUsingKeyboard(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleMousedown);

    return function cleanup() {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleMousedown);
    };
  });

  useEffect(() => {
    document.body.classList.toggle(KEYBOARD_USER_CLASS, usingKeyboard);
  }, [usingKeyboard]);

  return !usingKeyboard ? <OutlineStyles /> : null;
};

KeyboardOnlyOutline.propTypes = {};

export default KeyboardOnlyOutline;
