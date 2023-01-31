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
  useState,
  useRef,
  useMemo,
  useCallback,
  useDebouncedCallback,
  useEffect,
  useLayoutEffect,
  useResizeEffect,
  createPortal,
} from '@googleforcreators/react';
import type {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  RefObject,
} from 'react';

/**
 * Internal dependencies
 */
import type { StyleOverride } from '../../types/theme';
import { TextSize } from '../../theme';
import { noop } from '../../utils';
import { usePopup } from '../../contexts';
import { Placement } from '../popup';
import type { Offset } from '../popup/types';
import { prettifyShortcut } from '../keyboard';
import { Text } from '../typography';
import { PopupContainer } from '../popup/constants';
import { getOffset, getTransforms } from '../popup/utils';
import { SvgForTail, Tail, SVG_TOOLTIP_TAIL_ID, TAIL_HEIGHT } from './tail';

const SPACE_BETWEEN_TOOLTIP_AND_ELEMENT = TAIL_HEIGHT;
// For how many milliseconds is a delayed tooltip waiting to appear?
const DELAY_MS = 1000;
// For how many milliseconds will triggering another delayed tooltip show instantly?
const REPEAT_DELAYED_MS = 500;
// To account for the wp-admin sidenav
const DEFAULT_LEFT_OFFSET = 0;

const DEFAULT_POPUP_Z_INDEX = 2;

const Wrapper = styled.div`
  position: relative;
`;

const TooltipContainer = styled.div<{
  shown?: boolean;
  zIndex: number;
  styleOverride?: StyleOverride;
}>`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: row;
  max-width: 14em;
  transition: 0.4s opacity;
  opacity: ${({ shown }) => (shown ? 1 : 0)};
  pointer-events: ${({ shown }) => (shown ? 'all' : 'none')};
  z-index: ${({ zIndex }) => zIndex};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inverted.bg.primary};

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

  ${({ styleOverride }) => styleOverride}
`;

const TooltipText = styled(Text.Paragraph)`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  padding: 10px;
`;

const getBoundingBoxCenter = ({ x, width }: DOMRect) => x + width / 2;

let lastVisibleDelayedTooltip = 0;

interface TooltipProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  shortcut?: string;
  hasTail?: boolean;
  placement?: Placement;
  isDelayed?: boolean;
  forceAnchorRef?: RefObject<HTMLElement>;
  popupZIndexOverride?: number;
  styleOverride?: StyleOverride;
}

function Tooltip({
  title,
  shortcut = '',
  hasTail = false,
  placement = Placement.Bottom,
  children,
  onFocus = noop,
  onBlur = noop,
  isDelayed = false,
  forceAnchorRef, // needed for WithLink so that the url tooltip hovers over the element, and isn't anchored
  // to the whole canvas
  className,
  popupZIndexOverride,
  styleOverride,
  ...props
}: PropsWithChildren<TooltipProps>) {
  const { leftOffset = DEFAULT_LEFT_OFFSET, isRTL } = usePopup();
  const [shown, setShown] = useState(false);
  const [arrowDelta, setArrowDelta] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const placementRef = useRef(placement);
  const [dynamicPlacement, setDynamicPlacement] = useState(placement);
  const isMounted = useRef(false);

  const [popupState, setPopupState] = useState<{ offset?: Offset }>({});
  const isPopupMounted = useRef(false);
  const popup = useRef<HTMLDivElement>(null);
  const isOpen = Boolean(shown && (shortcut || title));

  const [dynamicOffset, setDynamicOffset] = useState<{ x?: number }>({});

  const spacing = useMemo(
    () => ({
      x:
        placement.startsWith('left') || placement.startsWith('right')
          ? SPACE_BETWEEN_TOOLTIP_AND_ELEMENT
          : 0,
      y:
        placement.startsWith('top') || placement.startsWith('bottom')
          ? SPACE_BETWEEN_TOOLTIP_AND_ELEMENT
          : 0,
    }),
    [placement]
  );

  const getAnchor = useCallback(
    () => forceAnchorRef || anchorRef,
    [forceAnchorRef]
  );

  const positionPopup = useCallback(() => {
    if (!isPopupMounted.current || !anchorRef?.current) {
      return;
    }
    setPopupState({
      offset: anchorRef.current
        ? getOffset({
            placement: dynamicPlacement,
            spacing,
            anchor: getAnchor(),
            popup,
            isRTL,
            ignoreMaxOffsetY: true,
          })
        : undefined,
    });
  }, [dynamicPlacement, spacing, getAnchor, isRTL]);

  // When near the edge of the viewport we want to force the tooltip to a new placement as to not
  // cutoff the contents of the tooltip.
  const positionPlacement = useCallback(
    ({ offset }: { offset?: Offset }, { left, right, height }: DOMRect) => {
      if (!offset) {
        return;
      }
      //  In order to check if there's an overlap with the window's bottom edge we need the overall height of the tooltip
      //  from the anchor's y position along with the amount of space between the anchor and the tooltip content.
      const neededVerticalSpace =
        offset.y + height + SPACE_BETWEEN_TOOLTIP_AND_ELEMENT;
      const shouldMoveToTop =
        dynamicPlacement.startsWith('bottom') &&
        neededVerticalSpace >= window.innerHeight;
      // We can sometimes render a tooltip too far to the left, ie. in RTL mode, or with the wp-admin sidenav.
      // When that is the case, let's update the offset.
      const isOverFlowingLeft = Math.trunc(left) < (isRTL ? 0 : leftOffset);
      // The getOffset util has a maxOffset that prevents the tooltip from being render too far to the right. However, when
      // in RTL we can sometimes run into the wp-admin sidenav.
      const isOverFlowingRight =
        isRTL && Math.trunc(right) > offset.bodyRight - leftOffset;

      if (shouldMoveToTop) {
        if (dynamicPlacement.endsWith('-start')) {
          setDynamicPlacement(Placement.TopStart);
        } else if (dynamicPlacement.endsWith('-end')) {
          setDynamicPlacement(Placement.TopEnd);
        } else {
          setDynamicPlacement(Placement.Top);
        }
      } else if (isOverFlowingLeft) {
        setDynamicOffset({
          x: (isRTL ? 0 : leftOffset) - left,
        });
      } else if (isOverFlowingRight) {
        setDynamicOffset({
          x: offset.bodyRight - right - leftOffset,
        });
      }
    },
    [dynamicPlacement, isRTL, leftOffset]
  );

  const positionArrow = useCallback(() => {
    const anchor = getAnchor();
    const anchorElBoundingBox = anchor.current?.getBoundingClientRect();
    const tooltipElBoundingBox = tooltipRef.current?.getBoundingClientRect();
    if (!tooltipElBoundingBox || !anchorElBoundingBox) {
      return;
    }
    positionPlacement(popupState, tooltipElBoundingBox);

    const delta =
      getBoundingBoxCenter(anchorElBoundingBox) -
      getBoundingBoxCenter(tooltipElBoundingBox);

    setArrowDelta(delta);
  }, [positionPlacement, popupState, getAnchor]);

  const resetPlacement = useDebouncedCallback(() => {
    setDynamicPlacement(placementRef.current);
  }, 100);
  const delay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onHover = useCallback(() => {
    const handle = () => {
      if (!isMounted.current) {
        return;
      }

      setShown(true);
    };

    if (isDelayed) {
      const now = performance.now();
      if (now - lastVisibleDelayedTooltip < REPEAT_DELAYED_MS) {
        // Show instantly
        handle();
      }
      if (delay.current) {
        clearTimeout(delay.current);
      }
      // Invoke in DELAY_MS
      delay.current = setTimeout(handle, DELAY_MS);
    } else {
      handle();
    }
  }, [isDelayed]);
  const onHoverOut = useCallback(() => {
    setShown(false);
    resetPlacement();
    if (isDelayed && delay.current) {
      clearTimeout(delay.current);
      if (shown) {
        lastVisibleDelayedTooltip = performance.now();
      }
    }
  }, [resetPlacement, isDelayed, shown]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    isPopupMounted.current = true;

    return () => {
      isPopupMounted.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    isPopupMounted.current = true;

    positionPopup();
    // Adjust the position when scrolling.
    document.addEventListener('scroll', positionPopup, true);
    return () => {
      document.removeEventListener('scroll', positionPopup, true);
      isPopupMounted.current = false;
    };
  }, [isOpen, positionPopup]);

  useLayoutEffect(() => {
    if (!isPopupMounted.current) {
      return;
    }

    positionArrow();
  }, [positionArrow]);

  useResizeEffect({ current: document.body }, positionPopup, [positionPopup]);

  return (
    <>
      <Wrapper
        onPointerEnter={onHover}
        onPointerLeave={onHoverOut}
        onFocus={(e) => {
          setShown(true);
          onFocus(e);
        }}
        onBlur={(e) => {
          setShown(false);
          onBlur(e);
          resetPlacement();
        }}
        ref={anchorRef}
        {...props}
      >
        {children}
      </Wrapper>

      {popupState?.offset && isOpen
        ? createPortal(
            <PopupContainer
              ref={popup}
              $offset={
                dynamicOffset
                  ? {
                      ...popupState.offset,
                      x: (popupState.offset?.x || 0) + (dynamicOffset?.x || 0),
                    }
                  : popupState.offset
              }
              noOverFlow
              zIndex={popupZIndexOverride || DEFAULT_POPUP_Z_INDEX}
              transforms={getTransforms(dynamicPlacement, isRTL)}
            >
              <TooltipContainer
                className={className}
                ref={tooltipRef}
                shown={shown}
                zIndex={popupZIndexOverride || DEFAULT_POPUP_Z_INDEX}
                styleOverride={styleOverride}
              >
                <TooltipText size={TextSize.XSmall}>
                  {shortcut
                    ? `${title} (${prettifyShortcut(shortcut)})`
                    : title}
                </TooltipText>
                {hasTail && (
                  <>
                    <SvgForTail>
                      <clipPath
                        id={SVG_TOOLTIP_TAIL_ID}
                        clipPathUnits="objectBoundingBox"
                      >
                        <path d="M1,1 L0.868,1 C0.792,1,0.72,0.853,0.676,0.606 L0.585,0.098 C0.562,-0.033,0.513,-0.033,0.489,0.098 L0.399,0.606 C0.355,0.853,0.283,1,0.207,1 L0,1 L1,1" />
                      </clipPath>
                    </SvgForTail>
                    <Tail
                      placement={dynamicPlacement}
                      translateX={-(dynamicOffset?.x || 0) || arrowDelta}
                      isRTL={isRTL}
                    />
                  </>
                )}
              </TooltipContainer>
            </PopupContainer>,
            document.body
          )
        : null}
    </>
  );
}

export default Tooltip;
