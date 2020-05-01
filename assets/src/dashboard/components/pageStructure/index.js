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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */

import styled from 'styled-components';
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import Button from '../button';
import { useRouteHistory } from '../../app/router';
import { useConfig } from '../../app/config';
import {
  BEZIER,
  BUTTON_TYPES,
  primaryPaths,
  secondaryPaths,
  Z_INDEX,
} from '../../constants';
import useFocusOut from '../../utils/useFocusOut';
import { useNavContext } from '../navProvider';
import {
  AppInfo,
  Content,
  LogoPlaceholder,
  NavLink,
  Rule,
} from './navigationComponents';

export const AppFrame = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const PageContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: ${({ fullWidth }) => (fullWidth ? '0' : 'max(15%, 190px)')};

  @media ${({ theme }) => theme.breakpoint.tablet} {
    left: 0;
  }
`;

export const LeftRailContainer = styled.nav.attrs({
  ['data-testid']: 'dashboard-left-rail',
})`
  position: absolute;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  top: 0;
  bottom: 0;
  width: max(15%, 190px);
  background: ${({ theme }) => theme.colors.white};
  border-right: ${({ theme }) => theme.leftRail.border};
  z-index: ${Z_INDEX.LAYOUT_FIXED};
  transition: transform 0.25s ${BEZIER.outCubic}, visibility 0.25s linear;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    padding-left: 0;
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transform: translateX(${({ isOpen }) => (isOpen ? 'none' : `-100%`)});
  }
`;

export function LeftRail() {
  const { state } = useRouteHistory();
  const { newStoryURL, version } = useConfig();
  const leftRailRef = useRef(null);
  const upperContentRef = useRef(null);

  const {
    state: { sideBarVisible },
    actions: { toggleSideBar },
  } = useNavContext();

  const onContainerClickCapture = useCallback(
    ({ target }) => {
      if (
        target === leftRailRef.current ||
        target === upperContentRef.current
      ) {
        return;
      }
      toggleSideBar();
    },
    [toggleSideBar, leftRailRef, upperContentRef]
  );

  const handleSideBarClose = useCallback(() => {
    if (sideBarVisible) {
      toggleSideBar();
    }
  }, [toggleSideBar, sideBarVisible]);

  useFocusOut(leftRailRef, handleSideBarClose, [sideBarVisible]);

  return (
    <LeftRailContainer
      onClickCapture={onContainerClickCapture}
      ref={leftRailRef}
      isOpen={sideBarVisible}
    >
      <div ref={upperContentRef}>
        <LogoPlaceholder />
        <Content>
          <Button type={BUTTON_TYPES.CTA} href={newStoryURL} isLink>
            {__('Create New Story', 'web-stories')}
          </Button>
        </Content>
        <Content>
          {primaryPaths.map((path) => (
            <NavLink
              active={path.value === state.currentPath}
              key={path.value}
              href={`#${path.value}`}
            >
              {path.label}
            </NavLink>
          ))}
        </Content>
        <Rule />
        <Content>
          {secondaryPaths.map((path) => (
            <NavLink
              active={path.value === state.currentPath}
              key={path.value}
              href={`#${path.value}`}
            >
              {path.label}
            </NavLink>
          ))}
        </Content>
      </div>
      <Content>
        <AppInfo>
          {__('\u00A9 Google 2020', 'web-stories')}
          <br />
          {__('Version', 'web-stories')}&nbsp;
          {version}
        </AppInfo>
      </Content>
    </LeftRailContainer>
  );
}

export { default as NavMenuButton } from './menuButton';
