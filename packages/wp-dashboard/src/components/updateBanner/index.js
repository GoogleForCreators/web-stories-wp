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
  useCallback,
} from '@googleforcreators/react';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import {
  Banner,
  Link,
  localStore,
  Text,
} from '@googleforcreators/design-system';
import {
  APP_ROUTES,
  useRouteHistory,
  useConfig,
} from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import useTelemetryOptIn from '../../effects/useTelemetryOptIn';
import { EDITOR_SETTINGS_ROUTE } from '../../constants';

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

function NoLink({ children }) {
  return children;
}

// The value associated with this key indicates if the user has interacted with
// the banner previously. If they have, we do not show the banner again for 2 days.
const LOCAL_STORAGE_KEY = 'web_stories_update_banner_closed';

function getStateFromLocalStorage() {
  const storageValue = localStore.getItemByKey(LOCAL_STORAGE_KEY);

  if (!storageValue) {
    return true;
  }

  if (new Date().getTime() > storageValue) {
    localStore.setItemByKey(LOCAL_STORAGE_KEY, null);
    return true;
  }

  return false;
}

export function UpdateBannerContainer() {
  const { bannerVisible: hasTelemetryBanner } = useTelemetryOptIn();
  const {
    plugins: { 'web-stories': webStories = {} },
  } = useConfig();
  const { needsUpdate, updateLink } = webStories;

  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(getStateFromLocalStorage() && needsUpdate);
  }, [needsUpdate]);

  const onClose = useCallback(() => {
    const dayInMs = 8.64e7;
    const expiry = new Date().getTime() + 2 * dayInMs;
    localStore.setItemByKey(LOCAL_STORAGE_KEY, expiry);
    setIsVisible(false);
  }, []);

  if (!isVisible) {
    return null;
  }

  if (hasTelemetryBanner) {
    return null;
  }

  const UpdateLink = updateLink ? StyledLink : NoLink;

  return (
    <StyledBanner
      closeButtonLabel={__('Dismiss update notification', 'web-stories')}
      onClose={onClose}
      title={__('Update available.', 'web-stories')}
      ref={ref}
    >
      <Text.Paragraph>
        <TranslateWithMarkup
          mapping={{
            a: <UpdateLink href={updateLink} />,
          }}
        >
          {__(
            'A new version of the plugin is available. <a>Please update now</a>.',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Text.Paragraph>
    </StyledBanner>
  );
}

export default function UpdateBanner() {
  const { currentPath, hasAvailableRoutes } = useRouteHistory(({ state }) => ({
    currentPath: state.currentPath,
    hasAvailableRoutes: state.availableRoutes.length > 0,
  }));
  const headerEl = useRef(null);
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
      headerEl.current = document.getElementById('body-view-options-header');
      forceUpdate((value) => !value);
    }
  }, [currentPath, hasAvailableRoutes]);

  if (!headerEl.current) {
    return null;
  }

  return createPortal(<UpdateBannerContainer />, headerEl.current);
}
