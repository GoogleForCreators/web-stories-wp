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
import styled, { css } from 'styled-components';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { focusStyle } from '../../../../panels/shared/styles';

const StyledText = styled(Text)`
  color: inherit;
`;

const Tab = styled.button`
  padding: 6px 16px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.fg.secondary};
  position: relative;
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.colors.fg.primary};
  }

  border-radius: ${({ theme }) => theme.borders.radius.x_large};
  ${focusStyle};

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      ::after {
        content: '';
        position: absolute;
        background-color: ${theme.colors.border.selection};
        height: 2px;
        border-radius: 1px;
        bottom: -17px;
        left: 16px;
        right: 16px;
      }
    `}
`;

function ProviderTab({ name, isActive, ...rest }) {
  return (
    <Tab $isActive={isActive} {...rest}>
      <StyledText
        forwardedAs="span"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
      >
        {name}
      </StyledText>
    </Tab>
  );
}

ProviderTab.propTypes = {
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

export default ProviderTab;
