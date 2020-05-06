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

/**
 * External dependencies
 */
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import {
  useLayoutEffect,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';

/**
 * Internal dependencies
 */
import { SCROLLBAR_WIDTH } from '../../constants';

export const Placement = {
  // TOP
  TOP: 'top',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  // BOTTOM
  BOTTOM: 'bottom',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  // RIGHT
  RIGHT: 'right',
  RIGHT_START: 'right-start',
  RIGHT_END: 'right-end',
  // LEFT
  LEFT: 'left',
  LEFT_START: 'left-start',
  LEFT_END: 'left-end',
};

const Container = styled.div.attrs(
  ({ x, y, width, height, fillWidth, fillHeight }) => ({
    style: {
      left: `${x}px`,
      top: `${y}px`,
      ...(fillWidth ? { width: `${width}px` } : {}),
      ...(fillHeight ? { height: `${height}px` } : {}),
    },
  })
)`
  position: fixed;
  z-index: 2147483646;
  ${({ placement }) => getTransforms(placement)}

  /*
   * Custom gray scrollbars for Chromium & Firefox.
   */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.bg.v10}
      ${({ theme }) => theme.colors.bg.v12};
  }

  *::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
    height: ${SCROLLBAR_WIDTH}px;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg.v12};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.fg.v5};
    border: 2px solid ${({ theme }) => theme.colors.bg.v12};
    border-left-width: 3px;
    border-top-width: 3px;
    border-radius: 6px;
  }
`;

function getXTransforms(placement) {
  // left & right
  if (placement.startsWith('left')) {
    return `-100%`;
  } else if (placement.startsWith('right')) {
    return null;
  }
  // top & bottom
  if (placement.endsWith('-start')) {
    return null;
  } else if (placement.endsWith('-end')) {
    return `-100%`;
  }
  return `-50%`;
}

function getYTransforms(placement) {
  if (
    placement.startsWith('top') ||
    placement === Placement.RIGHT_END ||
    placement === Placement.LEFT_END
  ) {
    return `-100%`;
  }
  if (placement === Placement.RIGHT || placement === Placement.LEFT) {
    return `-50%`;
  }
  return null;
}

// note that we cannot use percentage values for transforms, which
// do not work correctly for rotated elements
function getTransforms(placement) {
  const xTransforms = getXTransforms(placement);
  const yTransforms = getYTransforms(placement);
  if (!xTransforms && !yTransforms) {
    return '';
  }
  return `transform: ${xTransforms ? `translateX(${xTransforms})` : ``} ${
    yTransforms ? `translateY(${yTransforms})` : ``
  };`;
}

function getXOffset(placement, spacing = 0, anchorRect, dockRect, bodyRect) {
  switch (placement) {
    case Placement.BOTTOM_START:
    case Placement.TOP_START:
    case Placement.LEFT:
    case Placement.LEFT_END:
    case Placement.LEFT_START:
      return bodyRect.left + (dockRect?.left || anchorRect.left) - spacing;
    case Placement.BOTTOM_END:
    case Placement.TOP_END:
    case Placement.RIGHT:
    case Placement.RIGHT_END:
    case Placement.RIGHT_START:
      return (
        bodyRect.left +
        (dockRect?.left || anchorRect.left) +
        anchorRect.width +
        spacing
      );
    case Placement.BOTTOM:
    case Placement.TOP:
      return (
        bodyRect.left +
        (dockRect?.left || anchorRect.left) +
        anchorRect.width / 2
      );
    default:
      return 0;
  }
}

function getYOffset(placement, spacing = 0, anchorRect) {
  switch (placement) {
    case Placement.BOTTOM:
    case Placement.BOTTOM_START:
    case Placement.BOTTOM_END:
    case Placement.LEFT_END:
    case Placement.RIGHT_END:
      return anchorRect.top + anchorRect.height + spacing;
    case Placement.TOP:
    case Placement.TOP_START:
    case Placement.TOP_END:
    case Placement.LEFT_START:
    case Placement.RIGHT_START:
      return anchorRect.top - spacing;
    case Placement.RIGHT:
    case Placement.LEFT:
      return anchorRect.top + anchorRect.height / 2;
    default:
      return 0;
  }
}

function getOffset(placement, spacing, anchor, dock, popup) {
  const anchorRect = anchor.current.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  const popupRect = popup.current?.getBoundingClientRect();
  const dockRect = dock?.current?.getBoundingClientRect();

  const { height = 0 } = popupRect || {};
  const { x: spacingH = 0, y: spacingV = 0 } = spacing || {};

  // Horizontal
  const offsetX = getXOffset(
    placement,
    spacingH,
    anchorRect,
    dockRect,
    bodyRect
  );
  const maxOffsetX = bodyRect.width - spacingH;
  // Vertical
  const offsetY = getYOffset(placement, spacingV, anchorRect);
  const maxOffsetY = bodyRect.height - height - spacingV;
  // Clamp values
  return {
    x: Math.max(0, Math.min(offsetX, maxOffsetX)),
    y: Math.max(0, Math.min(offsetY, maxOffsetY)),
    width: anchorRect.width,
    height: anchorRect.height,
  };
}

function Popup({
  anchor,
  dock,
  children,
  placement = 'bottom',
  spacing,
  isOpen,
  fillWidth = false,
  fillHeight = false,
}) {
  const [popupState, setPopupState] = useState(null);
  const [mounted, setMounted] = useState(false);
  const popup = useRef(null);

  const positionPopup = useCallback(
    (evt) => {
      if (!mounted) {
        return;
      }

      // If scrolling within the popup, ignore.
      if (evt?.target?.nodeType && popup.current?.contains(evt.target)) {
        return;
      }

      setPopupState({
        offset: getOffset(placement, spacing, anchor, dock, popup),
      });
    },
    [anchor, dock, placement, spacing, mounted]
  );

  useLayoutEffect(() => {
    setMounted(true);
    positionPopup();

    // Adjust the position when scrolling or resizing.
    window.addEventListener('resize', positionPopup);
    document.addEventListener('scroll', positionPopup, true);
    return () => {
      window.removeEventListener('resize', positionPopup);
      document.removeEventListener('scroll', positionPopup, true);
    };
  }, [positionPopup]);

  useEffect(() => {
    positionPopup();
  }, [placement, spacing, anchor, dock, popup, isOpen, positionPopup]);

  return popupState && isOpen
    ? createPortal(
        <Container
          ref={popup}
          {...popupState.offset}
          fillWidth={fillWidth}
          fillHeight={fillHeight}
          placement={placement}
        >
          {children}
        </Container>,
        document.body
      )
    : null;
}

export default Popup;
