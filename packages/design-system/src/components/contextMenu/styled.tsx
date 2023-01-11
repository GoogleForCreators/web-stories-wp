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
import { useCallback } from '@googleforcreators/react';
import styled from 'styled-components';
import type { ComponentPropsWithoutRef } from 'react';

// z-index needs to be higher than the wordpress toolbar z-index: 9989.
// Leaves room for mask to be higher than the wordpress toolbar z-index.
export const POPOVER_Z_INDEX = 9991;

export const Popover = styled.div<{
  isOpen?: boolean;
  isInline?: boolean;
  popoverZIndex?: number;
}>`
  --translate-x: calc(var(--delta-x, 0) * 1px);
  --translate-y: calc(var(--delta-y, 0) * 1px);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: ${({ isInline }) => (isInline ? 'relative' : 'absolute')};
  z-index: ${({ popoverZIndex = POPOVER_Z_INDEX }) => popoverZIndex};
  transform: translate(var(--translate-x), var(--translate-y));
`;

export const Shadow = styled.div<{
  $isHorizontal?: boolean;
}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: ${({ theme, $isHorizontal }) =>
    $isHorizontal ? theme.borders.radius.medium : theme.borders.radius.small};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  pointer-events: none;
`;

export interface SmartPopoverProps
  extends ComponentPropsWithoutRef<typeof Popover> {
  isRTL?: boolean;
}

export function SmartPopover({ isRTL, ...props }: SmartPopoverProps) {
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return;
      }

      const boundingBox = node.getBoundingClientRect();
      const max = {
        x: window.innerWidth - boundingBox.width,
        y: window.innerHeight - boundingBox.height,
      };

      // This is modeling the behavior of chrome:
      // - menu becomes right justified if not enough space horizontally
      // - menu sticks to bottom if not enough space vertically
      const horizontalEdgeCondition = isRTL
        ? boundingBox.x < 0
        : max.x < boundingBox.x;
      const horizontalEdgeTransform = isRTL
        ? boundingBox.width
        : -boundingBox.width;
      const delta = {
        x: horizontalEdgeCondition ? horizontalEdgeTransform : 0,
        y: Math.min(0, max.y - boundingBox.y),
      };
      node.style.setProperty('--delta-x', String(delta.x));
      node.style.setProperty('--delta-y', String(delta.y));
    },
    [isRTL]
  );

  return props.isOpen ? <Popover ref={setRef} {...props} /> : null;
}
