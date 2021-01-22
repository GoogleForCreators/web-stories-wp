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
import { useLayoutEffect, useCallback, useState, useRef } from 'react';
/**
 * Internal dependencies
 */
import useResizeEffect from '../../utils/useResizeEffect';
import { getTransforms, getOffset } from './utils';
import { PLACEMENT } from './constants';

// TODO scrollbar update, commented out until design updates are done
const DEFAULT_POPUP_Z_INDEX = 2;
const Container = styled.div.attrs(
  ({ x, y, width, height, fillWidth, fillHeight, placement, zIndex }) => ({
    style: {
      transform: `translate(${x}px, ${y}px) ${getTransforms(placement)}`,
      ...(fillWidth ? { width: `${width}px` } : {}),
      ...(fillHeight ? { height: `${height}px` } : {}),
      zIndex,
    },
  })
)`
  /*! @noflip */
  left: 0px;
  top: 0px;
  position: fixed;

  /*
   * Custom gray scrollbars for Chromium & Firefox.
   */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.bg.primary};
  }

  *::-webkit-scrollbar {
    width: 11px;
    height: 11px;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg.primary};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.fg.secondary};
    border: 2px solid ${({ theme }) => theme.colors.bg.primary};
    border-left-width: 3px;
    border-top-width: 3px;
    border-radius: 6px;
  }
`;

function Popup({
  anchor,
  dock,
  children,
  renderContents,
  placement = PLACEMENT.BOTTOM,
  zIndex = DEFAULT_POPUP_Z_INDEX,
  spacing,
  isOpen,
  fillWidth = false,
  fillHeight = false,
  onPositionUpdate = () => {},
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
    if (!isOpen) {
      return () => {};
    }
    positionPopup();
    // Adjust the position when scrolling.
    document.addEventListener('scroll', positionPopup, true);
    return () => {
      document.removeEventListener('scroll', positionPopup, true);
    };
  }, [isOpen, positionPopup]);

  useLayoutEffect(onPositionUpdate, [popupState, onPositionUpdate]);

  useResizeEffect({ current: document.body }, positionPopup, [positionPopup]);

  return popupState && isOpen
    ? createPortal(
        <Container
          ref={popup}
          {...popupState.offset}
          fillWidth={fillWidth}
          fillHeight={fillHeight}
          placement={placement}
          zIndex={zIndex}
        >
          {renderContents
            ? renderContents({ propagateDimensionChange: positionPopup })
            : children}
        </Container>,
        document.body
      )
    : null;
}

export { Popup, PLACEMENT };
