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
import { useLayoutEffect, useRef, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { __, TranslateWithMarkup } from '@web-stories-wp/i18n';
import {
  Banner,
  Checkbox,
  Link,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { useLayoutContext } from '../../../components';
import { useConfig } from '../../config';
import { APP_ROUTES } from '../../../constants';
import { resolveRoute } from '../../router';
import useTelemetryOptIn from './useTelemetryOptIn';

const Label = styled.label.attrs({ htmlFor: 'telemetry-banner-opt-in' })`
  display: flex;
  cursor: pointer;
`;

const LabelText = styled(Text)`
  margin-bottom: 16px;
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const VisitSettingsText = styled(Text)`
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
    const { assetsURL } = useConfig();
    const checkboxRef = useRef();
    const focusOnCheckbox = useRef(false);
    const title = checked
      ? __(
          'Your selection has been updated. Thank you for helping to improve the editor!',
          'web-stories'
        )
      : __('Help improve the editor!', 'web-stories');

    useEffect(() => {
      if (focusOnCheckbox.current) {
        checkboxRef.current.focus();
      }
    });

    return visible ? (
      <Banner
        backgroundUrl={`${assetsURL}images/dashboard/analytics-banner-bg.png`}
        closeButtonLabel={__('Dismiss telemetry banner', 'web-stories')}
        onClose={onClose}
        title={title}
        ref={ref}
        isDashboard
      >
        <Label>
          <Checkbox
            id="telemetry-banner-opt-in"
            checked={checked}
            disabled={disabled}
            onChange={() => {
              onChange();
              focusOnCheckbox.current = true;
            }}
            onBlur={() => {
              focusOnCheckbox.current = false;
            }}
            ref={checkboxRef}
          />
          <LabelText
            forwardedAs="span"
            aria-checked={checked}
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
          >
            <TranslateWithMarkup
              mapping={{
                a: (
                  <NavLink
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
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
        <VisitSettingsText
          forwardedAs="span"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
        >
          <TranslateWithMarkup
            mapping={{
              a: (
                <NavLink
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
                  href={resolveRoute(APP_ROUTES.EDITOR_SETTINGS)}
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

export default function TelemetryBannerContainer(props) {
  const {
    bannerVisible,
    closeBanner,
    optedIn,
    disabled,
    toggleWebStoriesTrackingOptIn,
  } = useTelemetryOptIn();
  const ref = useRef();

  const {
    actions: { setTelemetryBannerOpen },
  } = useLayoutContext();

  const previousBannerVisible = useRef(bannerVisible);

  useLayoutEffect(() => {
    if (
      bannerVisible &&
      previousBannerVisible.current === false &&
      ref.current
    ) {
      setTelemetryBannerOpen(true);
      previousBannerVisible.current = true;
    } else if (!bannerVisible && previousBannerVisible.current) {
      setTelemetryBannerOpen(false);
      previousBannerVisible.current = false;
    }
  }, [bannerVisible, setTelemetryBannerOpen]);

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
