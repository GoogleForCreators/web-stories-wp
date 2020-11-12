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
import styled from 'styled-components';
import { useState, useRef, useMemo, useEffect } from 'react';
/**
 * Internal dependencies
 */

export const TOOLTIP_POSITIONS = {
  LEFT_CENTER: 'left_center',
  LEFT_START: 'left_start',
  LEFT_END: 'left_end',
  RIGHT_CENTER: 'right_center',
  RIGHT_START: 'right_start',
  RIGHT_END: 'right_end',
  // these are good
  TOP_CENTER: 'top_center',
  TOP_RIGHT: 'top_right',
  TOP_LEFT: 'top_left',
  BOTTOM_CENTER: 'bottom_center',
  BOTTOM_RIGHT: 'bottom_right',
  BOTTOM_LEFT: 'bottom_left',
};

export const Content = styled.div`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  position: absolute;
  border-radius: 2px;
  padding: 10px;
  white-space: nowrap;
  background: lime;
  color: salmon;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity linear 200ms;
`;

const ContentWrapper = styled.div`
  display: inline-flex;
`;

export const Container = styled.div.attrs({
  ['data-testid']: 'tooltip-container',
})`
  position: relative;
  height: inherit;
  width: inherit;
  display: inline-flex;
`;

export function Tooltip({ children, content, position }) {
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
    } else if (position === TOOLTIP_POSITIONS.RIGHT_CENTER) {
      metrics = {
        left: containerRect.width + 1,
        top: containerRect.height / 2,
      };
    } else if (position === TOOLTIP_POSITIONS.RIGHT_START) {
      metrics = {
        left: containerRect.width + 1,
        top: -(containerRect.height * 2 - contentRect.height),
      };
    } else if (position === TOOLTIP_POSITIONS.RIGHT_END) {
      metrics = {
        left: containerRect.width + 1,
        top: containerRect.height - contentRect.height,
      };
    } else if (position === TOOLTIP_POSITIONS.LEFT_CENTER) {
      metrics = {
        left: -(contentRect.width + 1),
        top: containerRect.height / 2,
      };
    } else if (position === TOOLTIP_POSITIONS.LEFT_START) {
      metrics = {
        left: -(contentRect.width + 1),
        top: -(containerRect.height * 2 - contentRect.height),
      };
    } else if (position === TOOLTIP_POSITIONS.LEFT_END) {
      metrics = {
        left: -(contentRect.width + 1),
        top: containerRect.height - contentRect.height,
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
      <ContentWrapper ref={containerRef}>{children}</ContentWrapper>
      <Content
        ref={contentRef}
        style={offset}
        position={position}
        visible={showTooltip}
      >
        {content}
      </Content>
    </Container>
  );
}

Tooltip.propTypes = {
  children: propTypes.node.isRequired,
  content: propTypes.node.isRequired,
  position: propTypes.oneOf(['left', 'right', 'center']).isRequired,
};

Tooltip.defaultProps = {
  position: 'left',
};
