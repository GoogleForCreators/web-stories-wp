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
import { usePopup } from '../../contexts';
import { getTransforms, getOffset } from './utils';
import { PLACEMENT, PopupContainer } from './constants';
const DEFAULT_TOP_OFFSET = 0;
const DEFAULT_POPUP_Z_INDEX = 2;
const DEFAULT_LEFT_OFFSET = 0;

function Popup({
  anchor,
  dock,
  children,
  renderContents,
  placement = PLACEMENT.BOTTOM,
  spacing,
  isOpen,
  fillWidth = false,
  refCallback = noop,
  zIndex = DEFAULT_POPUP_Z_INDEX,
  ignoreMaxOffsetY,
}) {
  const {
    topOffset = DEFAULT_TOP_OFFSET,
    leftOffset = DEFAULT_LEFT_OFFSET,
    isRTL = false,
  } = usePopup();

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
      const offset = anchor.current
        ? getOffset({
            placement,
            spacing,
            anchor,
            dock,
            popup,
            isRTL,
            topOffset,
            ignoreMaxOffsetY,
          })
        : {};
      const { height, x, width, right } = popup.current
        ? popup.current.getBoundingClientRect()
        : {};

      const updatedXOffset = () => {
        // When in RTL the popup could render off the left side of the screen. If so, let's update the
        // offset to keep it inbounds.
        if (x < leftOffset) {
          switch (placement) {
            case PLACEMENT.BOTTOM_END:
            case PLACEMENT.TOP_END:
              return { ...offset, x: isRTL ? offset.x : width + leftOffset };
            case PLACEMENT.LEFT_END:
            case PLACEMENT.LEFT:
            case PLACEMENT.LEFT_START:
              // Left placement shouldn't be used if it renders off the left of the screen in LTR
              return {
                ...offset,
                x: isRTL ? offset.x : width + -x - leftOffset,
              };
            case PLACEMENT.BOTTOM_START:
            case PLACEMENT.TOP_START:
            case PLACEMENT.RIGHT_END:
            case PLACEMENT.RIGHT_START:
            case PLACEMENT.RIGHT:
              // These should only matter in the case of isRTL so we'll need the entire width of the popup as the offset
              return { ...offset, x: width };
            default:
              return { ...offset, x: width / 2 + (isRTL ? 0 : leftOffset) };
          }
        }

        if (isRTL && right > offset.bodyRight - leftOffset) {
          // maxOffset should keep us inbounds, except in the case of RTL due to the admin-sidebar nav we could use another
          // switch case here to make offset more precise, however the math below will always return the popup fully in screen.
          return { ...offset, x: offset.bodyRight - width - leftOffset };
        }

        return null;
      };
      setPopupState({
        offset: updatedXOffset() || offset,
        height,
      });
    },
    [
      anchor,
      placement,
      spacing,
      dock,
      isRTL,
      topOffset,
      leftOffset,
      ignoreMaxOffsetY,
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
  zIndex: PropTypes.number,
  ignoreMaxOffsetY: PropTypes.bool,
};

export { Popup, PLACEMENT };
