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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Menu as MenuSvg } from '../../icons';
import { useNavContext } from '../navProvider';

const MenuIcon = styled(MenuSvg).attrs({ width: 24, height: 24 })`
  display: block;
  color: ${({ theme }) => theme.internalTheme.colors.gray900};
`;

const TransparentButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin-right: 16px;
  border: ${({ theme }) => theme.internalTheme.borders.transparent};
  background: transparent;

  &:focus {
    border: ${({ theme }) => theme.internalTheme.borders.action};
  }

  ${({ showOnlyOnSmallViewport }) =>
    showOnlyOnSmallViewport &&
    css`
      display: none;
      @media ${({ theme }) => theme.internalTheme.breakpoint.tablet} {
        display: inline-block;
      }
    `}
`;

export default function NavMenuButton({ showOnlyOnSmallViewport }) {
  const { actions } = useNavContext();
  return (
    <TransparentButton
      onClick={actions.toggleSideBar}
      showOnlyOnSmallViewport={showOnlyOnSmallViewport}
      aria-label={__('toggle main navigation', 'web-stories')}
    >
      <MenuIcon aria-hidden={true} />
    </TransparentButton>
  );
}

NavMenuButton.propTypes = {
  showOnlyOnSmallViewport: PropTypes.bool,
};
