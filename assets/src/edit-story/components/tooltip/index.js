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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { useState, useRef, useMemo, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { prettifyShortcut } from '../../../design-system';
import Popup, { Placement } from '../popup';

const SPACING = 12;
const PADDING = 4;

const Wrapper = styled.div`
  position: relative;
`;

const Tooltip = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.DEPRECATED_THEME.colors.bg.black};
    color: ${theme.DEPRECATED_THEME.colors.fg.white};
    font-family: ${theme.DEPRECATED_THEME.fonts.tab.family};
    font-size: ${theme.DEPRECATED_THEME.fonts.tab.size};
    line-height: ${theme.DEPRECATED_THEME.fonts.tab.lineHeight};
    letter-spacing: ${theme.DEPRECATED_THEME.fonts.tab.letterSpacing};
    box-shadow: 0px 6px 10px
      ${rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.1)};
  `}
  padding: ${PADDING}px ${PADDING * 2}px;
  border-radius: 6px;
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
`;

const TRANSPARENT_BORDER = `6px solid transparent`;

const TooltipArrow = styled.div`
  position: absolute;
  box-shadow: 0px 6px 10px
    ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.1)};
  ${({ placement, theme, translateX }) => {
    switch (placement) {
      case Placement.TOP:
      case Placement.TOP_START:
      case Placement.TOP_END:
        return css`
          bottom: -6px;
          border-top: 6px solid ${theme.DEPRECATED_THEME.colors.bg.black};
          border-left: ${TRANSPARENT_BORDER};
          border-right: ${TRANSPARENT_BORDER};
          transform: translateX(${translateX}px);
        `;
      case Placement.BOTTOM:
      case Placement.BOTTOM_START:
      case Placement.BOTTOM_END:
        return css`
          top: -6px;
          border-bottom: 6px solid ${theme.DEPRECATED_THEME.colors.bg.black};
          border-left: ${TRANSPARENT_BORDER};
          border-right: ${TRANSPARENT_BORDER};
          transform: translateX(${translateX}px);
        `;
      case Placement.LEFT:
      case Placement.LEFT_START:
      case Placement.LEFT_END:
        return css`
          right: -6px;
          border-top: ${TRANSPARENT_BORDER};
          border-bottom: ${TRANSPARENT_BORDER};
          border-left: 6px solid ${theme.DEPRECATED_THEME.colors.bg.black};
        `;
      case Placement.RIGHT:
      case Placement.RIGHT_START:
      case Placement.RIGHT_END:
        return css`
          left: -6px;
          border-top: ${TRANSPARENT_BORDER};
          border-bottom: ${TRANSPARENT_BORDER};
          border-right: 6px solid ${theme.DEPRECATED_THEME.colors.bg.black};
        `;
      default:
        return ``;
    }
  }}
`;

const getBoundingBoxCenter = ({ x, width }) => x + width / 2;

function WithTooltip({
  title,
  shortcut,
  arrow = true,
  placement = 'bottom',
  children,
  onPointerEnter = () => {},
  onPointerLeave = () => {},
  onFocus = () => {},
  onBlur = () => {},
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
          ? SPACING
          : 0,
      y:
        placement.startsWith('top') || placement.startsWith('bottom')
          ? SPACING
          : 0,
    }),
    [placement]
  );

  const postionArrow = useCallback(() => {
    const anchorElBoundingBox = anchorRef.current?.getBoundingClientRect();
    const tooltipElBoundingBox = tooltipRef.current?.getBoundingClientRect();
    if (!tooltipElBoundingBox || !anchorElBoundingBox) {
      return;
    }
    const delta =
      getBoundingBoxCenter(anchorElBoundingBox) -
      getBoundingBoxCenter(tooltipElBoundingBox);

    setArrowDelta(delta);
  }, []);

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
        anchor={anchorRef}
        placement={placement}
        spacing={spacing}
        isOpen={Boolean(shown && (shortcut || title))}
        onPositionUpdate={postionArrow}
      >
        <Tooltip
          ref={tooltipRef}
          arrow={arrow}
          placement={placement}
          shown={shown}
        >
          {shortcut ? `${title} (${prettifyShortcut(shortcut)})` : title}
          <TooltipArrow placement={placement} translateX={arrowDelta} />
        </Tooltip>
      </Popup>
    </>
  );
}

WithTooltip.propTypes = {
  title: PropTypes.string,
  shortcut: PropTypes.string,
  arrow: PropTypes.bool,
  placement: PropTypes.string,
  onPointerEnter: PropTypes.func,
  onPointerLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  children: PropTypes.node,
};

export default WithTooltip;
