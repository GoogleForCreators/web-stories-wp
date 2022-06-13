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
import { useKeyDownEffect } from '@googleforcreators/design-system';
import { useCallback } from '@googleforcreators/react';
import PropTypes from 'prop-types';

function wrapIndex(i, length) {
  return ((i % length) + length) % length;
}

function createNavigateFocusGroup(uuid, focusGroup) {
  function navigateFocusGroup(step) {
    if (!focusGroup) {
      return;
    }

    const currentIndex = focusGroup.findIndex(
      (nodeTuple) => nodeTuple[0] === uuid
    );
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = wrapIndex(currentIndex + step, focusGroup.length);
    const [, node] = focusGroup[nextIndex];
    node?.focus();
  }

  return navigateFocusGroup;
}

function KeyBindings({ uuid, node, focusGroup, exitFocusGroup }) {
  const traverseFocusGroup = useCallback(
    (e) => {
      e.preventDefault();

      const navigateFocusGroup = createNavigateFocusGroup(uuid, focusGroup);

      if (e.shiftKey) {
        navigateFocusGroup(-1);
        return;
      }

      navigateFocusGroup(1);
    },
    [focusGroup, uuid]
  );

  const handleEsc = useCallback(
    (e) => {
      e.preventDefault();
      exitFocusGroup?.();
    },
    [exitFocusGroup]
  );

  useKeyDownEffect(
    node,
    { key: ['tab'], allowDefault: true, editable: true, shift: true },
    traverseFocusGroup,
    [traverseFocusGroup]
  );

  useKeyDownEffect(
    node,
    { key: ['esc'], allowDefault: true, editable: true },
    handleEsc,
    [handleEsc]
  );

  return null;
}

KeyBindings.propTypes = {
  uuid: PropTypes.string.isRequired,
  node:
    typeof Element !== 'undefined'
      ? PropTypes.instanceOf(Element).isRequired
      : PropTypes.any.isRequired,
  focusGroup: PropTypes.array.isRequired,
  exitFocusGroup: PropTypes.func,
};

export default KeyBindings;
