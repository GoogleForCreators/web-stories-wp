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
import {
  useRef,
  useEffect,
  createPortal,
  useState,
} from '@googleforcreators/react';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { Banner, Link, Text } from '@googleforcreators/design-system';
import {
  APP_ROUTES,
  resolveRoute,
  useConfig,
  useRouteHistory,
} from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import { trackClick } from '@googleforcreators/tracking';
import { EDITOR_SETTINGS_ROUTE } from '../../constants';
import useEditorSettings from '../editorSettings/useEditorSettings.js';

const StyledBanner = styled(Banner)`
  background: ${({ theme }) => theme.colors.interactiveBg.brandNormal};
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.interactiveFg.brandNormal};
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.interactiveFg.brandHover};
  }

  &:focus {
    color: ${({ theme }) => theme.colors.interactiveFg.brandPress};
  }
`;

function GoogleAnalytics4BannerContainer() {
  const {
    capabilities: { canManageSettings } = {},
    plugins: { siteKit = {} },
  } = useConfig();

  const fetchSettings = useEditorSettings(
    ({
      actions: {
        settingsApi: { fetchSettings },
      },
    }) => fetchSettings
  );

  useEffect(() => {
    if (canManageSettings) {
      fetchSettings();
    }
  }, [canManageSettings, fetchSettings]);

  const isUsingUniversalAnalytics = useEditorSettings(
    ({
      state: {
        settings: { googleAnalyticsId },
      },
    }) => googleAnalyticsId?.toLowerCase().startsWith('ua-')
  );

  const { currentPath } = useRouteHistory(({ state: { currentPath } }) => ({
    currentPath,
  }));

  const ref = useRef();

  if (siteKit.analyticsActive) {
    return null;
  }

  if (!isUsingUniversalAnalytics) {
    return null;
  }

  if (currentPath === EDITOR_SETTINGS_ROUTE) {
    return null;
  }

  return (
    <StyledBanner
      title={__('Update your Google Analytics configuration.', 'web-stories')}
      ref={ref}
    >
      <Text.Paragraph>
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                href={__(
                  'https://support.google.com/analytics/answer/11583528?hl=en',
                  'web-stories'
                )}
                rel="noreferrer"
                target="_blank"
                onClick={(evt) => trackClick(evt, 'click_ua_deprecation_docs')}
              />
            ),
            a2: (
              <Link
                href={__(
                  'https://support.google.com/analytics/answer/10089681?hl=en',
                  'web-stories'
                )}
                rel="noreferrer"
                target="_blank"
                onClick={(evt) => trackClick(evt, 'click_ga4_docs')}
              />
            ),
          }}
        >
          {__(
            'Universal Analytics <a>stopped processing new visits</a> starting <b>July 1, 2023</b>. We recommend switching to <a2>Google Analytics 4</a2> (GA4).',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Text.Paragraph>
      <Text.Paragraph>
        <TranslateWithMarkup
          mapping={{
            a: <StyledLink href={resolveRoute(EDITOR_SETTINGS_ROUTE)} />,
          }}
        >
          {__('<a>Update your settings now</a>.', 'web-stories')}
        </TranslateWithMarkup>
      </Text.Paragraph>
    </StyledBanner>
  );
}

export default function GoogleAnalytics4Banner() {
  const { currentPath, hasAvailableRoutes } = useRouteHistory(({ state }) => ({
    currentPath: state.currentPath,
    hasAvailableRoutes: state.availableRoutes.length > 0,
  }));
  const headerRef = useRef(null);
  const [, forceUpdate] = useState(false);

  useEffect(() => {
    if (!hasAvailableRoutes) {
      return;
    }

    if (
      [
        APP_ROUTES.DASHBOARD,
        APP_ROUTES.TEMPLATES_GALLERY,
        EDITOR_SETTINGS_ROUTE,
      ].includes(currentPath)
    ) {
      headerRef.current = document.getElementById('body-view-options-header');
      forceUpdate((value) => !value);
    }
  }, [currentPath, hasAvailableRoutes]);

  // eslint-disable-next-line react-hooks/refs -- FIXME
  if (!headerRef.current) {
    return null;
  }

  // eslint-disable-next-line react-hooks/refs -- FIXME
  return createPortal(<GoogleAnalytics4BannerContainer />, headerRef.current);
}
