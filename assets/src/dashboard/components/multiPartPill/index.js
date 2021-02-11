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
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PillContainer = styled.div`
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.DEPRECATED_THEME.button.borderRadius}px;
  box-shadow: 0px 2px 11px rgba(0, 0, 0, 0.25);
`;

const PillPart = styled.div`
  display: flex;
  align-items: center;
  span {
    border-bottom: none;
  }
  &:nth-child(n + 2) {
    &:before {
      content: '';
      width: 1px;
      height: 20px;
      margin: 0 10px;
      background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray75};
    }
  }
`;

function MultiPartPill({ children }) {
  const parts = useMemo(
    () => (Array.isArray(children) ? [...children] : [children]),
    [children]
  );

  return (
    <PillContainer>
      {parts.map((part) => (
        <PillPart key={`${part}_pill`}>{part}</PillPart>
      ))}
    </PillContainer>
  );
}

MultiPartPill.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MultiPartPill;
