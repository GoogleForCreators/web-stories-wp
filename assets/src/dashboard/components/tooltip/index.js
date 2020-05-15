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
import { useState } from 'react';

export const Content = styled.div`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  width: max-content;
  position: absolute;
  right: 0;
  border-radius: 2px;
  padding: 10px;
  background: ${({ theme }) => theme.tooltip.background};
  color: ${({ theme }) => theme.tooltip.color};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity linear 200ms;
`;

export const Container = styled.div.attrs({
  ['data-testid']: 'tooltip-container',
})`
  position: relative;
  height: inherit;
  width: inherit;
`;

export default function Tooltip({ children, label }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Container
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      <Content visible={showTooltip}>{label}</Content>
    </Container>
  );
}

Tooltip.propTypes = {
  children: propTypes.node.isRequired,
  label: propTypes.string.isRequired,
};
