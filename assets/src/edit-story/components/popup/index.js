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
import { useLayoutEffect, useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import { SCROLLBAR_WIDTH } from '../../constants';

const DEFAULT_WIDTH = 270;
const MAX_HEIGHT = 370;

const Container = styled.div.attrs(({ x, y }) => ({
  style: { right: `${x}px`, top: `${y}px` },
}))`
  position: fixed;
  z-index: 2147483646;
  width: ${({ width }) => (width === 'auto' ? width : `${width}px`)};
  max-height: ${MAX_HEIGHT}px;
  overflow: auto;

  /*
   * Custom dark scrollbars for Chromium & Firefox.
   * Scoped to <Editor> to make sure we don't mess with WP dialogs
   * like the Backbone Media Gallery dialog.
   */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.bg.v10}
      ${({ theme }) => theme.colors.bg.v3};
  }

  *::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
    height: ${SCROLLBAR_WIDTH}px;
  }

  *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg.v3};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.bg.v10};
    border: 2px solid ${({ theme }) => theme.colors.bg.v3};
    border-left-width: 3px;
    border-top-width: 3px;
    border-radius: 6px;
  }
`;

function Popup({ anchor, children, width = DEFAULT_WIDTH, isOpen }) {
  const [popupState, setPopupState] = useState(null);
  const containerRef = useRef();

  useLayoutEffect(() => {
    function positionPopup(evt) {
      // If scrolling within the popup, ignore.
      if (evt && containerRef.current?.contains(evt.target)) {
        return;
      }
      const anchorRect = anchor.current.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();

      // Note: This displays the popup right under the node, currently no variations implemented.
      // @todo Needs to display above the anchor instead if possible in case of not having room below!
      setPopupState({
        width,
        offset: {
          x: bodyRect.right - anchorRect.right,
          y: anchorRect.bottom,
        },
      });
    }
    positionPopup();

    // Adjust the position when scrolling or resizing.
    window.addEventListener('resize', positionPopup);
    document.addEventListener('scroll', positionPopup, true);
    return () => {
      window.removeEventListener('resize', positionPopup);
      document.removeEventListener('scroll', positionPopup, true);
    };
  }, [anchor, width]);

  return popupState && isOpen
    ? createPortal(
        <Container ref={containerRef} {...popupState.offset} width={width}>
          {children}
        </Container>,
        document.body
      )
    : null;
}

export default Popup;
