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
import propTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useState, useRef, useMemo, useEffect } from 'react';
/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { Text } from '../typography';
import { TOOLTIP_POSITIONS } from './constants';

const SVG_TOOLTIP_TAIL_ID = 'tooltip-tail';
const TAIL_WIDTH = 34;
const TAIL_HEIGHT = 8;
const SPACE_BETWEEN_TOOLTIP_AND_ELEMENT = 8;

const SvgForTail = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
`;

const getTailPosition = (position) => {
  switch (position) {
    case TOOLTIP_POSITIONS.TOP_CENTER:
      return css`
        bottom: -${TAIL_HEIGHT - 1}px;
        left: calc(50% - ${TAIL_WIDTH / 2}px);
        transform: rotate(180deg);
      `;

    case TOOLTIP_POSITIONS.TOP_LEFT:
      return css`
        bottom: -${TAIL_HEIGHT - 1}px;
        left: 0;
        transform: rotate(180deg);
      `;

    case TOOLTIP_POSITIONS.TOP_RIGHT:
      return css`
        bottom: -${TAIL_HEIGHT - 1}px;
        right: 0;
        transform: rotate(180deg);
      `;

    case TOOLTIP_POSITIONS.BOTTOM_RIGHT:
      return css`
        top: -${TAIL_HEIGHT - 1}px;
        right: 0;
      `;

    case TOOLTIP_POSITIONS.BOTTOM_LEFT:
      return css`
        top: -${TAIL_HEIGHT - 1}px;
        left: 0;
      `;

    // default is TOOLTIP_POSITIONS.BOTTOM_CENTER
    default: {
      return css`
        top: -${TAIL_HEIGHT - 1}px;
        left: calc(50% - ${TAIL_WIDTH / 2}px);
      `;
    }
  }
};
const Tail = styled.span`
  @supports (clip-path: url('#${SVG_TOOLTIP_TAIL_ID}')) {
    position: absolute;
    display: block;
    height: ${TAIL_HEIGHT}px;
    width: ${TAIL_WIDTH}px;
    ${({ position }) => getTailPosition(position)};
    background-color: inherit;
    border: inherit;
    border-bottom: none;
    clip-path: url('#${SVG_TOOLTIP_TAIL_ID}');
  }
`;

export const Content = styled.div(
  ({ theme, visible }) => css`
    /* visibility: ${visible ? 'visible' : 'hidden'}; */
    position: absolute;
    /* max-width: 300px;
    border-radius: 4px;
    padding: 10px;
    background-color: ${theme.colors.inverted.bg.primary}; */
    /* opacity: ${visible ? 1 : 0}; */

    transition: opacity linear 200ms;
  `
);

const TooltipContainer = styled.div`
  display: flex;
  position: relative;
  /* max-width: 300px; */
  min-width: 100%;
  border-radius: 4px;
  background-color: lime;
`;

const TooltipText = styled.span`
  color: ${({ theme }) => theme.colors.inverted.fg.primary};
  padding: 10px;
  background-color: red;
  /* overflow-wrap: break-word; */
`;

const ContentWrapper = styled.div`
  display: inline-flex;
  border: 1px solid red;
  background-color: lime;
`;

const Container = styled.div.attrs({
  ['data-testid']: 'tooltip-container',
})`
  position: relative;
  display: inline-flex;
  border: 1px solid blue;
  height: inherit;
  width: inherit;
`;

function Tooltip({
  children,
  content,
  hasTail,
  position = TOOLTIP_POSITIONS.BOTTOM_CENTER,
}) {
  const containerRef = useRef();
  const contentRef = useRef();
  const previousContent = useRef();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (content != previousContent.current) {
      setShowTooltip(false);
    }

    previousContent.current = content;
  }, [content]);

  const offset = useMemo(() => {
    if (!showTooltip) {
      return {};
    }
    let metrics = {};

    if (!contentRef.current || !containerRef.current) {
      return metrics;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    // Tooltip position is based on the element being interacting with that makes the tooltip visible.
    // Left means it will start at the left side of the element being interacting with.
    // Center means it will start from the center point of the element being interacted with.
    // Right means it will start at the right side of the element being interacted with.
    if (position === TOOLTIP_POSITIONS.BOTTOM_LEFT) {
      metrics = {
        left: containerRect.left - contentRect.left,
        top: containerRect.height + SPACE_BETWEEN_TOOLTIP_AND_ELEMENT,
      };
    } else if (position === TOOLTIP_POSITIONS.BOTTOM_RIGHT) {
      metrics = {
        left: containerRect.width - contentRect.width,
        top: containerRect.height + SPACE_BETWEEN_TOOLTIP_AND_ELEMENT,
      };
    } else if (position === TOOLTIP_POSITIONS.BOTTOM_CENTER) {
      metrics = {
        left: (containerRect.width - contentRect.width) / 2,
        top: containerRect.height + SPACE_BETWEEN_TOOLTIP_AND_ELEMENT,
      };
    } else if (position === TOOLTIP_POSITIONS.TOP_CENTER) {
      metrics = {
        left: (containerRect.width - contentRect.width) / 2,
        top: -(contentRect.height + SPACE_BETWEEN_TOOLTIP_AND_ELEMENT),
      };
    } else if (position === TOOLTIP_POSITIONS.TOP_RIGHT) {
      metrics = {
        left: containerRect.width - contentRect.width,
        top: -(contentRect.height + SPACE_BETWEEN_TOOLTIP_AND_ELEMENT),
      };
    } else if (position === TOOLTIP_POSITIONS.TOP_LEFT) {
      metrics = {
        left: containerRect.left - contentRect.left,
        top: -(contentRect.height + SPACE_BETWEEN_TOOLTIP_AND_ELEMENT),
      };
    }
    return metrics;
  }, [position, showTooltip]);

  return (
    <Container
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <SvgForTail>
        <clipPath id={SVG_TOOLTIP_TAIL_ID} clipPathUnits="objectBoundingBox">
          <path d="M1,1 L0.868,1 C0.792,1,0.72,0.853,0.676,0.606 L0.585,0.098 C0.562,-0.033,0.513,-0.033,0.489,0.098 L0.399,0.606 C0.355,0.853,0.283,1,0.207,1 L0,1 L1,1" />
        </clipPath>
      </SvgForTail>
      <ContentWrapper ref={containerRef}>{children}</ContentWrapper>
      <Content ref={contentRef} style={offset} visible={showTooltip}>
        <TooltipContainer>
          <TooltipText
            as="span"
            size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.X_SMALL}
          >
            {content}
          </TooltipText>
          {hasTail && <Tail position={position} />}
        </TooltipContainer>
      </Content>
    </Container>
  );
}

Tooltip.propTypes = {
  children: propTypes.node.isRequired,
  content: propTypes.node.isRequired,
  position: propTypes.oneOf(Object.values(TOOLTIP_POSITIONS)).isRequired,
  hasTail: propTypes.bool,
};

export { TOOLTIP_POSITIONS, Tooltip };
