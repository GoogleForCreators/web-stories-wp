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
import styled from 'styled-components';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useFeature } from 'flagged';
import { __, sprintf } from '@web-stories-wp/i18n';
import { trackClick, trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { BEZIER } from '../../../animation';
import { useConfig } from '../../app/config';
import { resolveRoute, useRouteHistory } from '../../app/router';
import { PRIMARY_PATHS, SECONDARY_PATHS, Z_INDEX } from '../../constants';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  LogoWithTypeCircleColor,
  Text,
  THEME_CONSTANTS,
} from '../../../design-system';
import {
  DASHBOARD_LEFT_NAV_WIDTH,
  MIN_DASHBOARD_WIDTH,
} from '../../constants/pageStructure';
import useFocusOut from '../../utils/useFocusOut';
import { useNavContext } from '../navProvider';
import {
  AppInfo,
  Content,
  Header,
  NavLink,
  NavList,
  NavListItem,
  PathName,
} from './navigationComponents';

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

  const enabledPrimaryPaths = useMemo(() => {
    if (enableInProgressViews) {
      return PRIMARY_PATHS;
    }
    return PRIMARY_PATHS.filter((path) => !path.inProgress);
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

  const onCreateNewStoryClick = useCallback(() => {
    trackEvent('create_new_story');
  }, []);

  const onExternalLinkClick = useCallback((evt, path) => {
    trackClick(evt, path.trackingEvent);
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
        <Header forwardedAs="h2">
          <LogoWithTypeCircleColor
            title={__('Web Stories Dashboard', 'web-stories')}
          />
        </Header>
        <Content>
          <Button
            type={BUTTON_TYPES.QUATERNARY}
            size={BUTTON_SIZES.SMALL}
            href={newStoryURL}
            onClick={onCreateNewStoryClick}
          >
            {__('Create New Story', 'web-stories')}
          </Button>
        </Content>
        <Content>
          <NavList>
            {enabledPrimaryPaths.map(({ Icon, ...path }) => (
              <NavListItem key={path.value}>
                <NavLink
                  active={path.value === state.currentPath}
                  href={resolveRoute(path.value)}
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                  isBold
                  aria-label={
                    path.value === state.currentPath
                      ? sprintf(
                          /* translators: %s: the current page, for example "My Stories". */
                          __('%s (active view)', 'web-stories'),
                          path.label
                        )
                      : path.label
                  }
                  {...(path.isExternal && {
                    rel: 'noreferrer',
                    target: '_blank',
                    onClick: (evt) => onExternalLinkClick(evt, path),
                  })}
                >
                  {Icon && <Icon width="22px" />}
                  <PathName as="span" isBold>
                    {path.label}
                  </PathName>
                </NavLink>
              </NavListItem>
            ))}
          </NavList>
        </Content>
      </div>
      <Content>
        <NavList>
          {SECONDARY_PATHS.map((path) => (
            <NavListItem key={path.value}>
              <NavLink
                active={path.value === state.currentPath}
                href={resolveRoute(path.value)}
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                aria-label={
                  path.value === state.currentPath
                    ? sprintf(
                        /* translators: %s: the current page, for example "My Stories". */
                        __('%s (active view)', 'web-stories'),
                        path.label
                      )
                    : path.label
                }
                {...(path.isExternal && {
                  rel: 'noreferrer',
                  target: '_blank',
                  onClick: (evt) => onExternalLinkClick(evt, path),
                })}
              >
                <Text
                  as="span"
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                  isBold
                >
                  {path.label}
                </Text>
              </NavLink>
            </NavListItem>
          ))}
        </NavList>
        <AppInfo size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
          {sprintf(
            /* translators: 1: Current Year, 2: App Version */
            __('\u00A9 %1$s Google Version %2$s', 'web-stories'),
            new Date().getFullYear(),
            version
          )}
        </AppInfo>
      </Content>
    </LeftRailContainer>
  );
}

export { default as NavMenuButton } from './menuButton';
