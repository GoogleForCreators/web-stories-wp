/*
 * Copyright 2021 Google LLC
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
import { useCallback, useEffect } from 'react';
/**
 * Internal dependencies
 */
import { useContextSelector, useFocusOut } from '../../../design-system';
import Context from './context';

/**
 *
 * @typedef {import('./states').Highlight} Highlight
 */

/**
 * Given a state key and a focusable ref, return the highlight context state
 * and have the following effects on the element which owns the ref:
 * - on focus out, clear the highlight state
 * - on keydown, click, cancel any visual effects
 *
 * @param {string} stateKey the key of the highlight state to select from the context
 * @param {{ current: { focus: Function }}} ref reference to a focusable input or button
 * @return {Highlight} current highlight state
 */
function useFocusHighlight(stateKey, ref) {
  const context = useContextSelector(Context, (state) => ({
    [stateKey]: state[stateKey],
    onFocusOut: state.onFocusOut,
    cancelEffect: state.cancelEffect,
  }));

  const current = ref?.current;
  const highlight = context[stateKey];
  const { onFocusOut, cancelEffect } = context;

  const cancelEffectOnChange = useCallback(() => {
    const events = ['click', 'keydown'];
    const listener = () => {
      cancelEffect(stateKey);
    };
    if (highlight?.focus && highlight?.showEffect) {
      events.forEach((eventName) => {
        ref?.current?.addEventListener(eventName, listener);
      });
    }

    return () => {
      events.forEach((eventName) => {
        ref?.current?.removeEventListener(eventName, listener);
      });
    };
  }, [stateKey, ref, highlight, cancelEffect]);

  // when the user begins interacting with the focus element, stop the effect
  useEffect(cancelEffectOnChange, [cancelEffectOnChange]);

  useEffect(() => {
    // timeout allows a state update tick
    // needed for when components are being rendered by switching tabs and selecting elements
    setTimeout(() => {
      // if the effect has been canceled, do not re-focus
      highlight?.focus && highlight?.showEffect && current?.focus();
    });
  }, [highlight, current]);

  useFocusOut(ref, onFocusOut);

  return highlight;
}

export default useFocusHighlight;
