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
import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useCanvas, useLayout, useStory, useTransform } from '../../app';
import { FLOATING_MENU_DISTANCE } from '../../constants';
import { SELECTED_ELEMENT_TYPES, hasDesignMenu } from './constants';
import FloatingMenu from './menu';

function FloatingMenuLayer() {
  const { setMoveableMount, isEyedropperActive } = useCanvas(
    ({ actions, state }) => ({
      setMoveableMount: actions.setMoveableMount,
      isEyedropperActive: state.isEyedropperActive,
    })
  );

  const { workspaceWidth, workspaceHeight } = useLayout(
    ({ state: { workspaceWidth, workspaceHeight } }) => ({
      workspaceWidth,
      workspaceHeight,
    })
  );
  // We need to know if what is currently selected as well as a unique identifier
  // for the combined selection (in order to undismiss in case of change of selection)
  const { selectedElementType, selectionIdentifier } = useStory(
    ({ state: { selectedElements } }) => ({
      selectedElementType:
        selectedElements.length === 1 && !selectedElements[0].isBackground
          ? selectedElements[0]?.type
          : selectedElements.length > 1
          ? SELECTED_ELEMENT_TYPES.MULTIPLE
          : SELECTED_ELEMENT_TYPES.NONE,
      selectionIdentifier: selectedElements.map(({ id }) => id).join(''),
    })
  );

  const isAnythingTransforming = useTransform(
    ({ state }) => state.isAnythingTransforming
  );

  const [moveable, setMoveable] = useState(null);
  const menuRef = useRef();
  const workspaceSize = useRef();

  const [isDismissed, setDismissed] = useState(false);
  const handleDismiss = useCallback(() => setDismissed(true), []);
  useEffect(() => setDismissed(false), [selectionIdentifier]);

  // Whenever the selection frame (un)mounts, update the reference to moveable
  // This happens when selection changes between the three possible states: None,
  // single, multiple. If the selection merely changes inside one of those (so
  // from single to another single), this function is not invoked.
  useEffect(() => {
    setMoveableMount(() => setMoveable);
    return () => setMoveableMount(null);
  }, [setMoveableMount]);

  // When eyedropper is active, always hide the floating menu, too.
  useEffect(() => {
    if (isEyedropperActive) {
      setDismissed(true);
    } else {
      setDismissed(false);
    }
  }, [isEyedropperActive]);

  // Whenever the workspace resizes, update size
  useEffect(() => {
    workspaceSize.current = { width: workspaceWidth, height: workspaceHeight };
    // Note that we don't have to manually update our position, because the selection
    // frame will already be updating because of the resize, so a DOM mutation is incoming.
  }, [workspaceWidth, workspaceHeight]);

  const selectedElementHasDesignMenu = hasDesignMenu(selectedElementType);
  const hasMenu = selectedElementHasDesignMenu && !isDismissed && moveable;

  // Whenever moveable is set (because selection count changed between none, single, or multiple)
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || !moveable) {
      return undefined;
    }

    const updatePosition = () => {
      const frameRect = moveable.getRect();
      const { width, height } = workspaceSize.current;
      const centerX = frameRect.left + frameRect.width / 2;
      menu.style.left = `clamp(0px, ${centerX}px - (var(--width) / 2), ${width}px - var(--width))`;
      const bottomX = frameRect.top + frameRect.height + FLOATING_MENU_DISTANCE;
      menu.style.top = `clamp(0px, ${bottomX}px, ${height}px - var(--height))`;
    };

    // Update now
    updatePosition();

    // And update when any element's properties inside the moveable box changes
    const observer = new MutationObserver(updatePosition);
    const node = document.querySelector('.moveable-control-box');
    observer.observe(node, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style'],
    });

    return () => observer.disconnect();
  }, [moveable, hasMenu]);

  if (!hasMenu) {
    return false;
  }

  return (
    <FloatingMenu
      ref={menuRef}
      handleDismiss={handleDismiss}
      selectedElementType={selectedElementType}
      selectionIdentifier={selectionIdentifier}
      visuallyHidden={isAnythingTransforming}
    />
  );
}

export default FloatingMenuLayer;
