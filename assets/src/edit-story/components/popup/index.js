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
import useObtrusiveScrollbars from '../../utils/useObtrusiveScrollbars';
import { getTransforms, getOffset } from './utils';

/**
 * Internal dependencies
 */

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
  z-index: 2;
  ${({ placement }) => getTransforms(placement)}

  /*
   * Custom gray scrollbars for Chromium & Firefox.
   */

  ${({ obtrusiveScrollbars }) =>
    obtrusiveScrollbars &&
    `
    * {
      scrollbar-width: thin;
      scrollbar-color: ${({ theme }) => theme.colors.bg.v10}
        ${({ theme }) => theme.colors.bg.v12};
    }

    *::-webkit-scrollbar {
      width: ${SCROLLBAR_WIDTH}px;
      height: ${SCROLLBAR_WIDTH}px;
    }
  `}

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

function Popup({
  anchor,
  dock,
  children,
  renderContents,
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

  const obtrusiveScrollbars = useObtrusiveScrollbars();

  return popupState && isOpen
    ? createPortal(
        <Container
          ref={popup}
          {...popupState.offset}
          fillWidth={fillWidth}
          fillHeight={fillHeight}
          placement={placement}
          obtrusiveScrollbars={obtrusiveScrollbars}
        >
          {renderContents
            ? renderContents({ propagateDimensionChange: positionPopup })
            : children}
        </Container>,
        document.body
      )
    : null;
}

export default Popup;
