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

/**
 * Internal dependencies
 */
import Row from './row';

const HelperRow = styled(Row)`
  margin-top: -10px;
`;

const Helper = styled.span`
  color: ${({ theme, warning }) =>
    warning
      ? theme.DEPRECATED_THEME.colors.warning
      : rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.54)};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  font-size: 12px;
  line-height: 16px;
`;

function HelperText({ children, isWarning = false }) {
  return (
    <HelperRow>
      <Helper warning={isWarning}>{children}</Helper>
    </HelperRow>
  );
}

HelperText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  isWarning: PropTypes.bool,
};

export default HelperText;
