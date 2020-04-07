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

const Container = styled.div.attrs(({ x, y }) => ({
  style: { left: `${x}px`, top: `${y}px` },
}))`
  position: fixed;
  z-index: 2147483646;
  ${({ placement }) => getTransforms(placement)}
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
    placement === 'right-end' ||
    placement === 'left-end'
  ) {
    return `-100%`;
  }
  if (placement === 'right' || placement === 'left') {
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
    case 'bottom-start':
    case 'top-start':
    case 'left':
    case 'left-start':
    case 'left-end':
      return bodyRect.left + (dockRect?.left || anchorRect.left) - spacing;
    case 'bottom-end':
    case 'top-end':
    case 'right':
    case 'right-start':
    case 'right-end':
      return (
        bodyRect.left +
        (dockRect?.left || anchorRect.left) +
        anchorRect.width +
        spacing
      );
    case 'bottom':
    case 'top':
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
    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
    case 'left-end':
    case 'right-end':
      return anchorRect.top + anchorRect.height + spacing;
    case 'top':
    case 'top-start':
    case 'top-end':
    case 'left-start':
    case 'right-start':
      return anchorRect.top - spacing;
    case 'right':
    case 'left':
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
  };
}

function Popup({
  anchor,
  dock,
  children,
  placement = 'bottom',
  spacing,
  isOpen,
}) {
  const [popupState, setPopupState] = useState(null);
  const popup = useRef(null);

  const positionPopup = useCallback(
    (evt) => {
      // If scrolling within the popup, ignore.
      if (evt && popup.current?.contains(evt.target)) {
        return;
      }

      setPopupState({
        offset: getOffset(placement, spacing, anchor, dock, popup),
      });
    },
    [popup, anchor, dock, placement, spacing]
  );

  useLayoutEffect(() => {
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
  }, [anchor, placement, positionPopup, spacing]);

  return popupState && isOpen
    ? createPortal(
        <Container ref={popup} {...popupState.offset} placement={placement}>
          {children}
        </Container>,
        document.body
      )
    : null;
}

export default Popup;
