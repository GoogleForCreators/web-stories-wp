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

function wrapIndex(i, length) {
  return ((i % length) + length) % length;
}

function createNavigateActiveFocusGroup(uuid, activeFocusGroup) {
  function navigateActiveFocusGroup(step) {
    if (!activeFocusGroup) {
      return;
    }

    const currentIndex = activeFocusGroup.findIndex(
      (nodeTuple) => nodeTuple[0] === uuid
    );
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = wrapIndex(currentIndex + step, activeFocusGroup.length);
    const [, node] = activeFocusGroup[nextIndex];
    node?.focus();
  }

  return navigateActiveFocusGroup;
}

function KeyBindings({ uuid, node, activeFocusGroup, exitCurrentFocusGroup }) {
  const traverseFocusGroup = useCallback(
    (e) => {
      e.preventDefault();

      const navigateFocusGroup = createNavigateActiveFocusGroup(
        uuid,
        activeFocusGroup
      );

      if (e.shiftKey) {
        navigateFocusGroup(-1);
      }
      navigateFocusGroup(1);
    },
    [activeFocusGroup, uuid]
  );

  const exitFocusGroup = useCallback(() => {
    exitCurrentFocusGroup();
  }, [exitCurrentFocusGroup]);

  useKeyDownEffect(
    node,
    { key: ['tab'], allowDefault: true, editable: true, shift: true },
    traverseFocusGroup,
    [traverseFocusGroup]
  );

  useKeyDownEffect(
    node,
    { key: ['esc'], allowDefault: true, editable: true },
    exitFocusGroup,
    [exitFocusGroup]
  );

  return null;
}

export default KeyBindings;
