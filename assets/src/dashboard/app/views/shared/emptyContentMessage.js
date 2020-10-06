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

/**
 * Internal dependencies
 */
import { TypographyPresets } from '../../../components';

const Message = styled.p`
  ${TypographyPresets.Medium};
  margin-top: 40px;
  color: ${({ theme }) => theme.colors.gray200};
`;

function EmptyContentMessage({ children }) {
  return <Message>{children}</Message>;
}

EmptyContentMessage.propTypes = {
  children: PropTypes.node,
};

export default EmptyContentMessage;
