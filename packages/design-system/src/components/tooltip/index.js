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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  useState,
  useRef,
  useMemo,
  useCallback,
  useDebouncedCallback,
  useEffect,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { Popup, PLACEMENT } from '../popup';
import { prettifyShortcut } from '../keyboard';
import { THEME_CONSTANTS } from '../../theme';
import { Text } from '../typography';
import { RTL_PLACEMENT } from '../popup/constants';
import { noop } from '../../utils';
import { SvgForTail, Tail, SVG_TOOLTIP_TAIL_ID, TAIL_HEIGHT } from './tail';

const SPACE_BETWEEN_TOOLTIP_AND_ELEMENT = TAIL_HEIGHT;
// For how many milliseconds is a delayed tooltip waiting to appear?
const DELAY_MS = 1000;
// For how many milliseconds will triggering another delayed tooltip show instantly?
const REPEAT_DELAYED_MS = 500;

const Wrapper = styled.div`
  position: relative;
`;

const TooltipContainer = styled.div`
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
  z-index: 9999;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inverted.bg.primary};

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const TooltipText = styled(Text)`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  padding: 10px;
`;

const getBoundingBoxCenter = ({ x, width }) => x + width / 2;

let lastVisibleDelayedTooltip = null;

/**
 *
 * @param {Object} props The props
 * @param {import('react').Node} props.children The children to be rendered
 * @param {import('react').RefObject<HTMLElement>} props.forceAnchorRef The ref of the anchor where the tooltip will be shown [optional]
 * @param {boolean} props.hasTail Should the tooltip show a tail
 * @param {boolean} props.isMirrored Should the tail placement be mirrored over the y-axis (for Right-to-Left)
 * @param {Function} props.onBlur Blur event callback function
 * @param {Function} props.onFocus Focus event callback function
 * @param {Function} props.onPointerEnter Pointer enter event callback function
 * @param {Function} props.onPointerLeave Pointer leave event callback function
 * @param {string} props.placement Where to place the tooltip {@link: PLACEMENT}
 * @param {string} props.shortcut Shortcut text to display in tooltip
 * @param {import('react').ReactNode|string|null} props.title Text to display in tooltip
 * @param {Object} props.tooltipProps Props for <Tooltip /> component
 * @param {string} props.className Classname.
 * @param {string} props.isDelayed If this tooltip is to be displayed instantly on hover (default) or by a short delay.
 * @param {number} props.popupZIndexOverride If present, passes an override for z-index to popup
 * @param {boolean} props.ignoreMaxOffsetY  Defaults to false. Sometimes, we want the popup to respect the y value
 * as perceived by the page because of scroll. This is really only true of dropDowns that
 * exist beyond the initial page scroll. Because the editor is a fixed view this only
 * comes up in peripheral pages (dashboard, settings).
 * @return {import('react').Component} Tooltip element
 */
function Tooltip({
  title,
  shortcut,
  hasTail,
  placement = PLACEMENT.BOTTOM,
  children,
  onPointerEnter = noop,
  onPointerLeave = noop,
  onFocus = noop,
  onBlur = noop,
  isDelayed = false,
  forceAnchorRef = null,
  tooltipProps = null,
  className = null,
  popupZIndexOverride,
  ignoreMaxOffsetY = false,
  ...props
}) {
  const [shown, setShown] = useState(false);
  const [arrowDelta, setArrowDelta] = useState(null);
  const anchorRef = useRef(null);
  const tooltipRef = useRef(null);
  const placementRef = useRef(placement);
  const [dynamicPlacement, setDynamicPlacement] = useState(placement);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

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
  // We can sometimes render a tooltip too far to the left, ie. in RTL mode.
  // when that is the case, we can switch to placement-start and the tooltip will no longer get cutoff.
  const updatePlacement = useCallback(() => {
    const currentPlacement = placementRef.current;
    switch (currentPlacement) {
      case PLACEMENT.BOTTOM_START:
      case PLACEMENT.TOP_START:
      case PLACEMENT.RIGHT_START:
        // {placement}-START shouldn't ever appear in overflow so do nothing
        break;
      case PLACEMENT.BOTTOM_END:
      case PLACEMENT.TOP_END:
      case PLACEMENT.RIGHT_END:
        setDynamicPlacement(currentPlacement.replace('-end', '-start'));
        break;
      case PLACEMENT.LEFT_END:
        setDynamicPlacement(PLACEMENT.RIGHT_END);
        break;
      case PLACEMENT.LEFT_START:
        setDynamicPlacement(PLACEMENT.RIGHT_START);
        break;
      case PLACEMENT.LEFT:
        setDynamicPlacement(PLACEMENT.RIGHT);
        break;
      default:
        setDynamicPlacement(`${currentPlacement}-start`);
        break;
    }
  }, []);

  // When near the edge of the viewport we want to force the tooltip to a new placement as to not
  // cutoff the contents of the tooltip.
  const positionPlacement = useCallback(
    ({ offset }) => {
      //  In order to check if there's an overlap with the window's bottom edge we need the overall height of the tooltip
      //  from the anchor's y position along with the amount of space between the anchor and the tooltip content.
      const neededVerticalSpace =
        offset.y + offset.popupHeight + SPACE_BETWEEN_TOOLTIP_AND_ELEMENT;
      const shouldMoveToTop =
        dynamicPlacement.startsWith('bottom') &&
        neededVerticalSpace >= window.innerHeight;
      // check that the tooltip isn't cutoff on the left edge of the screen.
      // right-cutoff is already taken care of with `getOffset`
      const isOverFlowingLeft = offset.popupLeft < 0;
      if (shouldMoveToTop) {
        if (dynamicPlacement.endsWith('-start')) {
          setDynamicPlacement(PLACEMENT.TOP_START);
        } else if (dynamicPlacement.endsWith('-end')) {
          setDynamicPlacement(PLACEMENT.TOP_END);
        } else {
          setDynamicPlacement(PLACEMENT.TOP);
        }
      } else if (isOverFlowingLeft) {
        updatePlacement();
      }
    },
    [dynamicPlacement, updatePlacement]
  );

  const positionArrow = useCallback(
    (popupDimensions) => {
      const anchorElBoundingBox = anchorRef.current?.getBoundingClientRect();
      const tooltipElBoundingBox = tooltipRef.current?.getBoundingClientRect();
      if (!tooltipElBoundingBox || !anchorElBoundingBox) {
        return;
      }
      positionPlacement(popupDimensions);

      const delta =
        getBoundingBoxCenter(anchorElBoundingBox) -
        getBoundingBoxCenter(tooltipElBoundingBox);

      setArrowDelta(delta);
    },
    [positionPlacement]
  );

  const resetPlacement = useDebouncedCallback(() => {
    setDynamicPlacement(placementRef.current);
  }, 100);

  const delay = useRef();
  const onHover = useCallback(
    (evt) => {
      const handle = () => {
        if (!isMounted.current) {
          return;
        }

        setShown(true);
        onPointerEnter(evt);
      };

      if (isDelayed) {
        const now = performance.now();
        if (now - lastVisibleDelayedTooltip < REPEAT_DELAYED_MS) {
          // Show instantly
          handle();
        }
        clearTimeout(delay.current);
        // Invoke in DELAY_MS
        delay.current = setTimeout(handle, DELAY_MS);
      } else {
        handle();
      }
    },
    [isDelayed, onPointerEnter]
  );
  const onHoverOut = useCallback(
    (evt) => {
      setShown(false);
      onPointerLeave(evt);
      resetPlacement();
      if (isDelayed) {
        clearTimeout(delay.current);
        if (shown) {
          lastVisibleDelayedTooltip = performance.now();
        }
      }
    },
    [onPointerLeave, resetPlacement, isDelayed, shown]
  );

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

      <Popup
        anchor={forceAnchorRef || anchorRef}
        placement={dynamicPlacement}
        spacing={spacing}
        isOpen={Boolean(shown && (shortcut || title))}
        onPositionUpdate={positionArrow}
        zIndex={popupZIndexOverride}
        noOverFlow
        ignoreMaxOffsetY={ignoreMaxOffsetY}
      >
        <TooltipContainer
          className={className}
          ref={tooltipRef}
          placement={dynamicPlacement}
          shown={shown}
          {...tooltipProps}
        >
          <TooltipText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {shortcut ? `${title} (${prettifyShortcut(shortcut)})` : title}
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
              <Tail placement={dynamicPlacement} translateX={arrowDelta} />
            </>
          )}
        </TooltipContainer>
      </Popup>
    </>
  );
}

const TooltipPropTypes = {
  children: PropTypes.node.isRequired,
  hasTail: PropTypes.bool,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onPointerEnter: PropTypes.func,
  onPointerLeave: PropTypes.func,
  shortcut: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  forceAnchorRef: PropTypes.object,
  tooltipProps: PropTypes.object,
  className: PropTypes.string,
  isDelayed: PropTypes.bool,
  popupZIndexOverride: PropTypes.number,
  ignoreMaxOffsetY: PropTypes.bool,
};
Tooltip.propTypes = TooltipPropTypes;

export {
  Tooltip,
  PLACEMENT as TOOLTIP_PLACEMENT,
  RTL_PLACEMENT as TOOLTIP_RTL_PLACEMENT,
  TooltipPropTypes,
};
