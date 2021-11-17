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
import styled from 'styled-components';
import { BEZIER, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import {
  Z_INDEX,
  DASHBOARD_LEFT_NAV_WIDTH,
  MIN_DASHBOARD_WIDTH,
} from '../../constants';

export const AppFrame = styled.div`
  width: 100%;
  @media screen and (max-width: ${MIN_DASHBOARD_WIDTH}px) {
    width: ${MIN_DASHBOARD_WIDTH}px;
  }
`;

export const PageContent = styled.div`
  position: relative;
  padding-top: 10px;
  width: ${({ fullWidth }) =>
    fullWidth ? '100%' : `calc(100% - ${DASHBOARD_LEFT_NAV_WIDTH}px)`};
  left: ${({ fullWidth }) =>
    fullWidth ? '0' : `${DASHBOARD_LEFT_NAV_WIDTH}px`};

  @media screen and (max-width: ${MIN_DASHBOARD_WIDTH}px) {
    left: 0;
    width: 100%;
  }
`;

export const LeftRailContainer = styled.nav.attrs({
  ['data-testid']: 'dashboard-left-rail',
})`
  position: fixed;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  top: ${THEME_CONSTANTS.WP_ADMIN.TOOLBAR_HEIGHT}px;
  bottom: 0;
  width: ${DASHBOARD_LEFT_NAV_WIDTH}px;
  background: ${({ theme }) => theme.colors.bg.primary};
  z-index: ${Z_INDEX.LAYOUT_FIXED};
  transition: transform 0.25s ${BEZIER.outCubic}, opacity 0.25s linear;

  @media screen and (max-width: ${MIN_DASHBOARD_WIDTH}px) {
    padding-left: 0;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transform: translateX(${({ isOpen }) => (isOpen ? 'none' : `-100%`)});
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 550px;
`;
