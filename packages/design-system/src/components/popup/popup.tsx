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
import type { PropsWithChildren, RefObject } from 'react';

/**
 * Internal dependencies
 */
import { noop } from '../../utils';
import { usePopup } from '../../contexts';
import { getTransforms, getOffset } from './utils';
import { Placement, PopupContainer } from './constants';
import type { Offset, Spacing } from './types';
import { EMPTY_OFFSET } from './utils/getOffset';

const DEFAULT_TOP_OFFSET = 0;
const DEFAULT_POPUP_Z_INDEX = 2;
const DEFAULT_LEFT_OFFSET = 0;

interface PopupProps {
  anchor: RefObject<Element>;
  dock?: RefObject<Element>;
  renderContents?: (props: { propagateDimensionChange: () => void }) => void;
  placement?: Placement;
  spacing?: Spacing;
  isOpen?: boolean;
  fillWidth?: number | boolean;
  refCallback?: (ref: RefObject<Element>) => void;
  zIndex?: number;
  ignoreMaxOffsetY?: boolean;
  offsetOverride?: boolean;
  maxWidth?: number;
}

function Popup({
  anchor,
  dock,
  children,
  renderContents,
  placement = Placement.Bottom,
  spacing,
  isOpen,
  fillWidth = false,
  refCallback = noop,
  zIndex = DEFAULT_POPUP_Z_INDEX,
  ignoreMaxOffsetY,
  offsetOverride = false,
  maxWidth,
}: PropsWithChildren<PopupProps>) {
  const {
    topOffset = DEFAULT_TOP_OFFSET,
    leftOffset = DEFAULT_LEFT_OFFSET,
    isRTL = false,
  } = usePopup();

  const [popupState, setPopupState] = useState<{
    offset: Offset;
    height: number;
  } | null>(null);
  const isMounted = useRef(false);
  const popup = useRef<HTMLDivElement | null>(null);

  const positionPopup = useCallback(
    (evt?: unknown) => {
      if (!isMounted.current || !anchor?.current) {
        return;
      }
      // If scrolling within the popup, ignore.
      if (
        evt instanceof Event &&
        evt.target instanceof Element &&
        popup.current?.contains(evt.target)
      ) {
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
            offsetOverride,
          })
        : EMPTY_OFFSET;
      const {
        height = 0,
        x = 0,
        width = 0,
        right = 0,
      } = popup.current?.getBoundingClientRect() || {};

      const updatedXOffset = (): Offset | null => {
        // When in RTL the popup could render off the left side of the screen. If so, let's update the
        // offset to keep it inbounds.
        if (x <= leftOffset) {
          switch (placement) {
            case Placement.BottomEnd:
            case Placement.TopEnd:
              return { ...offset, x: isRTL ? offset.x : width + leftOffset };
            case Placement.LeftEnd:
            case Placement.Left:
            case Placement.LeftStart:
              // Left placement shouldn't be used if it renders off the left of the screen in LTR
              return {
                ...offset,
                x: isRTL ? offset.x : width + -x - leftOffset,
              };
            case Placement.BottomStart:
            case Placement.TopStart:
            case Placement.RightEnd:
            case Placement.RightStart:
            case Placement.Right:
              // These should only matter in the case of isRTL so we'll need the entire width of the popup as the offset
              return { ...offset, x: width };
            default:
              return { ...offset, x: width / 2 + (isRTL ? 0 : leftOffset) };
          }
        }

        if (isRTL && right >= offset.bodyRight - leftOffset) {
          // maxOffset should keep us inbounds, except in the case of RTL due to the admin-sidebar nav we could use another
          // switch case here to make offset more precise, however the math below will always return the popup fully in screen.
          return { ...offset, x: offset.bodyRight - width - leftOffset };
        }

        return EMPTY_OFFSET;
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
      offsetOverride,
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
  if (!popupState || !isOpen) {
    return null;
  }

  const portal = createPortal(
    <PopupContainer
      ref={popup}
      fillWidth={Boolean(fillWidth)}
      maxWidth={maxWidth}
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
  );
  return portal;
}

export default Popup;
