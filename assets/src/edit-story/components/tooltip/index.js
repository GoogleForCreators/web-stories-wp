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
import { rgba } from 'polished';
import { useState, useRef, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { prettifyShortcut } from '../keyboard';
import Popup, { Placement } from '../popup';

const SPACING = 12;
const PADDING = 4;

const Wrapper = styled.div`
  position: relative;
`;

const Tooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.black};
  color: ${({ theme }) => theme.colors.fg.white};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: 12px;
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  padding: ${PADDING}px ${PADDING * 2}px;
  border-radius: 6px;
  box-shadow: 0px 6px 10px ${({ theme }) => rgba(theme.colors.bg.black, 0.1)};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  white-space: nowrap;
  will-change: transform;
  transition: 0.4s opacity;
  opacity: ${({ shown }) => (shown ? 1 : 0)};
  pointer-events: ${({ shown }) => (shown ? 'all' : 'none')};
  z-index: 9999;
`;

const TRANSPARENT_BORDER = `6px solid transparent`;

const TooltipArrow = styled.div`
  position: absolute;
  box-shadow: 0px 6px 10px ${({ theme }) => rgba(theme.colors.bg.black, 0.1)};
  ${({ placement, theme }) => {
    switch (placement) {
      case Placement.TOP:
      case Placement.TOP_START:
      case Placement.TOP_END:
        return `
          bottom: -6px;
          border-top: 6px solid ${theme.colors.bg.black};
          border-left: ${TRANSPARENT_BORDER};
          border-right: ${TRANSPARENT_BORDER};
        `;
      case Placement.BOTTOM:
      case Placement.BOTTOM_START:
      case Placement.BOTTOM_END:
        return `
          top: -6px;
          border-bottom: 6px solid ${theme.colors.bg.black};
          border-left: ${TRANSPARENT_BORDER};
          border-right: ${TRANSPARENT_BORDER};
        `;
      case Placement.LEFT:
      case Placement.LEFT_START:
      case Placement.LEFT_END:
        return `
          right: -6px;
          border-top: ${TRANSPARENT_BORDER};
          border-bottom: ${TRANSPARENT_BORDER};
          border-left: 6px solid ${theme.colors.bg.black};
        `;
      case Placement.RIGHT:
      case Placement.RIGHT_START:
      case Placement.RIGHT_END:
        return `
          left: -6px;
          border-top: ${TRANSPARENT_BORDER};
          border-bottom: ${TRANSPARENT_BORDER};
          border-right: 6px solid ${theme.colors.bg.black};
        `;
      default:
        return ``;
    }
  }}
`;

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
  const ref = useRef(null);
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
        ref={ref}
        {...props}
      >
        {children}
      </Wrapper>
      <Popup
        anchor={ref}
        placement={placement}
        spacing={spacing}
        isOpen={Boolean(shown && (shortcut || title))}
      >
        <Tooltip arrow={arrow} placement={placement} shown={shown}>
          {shortcut ? `${title} (${prettifyShortcut(shortcut)})` : title}
          <TooltipArrow placement={placement} />
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
