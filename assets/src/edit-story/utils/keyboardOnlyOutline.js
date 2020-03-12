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

const OutlineStyles = createGlobalStyle`
    *:focus {
        outline: none !important;
    }
`;

const ACCEPTED_KEYS = [
  9, // Tab
  37, // ArrowLeft
  38, // ArrowTop
  39, // ArrowRight
  40, // ArrowDown
];

const BODY_CLASSNAME = `useskeyboard`;

const KeyboardOnlyOutline = () => {
  const [usingKeyboard, setUsingKeyboard] = useState(false);
  const handleKeydown = (ev) => {
    if (!usingKeyboard && ACCEPTED_KEYS.includes(ev.keyCode)) {
      setUsingKeyboard(true);
    }
  };

  const handleMousedown = () => {
    setUsingKeyboard(false);
  };

  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('mousedown', handleMousedown);

  useEffect(() => {
    return function cleanup() {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleMousedown);
    };
  });

  useEffect(() => {
    if (usingKeyboard) {
      document.body.classList.add(BODY_CLASSNAME);
    } else {
      document.body.classList.remove(BODY_CLASSNAME);
    }
  }, [usingKeyboard]);

  return !usingKeyboard ? <OutlineStyles /> : null;
};

KeyboardOnlyOutline.propTypes = {};

export default KeyboardOnlyOutline;
