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
import React, { useState, useRef, useMemo, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { Popup, PLACEMENT } from '../popup';
import { prettifyShortcut } from '../keyboard';
import { THEME_CONSTANTS } from '../../theme';
import { Text } from '../typography';
import { RTL_PLACEMENT } from '../popup/constants';
import { SvgForTail, Tail, SVG_TOOLTIP_TAIL_ID } from './tail';

const SPACE_BETWEEN_TOOLTIP_AND_ELEMENT = 8;

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
  max-width: 13em;
  transition: 0.4s opacity;
  opacity: ${({ shown }) => (shown ? 1 : 0)};
  pointer-events: ${({ shown }) => (shown ? 'all' : 'none')};
  z-index: 9999;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.inverted.bg.primary};
`;

const TooltipText = styled(Text)`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  padding: 10px;
`;

const getBoundingBoxCenter = ({ x, width }) => x + width / 2;

/**
 *
 * @param {Object} props The props
 * @param {React.Node} props.children The children to be rendered
 * @param {React.RefObject<HTMLElement>} props.forceAnchorRef The ref of the anchor where the tooltip will be shown [optional]
 * @param {boolean} props.hasTail Should the tooltip show a tail
 * @param {boolean} props.isMirrored Should the tail placement be mirrored over the y-axis (for Right-to-Left)
 * @param {Function} props.onBlur Blur event callback function
 * @param {Function} props.onFocus Focus event callback function
 * @param {Function} props.onPointerEnter Pointer enter event callback function
 * @param {Function} props.onPointerLeave Pointer leave event callback function
 * @param {string} props.placement Where to place the tooltip {@link: PLACEMENT}
 * @param {string} props.shortcut Shortcut text to display in tooltip
 * @param {string} props.title Text to display in tooltip
 * @param {Object} props.tooltipProps Props for <Tooltip /> component
 * @return {React.Component} Tooltip element
 */
function Tooltip({
  title,
  shortcut,
  hasTail,
  placement = PLACEMENT.BOTTOM,
  children,
  isMirrored = false,
  onPointerEnter = () => {},
  onPointerLeave = () => {},
  onFocus = () => {},
  onBlur = () => {},
  forceAnchorRef = null,
  tooltipProps = null,
  ...props
}) {
  const [shown, setShown] = useState(false);
  const [arrowDelta, setArrowDelta] = useState(null);
  const anchorRef = useRef(null);
  const tooltipRef = useRef(null);

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

  const positionArrow = useCallback(() => {
    const anchorElBoundingBox = anchorRef.current?.getBoundingClientRect();
    const tooltipElBoundingBox = tooltipRef.current?.getBoundingClientRect();
    if (!tooltipElBoundingBox || !anchorElBoundingBox) {
      return;
    }
    const delta =
      getBoundingBoxCenter(anchorElBoundingBox) -
      getBoundingBoxCenter(tooltipElBoundingBox);

    setArrowDelta((isMirrored ? -1 : 1) * delta);
  }, [isMirrored]);

  return (
    <>
      <Wrapper
        onPointerEnter={(e) => {
          setShown(true);
          onPointerEnter(e);
        }}
        onPointerLeave={(e) => {
          setShown(false);
          onPointerLeave(e);
        }}
        onFocus={(e) => {
          setShown(true);
          onFocus(e);
        }}
        onBlur={(e) => {
          setShown(false);
          onBlur(e);
        }}
        ref={anchorRef}
        {...props}
      >
        {children}
      </Wrapper>

      <Popup
        anchor={forceAnchorRef || anchorRef}
        placement={placement}
        spacing={spacing}
        isOpen={Boolean(shown && (shortcut || title))}
        onPositionUpdate={positionArrow}
      >
        <TooltipContainer
          ref={tooltipRef}
          placement={placement}
          shown={shown}
          {...tooltipProps}
        >
          <TooltipText
            forwardedAs="span"
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
          >
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
              <Tail placement={placement} translateX={arrowDelta} />
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
  isMirrored: PropTypes.bool,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onPointerEnter: PropTypes.func,
  onPointerLeave: PropTypes.func,
  shortcut: PropTypes.string,
  title: PropTypes.string,
  forceAnchorRef: PropTypes.object,
  tooltipProps: PropTypes.object,
};
Tooltip.propTypes = TooltipPropTypes;

export {
  Tooltip,
  PLACEMENT as TOOLTIP_PLACEMENT,
  RTL_PLACEMENT as TOOLTIP_RTL_PLACEMENT,
  TooltipPropTypes,
};
