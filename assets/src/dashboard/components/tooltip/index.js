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
import { TypographyPresets } from '../typography';

export const Content = styled.div`
  ${TypographyPresets.Small};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  position: absolute;
  border-radius: 2px;
  padding: 10px;
  white-space: nowrap;
  background: ${({ theme }) => theme.DEPRECATED_THEME.tooltip.background};
  color: ${({ theme }) => theme.DEPRECATED_THEME.tooltip.color};
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

export default function Tooltip({ children, content, position }) {
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
    let metrics = {};

    if (!showTooltip && position === 'right') {
      // have the tooltip render near where it will be displayed
      // so that it doesn't interrupt the flow before being shown
      metrics = {
        right: 0,
      };
    }

    if (!showTooltip || !contentRef.current || !containerRef.current) {
      return metrics;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    if (position === 'left') {
      metrics = {
        left: containerRect.left - contentRect.left,
        top: containerRect.height + 1,
      };
    } else if (position === 'right') {
      metrics = {
        left: containerRect.width - contentRect.width,
        top: containerRect.height + 1,
      };
    } else if (position === 'center') {
      metrics = {
        left: (containerRect.width - contentRect.width) / 2,
        top: containerRect.height + 1,
      };
    }

    return metrics;
  }, [position, showTooltip]);

  return (
    <Container
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
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
