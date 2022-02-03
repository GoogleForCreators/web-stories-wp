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
  useCallback,
  useState,
  useRef,
  useResizeEffect,
  createPortal,
  useEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { noop } from '../../utils';
import { getTransforms, getOffset } from './utils';
import { PLACEMENT } from './constants';

const DEFAULT_POPUP_Z_INDEX = 11;

const Container = styled.div.attrs(
  ({
    $offset: { x, y, width, height },
    fillWidth,
    fillHeight,
    placement,
    isRTL,
    zIndex,
    invisible,
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
  overflow-y: auto;
  max-height: ${({ topOffset }) => `calc(100vh - ${topOffset}px)`};
`;

/**
 *
 * @param {Object} args Named arguments
 * @param {Object} args.anchor Required, Ref that controls the position of Popup.
 * @param {Object} args.dock Optional, Ref that controls optional additional positioning of Popup.
 * @param {Node} args.children Rendered contents of Popup.
 * @param {Object} args.renderContents Optional, replacement to rendered contents of Popup.
 * @param {string} args.placement Optional, decides direction of popup, overridden when space doesn't permit designated value. Defaults to bottom.
 * @param {number} args.zIndex Optional, ability to override z index for special cases.
 * @param {Object} args.spacing Optional, spacing override for Popup positioning.
 * @param {boolean} args.isOpen When true, Popup renders.
 * @param {boolean} args.fillWidth Optional, sets a width for Popup to take or tells it to take up a designated container's full width.
 * @param {boolean} args.fillHeight Optional, sets a height for Popup to take or tells it to take up a designated container's full height.
 * @param {Function} args.onPositionUpdate Optional, override for triggering update when position changes.
 * @param {Function} args.refCallback Optional, override for cases where popup contents and position change (totally new popup) to prevent stale content.
 * @param {boolean} args.invisible Optional, allows popups to build on each other for edge cases.
 * @param {boolean} args.isRTL Optional, tells Popup which y coordinates to take to keep perspective.
 * @param {number} args.topOffset Optional, tells offset values where the true end of available space is in CMS that have their own forced heading we can't control.
 * @return
 */
function Popup({
  anchor,
  dock,
  children,
  renderContents,
  placement = PLACEMENT.BOTTOM,
  zIndex = DEFAULT_POPUP_Z_INDEX,
  spacing,
  invisible,
  isOpen,
  fillWidth = false,
  fillHeight = false,
  onPositionUpdate = noop,
  refCallback = noop,
  isRTL,
  topOffset = 0,
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
      if (!isMounted.current) {
        return;
      }

      // If scrolling within the popup, ignore.
      if (evt?.target?.nodeType && popup.current?.contains(evt.target)) {
        return;
      }

      setPopupState({
        offset: anchor?.current
          ? getOffset(placement, spacing, anchor, dock, popup, isRTL, topOffset)
          : {},
        height: popup.current?.getBoundingClientRect()?.height,
      });
    },
    [anchor, dock, placement, spacing, isRTL, topOffset]
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
      return () => {};
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
          zIndex={zIndex}
          $offset={popupState.offset}
          isRTL={isRTL}
          topOffset={topOffset}
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
  invisible: PropTypes.bool,
  isRTL: PropTypes.bool,
  topOffset: PropTypes.number,
};

export { Popup, PLACEMENT };
