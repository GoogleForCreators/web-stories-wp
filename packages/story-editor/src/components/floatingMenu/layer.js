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
import { useCanvas, useLayout, useStory } from '../../app';
import { FLOATING_MENU_DISTANCE } from '../../constants';
import FloatingMenu from './menu';

function FloatingMenuLayer() {
  const { setMoveableMount } = useCanvas(
    ({ actions: { setMoveableMount } }) => ({ setMoveableMount })
  );
  const { workspaceWidth, workspaceHeight } = useLayout(
    ({ state: { workspaceWidth, workspaceHeight } }) => ({
      workspaceWidth,
      workspaceHeight,
    })
  );
  // We need to know if anything (non-bg) is selected, if more than one element is selected,
  // the list of different element types selected as well as a unique identifier
  // for the combined selection (in order to undismiss in case of change of seletion)
  const {
    hasSelection,
    hasMultiSelection,
    selectionTypes,
    selectionIdentifier,
  } = useStory(({ state: { selectedElements } }) => ({
    hasSelection:
      selectedElements.filter(({ isBackground }) => !isBackground).length > 0,
    hasMultiSelection: selectedElements.length > 1,
    selectionTypes: [
      ...new Set(selectedElements.map(({ type }) => type)),
    ].sort(),
    selectionIdentifier: selectedElements.map(({ id }) => id).join(''),
  }));

  const [moveable, setMoveable] = useState(null);
  const menuRef = useRef();
  const workspaceSize = useRef();

  const [isDismissed, setDismissed] = useState(false);
  const dismiss = useCallback(() => setDismissed(true), []);
  useEffect(() => setDismissed(false), [selectionIdentifier]);

  // Whenever the selection frame (un)mounts, update the reference to moveable
  // This happens when selection changes between the three possible states: None,
  // single, multiple. If the selection merely changes inside one of those (so
  // from single to another single), this function is not invoked.
  useEffect(() => {
    setMoveableMount(() => setMoveable);
    return () => setMoveableMount(null);
  }, [setMoveableMount]);

  // Whenever the workspace resizes, update size
  useEffect(() => {
    workspaceSize.current = { width: workspaceWidth, height: workspaceHeight };
    // Note that we don't have to manually update our position, because the selection
    // frame will already be updating because of the resize, so a DOM mutation is incoming.
  }, [workspaceWidth, workspaceHeight]);

  const hasMenu = hasSelection && !isDismissed && moveable;

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
      dismiss={dismiss}
      hasMultiSelection={hasMultiSelection}
      selectionTypes={selectionTypes}
    />
  );
}

export default FloatingMenuLayer;
