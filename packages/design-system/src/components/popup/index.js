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
import styled from 'styled-components';
import {
  useLayoutEffect,
  useEffect,
  useCallback,
  useState,
  useRef,
  useResizeEffect,
  createPortal,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { noop } from '../../utils';
import { getTransforms, getOffset } from './utils';
import { PLACEMENT } from './constants';

const Container = styled.div.attrs(
  ({
    $offset: { x, y, width, height },
    fillWidth,
    fillHeight,
    placement,
    isRTL,
    invisible,
  }) => ({
    style: {
      transform: `translate(${x}px, ${y}px) ${getTransforms(placement, isRTL)}`,
      ...(fillWidth ? { width: `${width}px` } : {}),
      ...(fillHeight ? { height: `${height}px` } : {}),
      ...(invisible ? { visibility: `hidden` } : {}),
    },
  })
)`
  /*! @noflip */
  left: 0px;
  top: 0px;
  position: fixed;
  z-index: 2;
  overflow-y: auto;
  max-height: calc(100vh - ${THEME_CONSTANTS.WP_ADMIN.TOOLBAR_HEIGHT}px);
`;

function Popup({
  isRTL = false,
  anchor,
  dock,
  children,
  renderContents,
  placement = PLACEMENT.BOTTOM,
  spacing,
  isOpen,
  invisible,
  fillWidth = false,
  fillHeight = false,
  onPositionUpdate = noop,
  refCallback = noop,
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
        offset:
          anchor?.current &&
          getOffset(placement, spacing, anchor, dock, popup, isRTL),
        height: popup.current?.getBoundingClientRect()?.height,
      });
    },
    [anchor, dock, placement, spacing, mounted, isRTL]
  );
  useEffect(() => {
    // If the popup height changes meanwhile, let's update the popup, too.
    if (
      popupState?.height &&
      popupState.height !== popup.current?.getBoundingClientRect()?.height
    ) {
      positionPopup();
    }
  }, [popupState?.height, positionPopup]);

  useLayoutEffect(() => {
    setMounted(true);
    if (!isOpen) {
      return undefined;
    }
    positionPopup();
    // Adjust the position when scrolling.
    document.addEventListener('scroll', positionPopup, true);
    return () => {
      document.removeEventListener('scroll', positionPopup, true);
    };
  }, [isOpen, positionPopup]);

  useLayoutEffect(() => {
    onPositionUpdate(popupState);
    refCallback(popup);
  }, [popupState, onPositionUpdate, refCallback]);

  useResizeEffect({ current: document.body }, positionPopup, [positionPopup]);

  return popupState && isOpen
    ? createPortal(
        <Container
          ref={popup}
          fillWidth={fillWidth}
          fillHeight={fillHeight}
          placement={placement}
          $offset={popupState.offset}
          invisible={invisible}
        >
          {renderContents
            ? renderContents({ propagateDimensionChange: positionPopup })
            : children}
        </Container>,
        document.body
      )
    : null;
}

Popup.propTypes = {
  anchor: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  dock: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  children: PropTypes.node,
  renderContents: PropTypes.func,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  zIndex: PropTypes.number,
  spacing: PropTypes.object,
  isOpen: PropTypes.bool,
  fillWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  fillHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  onPositionUpdate: PropTypes.func,
  refCallback: PropTypes.func,
};

export { Popup, PLACEMENT };
