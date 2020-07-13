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
import { useCallback, useRef, useLayoutEffect, useMemo } from 'react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { trackEvent } from '../../../tracking';
import { resolveRoute, useRouteHistory } from '../../app/router';
import { useConfig } from '../../app/config';
import { DASHBOARD_LEFT_NAV_WIDTH } from '../../constants/pageStructure';
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
  NavLink,
  Rule,
  NavButton,
  NavList,
  NavListItem,
  WebStoriesHeading,
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
  left: ${({ fullWidth }) =>
    fullWidth ? '0' : `${DASHBOARD_LEFT_NAV_WIDTH}px`};

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
  width: ${DASHBOARD_LEFT_NAV_WIDTH}px;
  background: ${({ theme }) => theme.colors.white};
  border-right: ${({ theme }) => theme.borders.gray50};
  z-index: ${Z_INDEX.LAYOUT_FIXED};
  transition: transform 0.25s ${BEZIER.outCubic}, opacity 0.25s linear;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    padding-left: 0;
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transform: translateX(${({ isOpen }) => (isOpen ? 'none' : `-100%`)});
  }
`;

export function LeftRail() {
  const { state } = useRouteHistory();
  const { newStoryURL, version } = useConfig();
  const leftRailRef = useRef(null);
  const upperContentRef = useRef(null);
  const enableInProgressViews = useFeature('enableInProgressViews');

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

  const enabledPaths = useMemo(() => {
    if (enableInProgressViews) {
      return primaryPaths;
    }
    return primaryPaths.filter((path) => !path.inProgress);
  }, [enableInProgressViews]);

  const enabledSecondaryPaths = useMemo(() => {
    if (enableInProgressViews) {
      return secondaryPaths;
    }
    return secondaryPaths.filter((path) => !path.inProgress);
  }, [enableInProgressViews]);

  const handleSideBarClose = useCallback(() => {
    if (sideBarVisible) {
      toggleSideBar();
    }
  }, [toggleSideBar, sideBarVisible]);

  useFocusOut(leftRailRef, handleSideBarClose, [sideBarVisible]);

  useLayoutEffect(() => {
    if (sideBarVisible && leftRailRef.current) {
      leftRailRef.current.focus();
    }
  }, [sideBarVisible]);

  const onCreateNewStoryClick = useCallback(async () => {
    await trackEvent('dashboard', 'create_new_story');
  }, []);

  return (
    <LeftRailContainer
      onClickCapture={onContainerClickCapture}
      ref={leftRailRef}
      isOpen={sideBarVisible}
      tabIndex={-1}
      role="navigation"
      aria-label={__('Main dashboard navigation', 'web-stories')}
    >
      <div ref={upperContentRef}>
        <Content>
          <WebStoriesHeading>
            {__('Web Stories', 'web-stories')}
          </WebStoriesHeading>
        </Content>
        <Content>
          <NavButton
            type={BUTTON_TYPES.CTA}
            href={newStoryURL}
            isLink
            onClick={onCreateNewStoryClick}
          >
            {__('Create New Story', 'web-stories')}
          </NavButton>
        </Content>
        <Content>
          <NavList>
            {enabledPaths.map((path) => (
              <NavListItem key={path.value}>
                <NavLink
                  active={path.value === state.currentPath}
                  href={resolveRoute(path.value)}
                >
                  {path.label}
                </NavLink>
              </NavListItem>
            ))}
          </NavList>
        </Content>
        <Rule />
        <Content>
          <NavList>
            {enabledSecondaryPaths.map((path) => (
              <NavListItem key={path.value}>
                <NavLink
                  active={path.value === state.currentPath}
                  href={resolveRoute(path.value)}
                >
                  {path.label}
                </NavLink>
              </NavListItem>
            ))}
          </NavList>
        </Content>
      </div>
      <Content>
        <AppInfo>
          {__('\u00A9 2020 Google', 'web-stories')}
          <br />
          {__('Version', 'web-stories')}&nbsp;
          {version}
        </AppInfo>
      </Content>
    </LeftRailContainer>
  );
}

export { default as NavMenuButton } from './menuButton';
