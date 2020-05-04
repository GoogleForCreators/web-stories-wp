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
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { prettifyShortcut } from '../keyboard';

const HORIZONTAL_SPACING = 12;
const VERTICAL_SPACING = 42;
const PADDING = 4;

const Wrapper = styled.div`
  position: relative;
`;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1500;
  pointer-events: none;
  align-items: center;
  justify-content: center;
`;

/**
 * To circumvent overflow: hidden; on the parent
 * container, we position the tooltip using
 * position: fixed; and offset using transforms
 */
const Tooltip = styled.div`
  position: fixed;
  background-color: ${({ theme }) => theme.colors.bg.v0};
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: 12px;
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  padding: ${PADDING}px ${PADDING * 2}px;
  border-radius: 6px;
  box-shadow: 0px 6px 10px ${({ theme }) => rgba(theme.colors.bg.v0, 0.1)};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  white-space: nowrap;
  will-change: transform;
  transition: 0.4s opacity;
  ${({ placement }) =>
    placement === 'top'
      ? `
        transform: translateY(-${VERTICAL_SPACING}px);
      `
      : ``}
  ${({ placement }) =>
    placement === 'bottom'
      ? `
        transform: translateY(${VERTICAL_SPACING}px);
      `
      : ``}
  ${({ placement }) =>
    placement === 'left'
      ? `
        transform: translateX(-100%);
        align-self: flex-start;
        margin-left: -${HORIZONTAL_SPACING}px;
      `
      : ``}
  ${({ placement }) =>
    placement === 'right'
      ? `
        transform: translateX(100%);
        align-self: flex-end;
        margin-left: ${HORIZONTAL_SPACING}px;
      `
      : ``}
  opacity:  ${({ shown }) => (shown ? 1 : 0)};

  ${({ arrow, theme, placement }) =>
    arrow &&
    `&:after {
      content: '';
      position: absolute;
      ${
        placement === 'top'
          ? `
            bottom: -6px;
            border-top: 6px solid ${theme.colors.bg.v0};
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
          `
          : ``
      }
      ${
        placement === 'bottom'
          ? `
            top: -6px;
            border-bottom: 6px solid ${theme.colors.bg.v0};
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
          `
          : ``
      }
      ${
        placement === 'right'
          ? `
            left: -6px;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-right: 6px solid ${theme.colors.bg.v0};
          `
          : ``
      }
      ${
        placement === 'left'
          ? `
            right: -6px;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            border-left: 6px solid ${theme.colors.bg.v0};
          `
          : ``
      }

      box-shadow: 0px 6px 10px ${rgba(theme.colors.bg.v0, 0.1)};
    }`}
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

  return (
    <Wrapper
      {...props}
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
    >
      <Container placement={placement}>
        <Tooltip arrow={arrow} placement={placement} shown={shown}>
          {shortcut ? `${title} (${prettifyShortcut(shortcut)})` : title}
        </Tooltip>
      </Container>
      {children}
    </Wrapper>
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
