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
} from '@web-stories-wp/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../theme';
import { noop } from '../../utils';
import { getTransforms, getOffset } from './utils';
import { PLACEMENT } from './constants';

// TODO scrollbar update, commented out until design updates are done
const DEFAULT_POPUP_Z_INDEX = 11;

const Container = styled.div.attrs(
  ({
    $offset: { x, y, width, height },
    fillWidth,
    fillHeight,
    placement,
    zIndex,
  }) => ({
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

  ${themeHelpers.scrollbarCSS};
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
  onPositionUpdate = noop,
  refCallback = noop,
}) {
  const [popupState, setPopupState] = useState(null);
  const [mounted, setMounted] = useState(false);
  const popup = useRef(null);

  const positionPopup = useCallback(
    async (evt) => {
      if (!mounted) {
        return;
      }

      // If scrolling within the popup, ignore.
      if (evt?.target?.nodeType && popup.current?.contains(evt.target)) {
        return;
      }

      await setPopupState({
        offset:
          anchor?.current && getOffset(placement, spacing, anchor, dock, popup),
      });
    },
    [anchor, dock, placement, spacing, mounted]
  );

  useLayoutEffect(() => {
    if (!isOpen) {
      return () => {};
    }
    setMounted(true);
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
          zIndex={zIndex}
          $offset={popupState.offset}
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
