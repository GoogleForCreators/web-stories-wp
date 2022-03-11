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
import {
  useCallback,
  useEffect,
  useFocusOut,
  useLayoutEffect,
  useRef,
} from '@googleforcreators/react';
import { trackClick, trackEvent } from '@googleforcreators/tracking';
import { getTemplateMetaData } from '@googleforcreators/templates';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  LogoWithTypeCircleColor,
  NotificationBubble,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import styled from 'styled-components';
import { differenceInDays, getOptions, toDate } from '@googleforcreators/date';

/**
 * Internal dependencies
 */
import { resolveRoute, useRouteHistory } from '../../app/router';
import { useNavContext } from '../navProvider';
import { useConfig } from '../../app';
import { APP_ROUTES, PRIMARY_PATHS } from '../../constants';
import {
  AppInfo,
  Content,
  Header,
  NavLink,
  NavList,
  NavListItem,
  PathName,
} from './navigationComponents';
import { LeftRailContainer } from './pageStructureComponents';

const StyledNotificationBubble = styled(NotificationBubble)`
  position: absolute;
  top: 0;
  left: 11px;
  transform: translateY(-50%);

  /* prevent active color from applying to bubble inner text */
  && > span,
  &&:hover > span {
    color: ${({ theme }) => theme.colors.bg.primary};
  }
`;

const IconWrap = styled.div`
  position: relative;
`;

const NEW_TEMPLATE_THRESHOLD_IN_DAYS = 60;

function getNewTemplatesMetaData(metaDataEntries, days) {
  const currentDate = toDate(new Date(), getOptions());
  return metaDataEntries.filter((metaData) => {
    const creationDate = toDate(metaData.creationDate, getOptions());
    const deltaDays = differenceInDays(currentDate, creationDate);
    return deltaDays < days;
  });
}

function LeftRail() {
  const { state } = useRouteHistory();
  const {
    newStoryURL,
    version,
    leftRailSecondaryNavigation,
    canViewDefaultTemplates,
    styleConstants: { topOffset },
  } = useConfig();
  const leftRailRef = useRef(null);
  const upperContentRef = useRef(null);

  const {
    state: { sideBarVisible, numNewTemplates },
    actions: { toggleSideBar, updateNumNewTemplates },
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

  // See how many templates are new based on the current date
  useEffect(() => {
    let mounted = true;

    async function refreshNewTemplateCount() {
      const metaData = await getTemplateMetaData();
      if (metaData) {
        const newTemplates = getNewTemplatesMetaData(
          metaData,
          NEW_TEMPLATE_THRESHOLD_IN_DAYS
        );
        if (mounted) {
          updateNumNewTemplates(newTemplates.length);
        }
      }
    }

    refreshNewTemplateCount();

    return () => {
      mounted = false;
    };
  }, [updateNumNewTemplates]);

  return (
    <LeftRailContainer
      onClickCapture={onContainerClickCapture}
      ref={leftRailRef}
      isOpen={sideBarVisible}
      topOffset={topOffset}
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
            {PRIMARY_PATHS.map(({ Icon, ...path }) => {
              const isTemplatesDisabled =
                path.value === APP_ROUTES.TEMPLATES_GALLERY &&
                !canViewDefaultTemplates;
              if (isTemplatesDisabled) {
                return null;
              }
              const isNotificationBubbleEnabled =
                path.value === APP_ROUTES.TEMPLATES_GALLERY &&
                state.currentPath !== APP_ROUTES.TEMPLATES_GALLERY;
              const appendNewBadgeToLable = (label) =>
                isNotificationBubbleEnabled
                  ? sprintf(
                      /* translators: 1: current page. 2: number of new templates. */
                      __('%1$s (%2$s new)', 'web-stories'),
                      label,
                      numNewTemplates
                    )
                  : label;

              return (
                <NavListItem key={path.value}>
                  <NavLink
                    active={path.value === state.currentPath}
                    href={resolveRoute(path.value)}
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                    isBold
                    isIconLink={Boolean(Icon)}
                    aria-label={appendNewBadgeToLable(
                      path.value === state.currentPath
                        ? sprintf(
                            /* translators: %s: the current page, for example "Dashboard". */
                            __('%s (active view)', 'web-stories'),
                            path.label
                          )
                        : path.label
                    )}
                    {...(path.isExternal && {
                      target: '_blank',
                      onClick: (evt) => onExternalLinkClick(evt, path),
                    })}
                  >
                    <IconWrap>
                      {Icon && <Icon width="22px" />}
                      {isNotificationBubbleEnabled && numNewTemplates > 0 && (
                        <StyledNotificationBubble
                          notificationCount={numNewTemplates}
                          isSmall
                        />
                      )}
                    </IconWrap>

                    <PathName as="span" isBold>
                      {path.label}
                    </PathName>
                  </NavLink>
                </NavListItem>
              );
            })}
          </NavList>
        </Content>
      </div>
      <Content>
        {leftRailSecondaryNavigation && (
          <NavList>
            {leftRailSecondaryNavigation.map((path) => (
              <NavListItem key={path.value}>
                <NavLink
                  active={path.value === state.currentPath}
                  href={resolveRoute(path.value)}
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                  aria-label={
                    path.value === state.currentPath
                      ? sprintf(
                          /* translators: %s: the current page, for example "Dashboard". */
                          __('%s (active view)', 'web-stories'),
                          path.label
                        )
                      : path.label
                  }
                  {...(path.isExternal && {
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
        )}
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

export default LeftRail;
