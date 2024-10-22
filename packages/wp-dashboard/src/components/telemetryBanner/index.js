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
  useLayoutEffect,
  useRef,
  forwardRef,
  useEffect,
  createPortal,
  useState,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import {
  Banner,
  Checkbox,
  Link,
  Text,
  TextSize,
} from '@googleforcreators/design-system';
import {
  resolveRoute,
  APP_ROUTES,
  useRouteHistory,
} from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import useTelemetryOptIn from '../../effects/useTelemetryOptIn';
import { EDITOR_SETTINGS_ROUTE } from '../../constants';

const Label = styled.label.attrs({ htmlFor: 'telemetry-banner-opt-in' })`
  display: flex;
  cursor: pointer;
`;

const LabelText = styled(Text.Span)`
  margin-bottom: 16px;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const VisitSettingsText = styled(Text.Span)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

const NavLink = styled(Link)`
  display: inline-block;
  margin: 0;
`;

export const TelemetryOptInBanner = forwardRef(
  (
    {
      visible = true,
      disabled = false,
      onChange = () => {},
      onClose = () => {},
      checked = false,
    },
    ref
  ) => {
    const checkboxRef = useRef();
    const focusedCheckboxRef = useRef(false);
    const title = checked
      ? __(
          'Your selection has been updated. Thank you for helping to improve the editor!',
          'web-stories'
        )
      : __('Help improve the editor!', 'web-stories');

    useEffect(() => {
      if (focusedCheckboxRef.current) {
        checkboxRef.current.focus();
      }
    });

    return visible ? (
      <Banner
        closeButtonLabel={__('Dismiss telemetry banner', 'web-stories')}
        onClose={onClose}
        title={title}
        ref={ref}
      >
        {/* eslint-disable-next-line styled-components-a11y/label-has-associated-control -- False positive */}
        <Label>
          <Checkbox
            id="telemetry-banner-opt-in"
            checked={checked}
            disabled={disabled}
            onChange={() => {
              onChange();
              focusedCheckboxRef.current = true;
            }}
            onBlur={() => {
              focusedCheckboxRef.current = false;
            }}
            ref={checkboxRef}
          />
          <LabelText aria-checked={checked} size={TextSize.Small}>
            <TranslateWithMarkup
              mapping={{
                a: (
                  <NavLink
                    size={TextSize.Small}
                    href={__(
                      'https://policies.google.com/privacy',
                      'web-stories'
                    )}
                    rel="noreferrer"
                    target="_blank"
                    aria-label={__(
                      'Learn more by visiting Google Privacy Policy',
                      'web-stories'
                    )}
                  />
                ),
              }}
            >
              {__(
                'Check the box to help us improve the Web Stories plugin by allowing tracking of product usage stats. All data are treated in accordance with <a>Google Privacy Policy</a>.',
                'web-stories'
              )}
            </TranslateWithMarkup>
          </LabelText>
        </Label>
        <VisitSettingsText size={TextSize.XSmall}>
          <TranslateWithMarkup
            mapping={{
              a: (
                <NavLink
                  size={TextSize.XSmall}
                  href={resolveRoute(EDITOR_SETTINGS_ROUTE)}
                  aria-label={__('Settings', 'web-stories')}
                />
              ),
            }}
          >
            {__(
              'You can update your selection later by visiting <a>Settings</a>.',
              'web-stories'
            )}
          </TranslateWithMarkup>
        </VisitSettingsText>
      </Banner>
    ) : null;
  }
);

TelemetryOptInBanner.displayName = 'TelemetryOptInBanner';

TelemetryOptInBanner.propTypes = {
  visible: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export function TelemetryBannerContainer(props) {
  const {
    bannerVisible,
    closeBanner,
    optedIn,
    disabled,
    toggleWebStoriesTrackingOptIn,
  } = useTelemetryOptIn();
  const ref = useRef();

  const previousBannerVisibleRef = useRef(bannerVisible);

  useLayoutEffect(() => {
    if (
      bannerVisible &&
      previousBannerVisibleRef.current === false &&
      ref.current
    ) {
      previousBannerVisibleRef.current = true;
    } else if (!bannerVisible && previousBannerVisibleRef.current) {
      previousBannerVisibleRef.current = false;
    }
  }, [bannerVisible]);

  return (
    <TelemetryOptInBanner
      ref={ref}
      visible={bannerVisible}
      checked={optedIn}
      disabled={disabled}
      onChange={toggleWebStoriesTrackingOptIn}
      onClose={closeBanner}
      {...props}
    />
  );
}

export default function TelemetryBanner() {
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
      [APP_ROUTES.DASHBOARD, APP_ROUTES.TEMPLATES_GALLERY].includes(currentPath)
    ) {
      headerRef.current = document.getElementById('body-view-options-header');
      forceUpdate((value) => !value);
    }
  }, [currentPath, hasAvailableRoutes]);

  if (!headerRef.current) {
    return null;
  }

  return createPortal(<TelemetryBannerContainer />, headerRef.current);
}
