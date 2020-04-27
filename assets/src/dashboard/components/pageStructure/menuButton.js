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
 * Internal dependencies
 */
import { CHIP_TYPES } from '../../constants';
import { ReactComponent as MenuSvg } from '../../icons/menu.svg';
import { ChipContainer } from '../bookmark-chip';
import { useNavContext } from './navProvider';

const MenuIcon = styled(MenuSvg)`
  color: ${({ theme }) => theme.colors.gray900};
`;

const Container = styled.div`
  display: inline-block;
  ${({ showOnlyOnSmallViewport }) =>
    showOnlyOnSmallViewport &&
    css`
      display: none;
      @media ${({ theme }) => theme.breakpoint.tablet} {
        display: inline-block;
      }
    `}
`;

export default function NavMenuButton({ showOnlyOnSmallViewport }) {
  const { actions } = useNavContext();
  return (
    <Container showOnlyOnSmallViewport={showOnlyOnSmallViewport}>
      <ChipContainer
        chipType={CHIP_TYPES.STANDARD}
        onClick={actions.toggleSideBar}
      >
        <MenuIcon />
      </ChipContainer>
    </Container>
  );
}

NavMenuButton.propTypes = {
  showOnlyOnSmallViewport: PropTypes.bool,
};
