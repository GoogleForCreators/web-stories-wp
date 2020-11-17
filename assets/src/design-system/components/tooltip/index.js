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
import { TOOLTIP_POSITIONS } from './constants';

const SVG_TOOLTIP_TAIL_ID = 'tooltip-tail';
const TAIL_WIDTH = 34;
const TAIL_HEIGHT = 8;

const SvgForTail = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
`;

const getTailPosition = (position) => {
  switch (position) {
    case TOOLTIP_POSITIONS.TOP_CENTER:
      return css`
        bottom: -${TAIL_HEIGHT}px;
        left: calc(50% - ${TAIL_WIDTH / 2}px);
        transform: rotate(180deg);
        background-color: red;
      `;

    case TOOLTIP_POSITIONS.TOP_LEFT:
      return css`
        bottom: -${TAIL_HEIGHT}px;
        left: 0;
        transform: rotate(180deg);
        background-color: red;
      `;

    case TOOLTIP_POSITIONS.TOP_RIGHT:
      return css`
        bottom: -${TAIL_HEIGHT}px;
        right: 0;
        transform: rotate(180deg);
        background-color: red;
      `;

    case TOOLTIP_POSITIONS.BOTTOM_RIGHT:
      return css`
        top: -${TAIL_HEIGHT}px;
        right: 0;
      `;

    case TOOLTIP_POSITIONS.BOTTOM_LEFT:
      return css`
        top: -${TAIL_HEIGHT}px;
        left: 0;
      `;

    // default is bottom center
    default: {
      return css`
        top: -${TAIL_HEIGHT}px;
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
    clip-path: url('#${SVG_TOOLTIP_TAIL_ID}');
  }
`;

export const Content = styled.div`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  position: absolute;
  max-width: 300px;
  border-radius: 4px;
  margin-top: 8px;
  padding: 10px;
  overflow-wrap: break-word;
  background-color: ${({ theme }) => theme.colors.interactiveBg.primaryNormal};
  color: ${({ theme }) => theme.colors.bg.primary};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity linear 200ms;
`;

const ContentWrapper = styled.div`
  display: inline-flex;
`;

const Container = styled.div.attrs({
  ['data-testid']: 'tooltip-container',
})`
  position: relative;
  height: inherit;
  width: inherit;
  display: inline-flex;
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

    // tooltip position is based on the element interacting with to enable tool tip.
    // left means it will start at the left side of the element interacting with
    // center means it will start from the center point of the element
    // refactor this to be easier
    if (position === TOOLTIP_POSITIONS.BOTTOM_LEFT) {
      metrics = {
        left: containerRect.left - contentRect.left,
        top: containerRect.height + 1,
      };
    } else if (position === TOOLTIP_POSITIONS.BOTTOM_RIGHT) {
      metrics = {
        left: containerRect.width - contentRect.width,
        top: containerRect.height + 1,
      };
    } else if (position === TOOLTIP_POSITIONS.BOTTOM_CENTER) {
      metrics = {
        left: (containerRect.width - contentRect.width) / 2,
        top: containerRect.height + 1,
      };
    } else if (position === TOOLTIP_POSITIONS.TOP_CENTER) {
      metrics = {
        left: (containerRect.width - contentRect.width) / 2,
        top: -(containerRect.height * 2),
      };
    } else if (position === TOOLTIP_POSITIONS.TOP_RIGHT) {
      metrics = {
        left: containerRect.width - contentRect.width,
        top: -(containerRect.height * 2),
      };
    } else if (position === TOOLTIP_POSITIONS.TOP_LEFT) {
      metrics = {
        left: containerRect.left - contentRect.left,
        top: -(containerRect.height * 2),
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
        {content}
        {hasTail && <Tail position={position} />}
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
