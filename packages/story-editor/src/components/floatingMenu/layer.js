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
import { useEffect, useRef, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useCanvas, useLayout } from '../../app';
import FloatingMenu from './menu';

// Note that this has to work for a lot of different types of moveable
// Variants include small elements, proportion-locked text elements, multi-selections, etc.
// Thus we have more selectors than we need for any single variant, but we make sure
// that we cover something present in every variant.
// The reason why we don't just have the control box is, that we need to record a change
// in width as well. If you just change the width in the design panel, the control box doesn't mutate
// Thus we need something that both checks the top-left and the bottom-right corner.
const MUTATE_SELECTORS = [
  '.moveable-control-box', // always present in the top left corner of every movable
  '.moveable-direction.moveable-e', // right side handle of single selection movable
  '.moveable-direction.moveable-s', // bottom side handle of single selection movable
  '.moveable-direction moveable-se', // bottom-right handle of multi selection movable
];

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

  const [moveable, setMoveable] = useState(null);
  const menuRef = useRef();
  const workspaceSize = useRef();

  // Whenever the selection frame (un)mounts, update the reference to moveable
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

  // Whenever moveable is set (because selection count changed between none, single, or multiple)
  useEffect(() => {
    const menu = menuRef.current;
    if (!moveable) {
      menu.style.display = 'none';
      return null;
    }

    const updatePosition = () => {
      const frameRect = moveable.getRect();
      const { width, height } = workspaceSize.current;
      menu.style.display = 'flex';
      const centerX = frameRect.left + frameRect.width / 2;
      menu.style.left = `clamp(0px, ${centerX}px - (var(--width) / 2), ${width}px - var(--width))`;
      const bottomX = frameRect.top + frameRect.height + 10;
      menu.style.top = `clamp(0px, ${bottomX}px, ${height}px - var(--height))`;
    };

    // Update now
    updatePosition();

    // And update when certain elements' properties update
    const observer = new MutationObserver(updatePosition);
    MUTATE_SELECTORS.map((selector) => document.querySelector(selector))
      .filter(Boolean)
      .forEach((node) => observer.observe(node, { attributes: true }));

    return () => observer.disconnect();
  }, [moveable]);

  return <FloatingMenu ref={menuRef} />;
}

export default FloatingMenuLayer;
