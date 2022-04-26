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
import { PLACEMENT, PopupContainer } from './constants';
const DEFAULT_TOPOFFSET = 0;
const DEFAULT_POPUP_Z_INDEX = 2;

function Popup({
  isRTL = false,
  anchor,
  dock,
  children,
  renderContents,
  placement = PLACEMENT.BOTTOM,
  spacing,
  isOpen,
  fillWidth = false,
  refCallback = noop,
  topOffset = DEFAULT_TOPOFFSET,
  zIndex = DEFAULT_POPUP_Z_INDEX,
  ignoreMaxOffsetY,
  resetXOffset = false,
}) {
  const [popupState, setPopupState] = useState(null);
  const isMounted = useRef(false);
  const popup = useRef(null);

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
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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

    refCallback(popup);
  }, [popupState, refCallback]);

  useResizeEffect({ current: document.body }, positionPopup, [positionPopup]);
  return popupState && isOpen
    ? createPortal(
        <PopupContainer
          ref={popup}
          fillWidth={fillWidth}
          $offset={popupState.offset}
          topOffset={topOffset}
          zIndex={zIndex}
          transforms={getTransforms(placement, isRTL)}
        >
          {renderContents
            ? renderContents({ propagateDimensionChange: positionPopup })
            : children}
        </PopupContainer>,
        document.body
      )
    : null;
}

Popup.propTypes = {
  isRTL: PropTypes.bool,
  anchor: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  dock: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  children: PropTypes.node,
  renderContents: PropTypes.func,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  spacing: PropTypes.object,
  isOpen: PropTypes.bool,
  fillWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  refCallback: PropTypes.func,
  topOffset: PropTypes.number,
  zIndex: PropTypes.number,
  ignoreMaxOffsetY: PropTypes.bool,
  resetXOffset: PropTypes.bool,
};

export { Popup, PLACEMENT };
