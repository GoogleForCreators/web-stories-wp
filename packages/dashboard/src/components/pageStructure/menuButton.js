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
import { __ } from '@googleforcreators/i18n';
import { themeHelpers } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { MIN_DASHBOARD_WIDTH } from '../../constants';
import { Menu as MenuSvg } from '../../icons';
import { useNavContext } from '../navProvider';

const MenuIcon = styled(MenuSvg).attrs({ width: 24, height: 24 })`
  display: block;
  color: ${({ theme }) => theme.colors.interactiveFg.brandNormal};
`;

const TransparentButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin-right: 16px;
  background: transparent;
  border: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${themeHelpers.focusableOutlineCSS}

  ${({ showOnlyOnSmallViewport }) =>
    showOnlyOnSmallViewport &&
    css`
      display: none;
      @media screen and (max-width: ${MIN_DASHBOARD_WIDTH}px) {
        display: inline-block;
      }
    `}
`;

function NavMenuButton({ showOnlyOnSmallViewport }) {
  const { actions } = useNavContext();
  return (
    <TransparentButton
      onClick={actions.toggleSideBar}
      showOnlyOnSmallViewport={showOnlyOnSmallViewport}
      aria-label={__('Toggle main navigation', 'web-stories')}
    >
      <MenuIcon aria-hidden />
    </TransparentButton>
  );
}

NavMenuButton.propTypes = {
  showOnlyOnSmallViewport: PropTypes.bool,
};

export default NavMenuButton;
