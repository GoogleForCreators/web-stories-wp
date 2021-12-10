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
import { Link as BaseLink } from '../../typography/link';
import { menuItemStyles } from './styles';

const StyledLink = styled(BaseLink)`
  ${menuItemStyles};

  background-color: transparent;
  text-decoration: none;

  :active,
  :hover,
  :focus,
  :active *,
  :hover *,
  :focus * {
    /* Override the override to WordPress's common css */
    color: ${({ theme }) => theme.colors.fg.primary} !important;
  }

  :hover {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }

  :active {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryPress};
  }
`;

/**
 * A styled link for use in the context menu.
 *
 * @param {Object} props Attributes to pass to the link.
 * @param {boolean} props.openNewTab openNewTab defines whether the link should be opened in a new tab.
 * @return {Node} The react node
 */
function Link({ openNewTab, ...props }) {
  const newTabProps = openNewTab
    ? {
        target: '_blank',
        rel: 'noreferrer',
      }
    : {};

  return <StyledLink role="menuitem" {...newTabProps} {...props} />;
}

Link.propTypes = {
  openNewTab: PropTypes.bool,
};

export default Link;
