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
import { noop } from '../../utils';
import { getTransforms, getOffset } from './utils';
import { PLACEMENT } from './constants';
const DEFAULT_TOPOFFSET = 0;
const DEFAULT_POPUP_Z_INDEX = 2;
const Container = styled.div.attrs(
  ({
    $offset: { x, y, width, height },
    fillWidth,
    fillHeight,
    placement,
    isRTL,
    invisible,
    zIndex,
  }) => ({
    style: {
      transform: `translate(${x}px, ${y}px) ${getTransforms(placement, isRTL)}`,
      ...(fillWidth ? { width: `${width}px` } : {}),
      ...(fillHeight ? { height: `${height}px` } : {}),
      ...(invisible ? { visibility: 'hidden' } : {}),
      zIndex,
    },
  })
)`
  /*! @noflip */
  left: 0px;
  top: 0px;
  position: fixed;
  ${({ noOverFlow }) => (noOverFlow ? '' : `overflow-y: auto;`)};
  max-height: ${({ topOffset }) => `calc(100vh - ${topOffset}px)`};
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
  invisible = false,
  fillWidth = false,
  fillHeight = false,
  onPositionUpdate = noop,
  refCallback = noop,
  topOffset = DEFAULT_TOPOFFSET,
  zIndex = DEFAULT_POPUP_Z_INDEX,
  noOverFlow = false,
  ignoreMaxOffsetY,
  resetXOffset = false,
}) {
  const [popupState, setPopupState] = useState(null);
  const isMounted = useRef(false);
  const popup = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const positionPopup = useCallback(
    (evt) => {
      if (!isMounted.current || !anchor?.current) {
        return;
      }
      // If scrolling within the popup, ignore.
      if (evt?.target?.nodeType && popup.current?.contains(evt.target)) {
        return;
      }
      setPopupState({
        offset: anchor.current
          ? getOffset({
              placement,
              spacing,
              anchor,
              dock,
              popup,
              isRTL,
              topOffset,
              ignoreMaxOffsetY,
              resetXOffset,
            })
          : {},
        height: popup.current?.getBoundingClientRect()?.height,
      });
    },
    [
      anchor,
      placement,
      spacing,
      dock,
      isRTL,
      topOffset,
      ignoreMaxOffsetY,
      resetXOffset,
    ]
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
    if (!isOpen) {
      return undefined;
    }
    isMounted.current = true;
    positionPopup();
    // Adjust the position when scrolling.
    document.addEventListener('scroll', positionPopup, true);
    return () => {
      document.removeEventListener('scroll', positionPopup, true);
      isMounted.current = false;
    };
  }, [isOpen, positionPopup]);

  useLayoutEffect(() => {
    if (!isMounted.current) {
      return;
    }

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
          topOffset={topOffset}
          noOverFlow={noOverFlow}
          isRTL={isRTL}
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

Popup.propTypes = {
  isRTL: PropTypes.bool,
  anchor: PropTypes.oneOfType([
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    PropTypes.func,
  ]).isRequired,
  dock: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  children: PropTypes.node,
  renderContents: PropTypes.func,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  spacing: PropTypes.object,
  isOpen: PropTypes.bool,
  invisible: PropTypes.bool,
  fillWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  fillHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  onPositionUpdate: PropTypes.func,
  refCallback: PropTypes.func,
  topOffset: PropTypes.number,
  zIndex: PropTypes.number,
  noOverFlow: PropTypes.bool,
  ignoreMaxOffsetY: PropTypes.bool,
  resetXOffset: PropTypes.bool,
};

export { Popup, PLACEMENT };
