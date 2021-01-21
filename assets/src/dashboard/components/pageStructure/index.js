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

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BEZIER } from '../../../animation';
import { trackEvent } from '../../../tracking';
import { useConfig } from '../../app/config';
import { resolveRoute, useRouteHistory } from '../../app/router';
import { PRIMARY_PATHS, SECONDARY_PATHS, Z_INDEX } from '../../constants';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  Button,
  Text,
  THEME_CONSTANTS,
  WebStoriesLogo,
} from '../../../design-system';
import { DASHBOARD_LEFT_NAV_WIDTH } from '../../constants/pageStructure';
import useFocusOut from '../../utils/useFocusOut';
import { useNavContext } from '../navProvider';
import {
  AppInfo,
  Content,
  Header,
  NavButton,
  NavLinkContent,
  NavList,
  NavListItem,
  PathName,
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

  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.tablet} {
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
  background: ${({ theme }) => theme.colors.bg.primary};
  z-index: ${Z_INDEX.LAYOUT_FIXED};
  transition: transform 0.25s ${BEZIER.outCubic}, opacity 0.25s linear;

  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.tablet} {
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

  const onCreateNewStoryClick = useCallback(async () => {
    await trackEvent('create_new_story', 'dashboard');
  }, []);

  const onExternalLinkClick = useCallback((path) => {
    trackEvent(path.trackingEvent, 'dashboard');
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
        <Header as="h1">
          <WebStoriesLogo title={__('Web Stories', 'web-stories')} />
        </Header>
        <Content>
          <Button
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            href={newStoryURL}
            onClick={onCreateNewStoryClick}
          >
            {__('Create New Story', 'web-stories')}
          </Button>
        </Content>
        <Content>
          <NavList>
            {enabledPrimaryPaths.map((path) => {
              const isActive = path.value === state.currentPath;
              const Icon = isActive ? path.IconActive : path.Icon;

              return (
                <NavListItem key={path.value}>
                  <NavButton
                    type={BUTTON_TYPES.TERTIARY}
                    size={BUTTON_SIZES.SMALL}
                    active={path.value === state.currentPath}
                    href={resolveRoute(path.value)}
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
                      onClick: () => onExternalLinkClick(path),
                    })}
                  >
                    <NavLinkContent>
                      {Icon && <Icon width="22px" />}
                      <PathName as="span">{path.label}</PathName>
                    </NavLinkContent>
                  </NavButton>
                </NavListItem>
              );
            })}
          </NavList>
        </Content>
      </div>
      <Content>
        <NavList>
          {SECONDARY_PATHS.map((path) => (
            <NavListItem key={path.value}>
              <NavButton
                type={BUTTON_TYPES.TERTIARY}
                size={BUTTON_SIZES.SMALL}
                active={path.value === state.currentPath}
                href={resolveRoute(path.value)}
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
                  onClick: () => onExternalLinkClick(path),
                })}
              >
                <NavLinkContent>
                  <Text as="span">{path.label}</Text>
                </NavLinkContent>
              </NavButton>
            </NavListItem>
          ))}
        </NavList>
        <AppInfo size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
          {sprintf(
            /* translators: %s: Current Year, %v: App Version */
            __('\u00A9 %s Google Version %v', 'web-stories'),
            new Date().getFullYear(),
            version
          )}
        </AppInfo>
      </Content>
    </LeftRailContainer>
  );
}

export { default as NavMenuButton } from './menuButton';
