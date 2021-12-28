/*
 * Copyright 2021 Google LLC
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
/**
 * Internal dependencies
 */
import { Row } from '../../../form';

const WarningContainer = styled.div`
  margin: 14px 0;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultHover};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  padding: 8px;
  color: ${({ theme }) => theme.colors.fg.primary};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
`;

function Warning({ children }) {
  return (
    <Row>
      <WarningContainer>{children}</WarningContainer>
    </Row>
  );
}

Warning.propTypes = {
  children: PropTypes.shape,
};

export default Warning;
