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
import { getOffset } from './utils';
import { PLACEMENT, PopupContainer } from './constants';
const DEFAULT_TOPOFFSET = 0;
const DEFAULT_POPUP_Z_INDEX = 2;

function Popup({
  isRTL = false,
  anchor,
  placement = PLACEMENT.BOTTOM,
  spacing,
  isOpen,
  children,
  zIndex = DEFAULT_POPUP_Z_INDEX,
  // the above are used by all implementations

  //color input, style presets
  dock,

  //data list, color input, text style, style presets, publish time,
  renderContents,

  // color input
  // invisible = false, removed! -- If we leave color input as is, using this we will need to keep it.

  //data list, dropdown, search,
  fillWidth = false,

  // none
  // fillHeight = false, removed!

  // dropdown and color input
  // refCallback = noop, removed!  -- If we leave color input as is, using this we will need to keep it.

  //PlayPauseButton - all direct popup uses, style text, canvas elements, publish time, etc -
  topOffset = DEFAULT_TOPOFFSET,

  // dropdown and one tooltip - used in dashboard due to the document.body getting set to a weird height.
  // ignoreMaxOffsetY, removed!

  //tooltip only
  // noOverFlow, - removed!

  // color input - docking or floating ??? mainly needed because we are getting weird x values in the
  // layer panel popup which has tooltip inside.
  // resetXOffset = false, removed!  -- If we leave color input as is, using this we will need to keep it. Or just fix that layers panel issue

  // tooltip only
  //  onPositionUpdate = noop, removed!
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
            })
          : {},
        height: popup.current?.getBoundingClientRect()?.height,
      });
    },
    [anchor, placement, spacing, dock, isRTL, topOffset]
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

  useResizeEffect({ current: document.body }, positionPopup, [positionPopup]);
  return popupState && isOpen
    ? createPortal(
        <PopupContainer
          ref={popup}
          fillWidth={fillWidth}
          placement={placement}
          $offset={popupState.offset}
          topOffset={topOffset}
          isRTL={isRTL}
          zIndex={zIndex}
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
