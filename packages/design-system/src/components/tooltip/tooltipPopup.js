/*
 * Copyright 2022 Google LLC
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
import { getTransforms, getOffset } from '../popup/utils';
import { PLACEMENT, PopupContainer } from '../popup/constants';
const DEFAULT_POPUP_Z_INDEX = 2;

function TooltipPopup({
  isRTL,
  anchor,
  children,
  placement = PLACEMENT.BOTTOM,
  spacing,
  isOpen,
  onPositionUpdate = noop,
  zIndex = DEFAULT_POPUP_Z_INDEX,
  noOverFlow = false,
  ignoreMaxOffsetY,
  resetXOffset = false,
  leftOffset,
}) {
  const [popupState, setPopupState] = useState(null);
  const isMounted = useRef(false);
  const popup = useRef(null);

  const positionPopup = useCallback(() => {
    if (!isMounted.current || !anchor?.current) {
      return;
    }

    setPopupState({
      offset: anchor.current
        ? getOffset({
            placement,
            spacing,
            anchor,
            popup,
            isRTL,
            ignoreMaxOffsetY,
            resetXOffset,
            leftOffset,
          })
        : {},
    });
  }, [
    anchor,
    placement,
    spacing,
    isRTL,
    ignoreMaxOffsetY,
    resetXOffset,
    leftOffset,
  ]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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
  }, [popupState, onPositionUpdate]);

  useResizeEffect({ current: document.body }, positionPopup, [positionPopup]);

  return popupState && isOpen
    ? createPortal(
        <PopupContainer
          ref={popup}
          $offset={popupState.offset}
          noOverFlow={noOverFlow}
          zIndex={zIndex}
          transforms={getTransforms(placement, isRTL)}
        >
          {children}
        </PopupContainer>,
        document.body
      )
    : null;
}

TooltipPopup.propTypes = {
  isRTL: PropTypes.bool,
  anchor: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
  children: PropTypes.node,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  spacing: PropTypes.object,
  isOpen: PropTypes.bool,
  onPositionUpdate: PropTypes.func,
  zIndex: PropTypes.number,
  noOverFlow: PropTypes.bool,
  ignoreMaxOffsetY: PropTypes.bool,
  resetXOffset: PropTypes.bool,
};

export default TooltipPopup;
