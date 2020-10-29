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
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { TranslateWithMarkup } from '../../../../i18n';
import { TypographyPresets, useLayoutContext } from '../../../components';
import { Close as CloseSVG } from '../../../icons';
import { useConfig } from '../../config';
import useTelemetryOptIn from './useTelemetryOptIn';

const Banner = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
  padding-top: 24px;
  background-image: url('${({ backgroundUrl }) => backgroundUrl}');
  background-size: cover;
  border-radius: 8px;
`;

const Header = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  display: inline-block;
  font-size: 18px;
  font-weight: ${({ theme }) => theme.internalTheme.typography.weight.normal};
  line-height: 24px;
  margin-bottom: 13px;
`;

const Label = styled.label.attrs({ htmlFor: 'telemetry-banner-opt-in' })`
  display: flex;
`;

export const LabelText = styled.span`
  ${TypographyPresets.Small};
  color: ${({ theme }) => theme.internalTheme.colors.gray400};
  margin-bottom: 16px;
  max-width: 600px;
`;

const VisitSettingsText = styled(LabelText)``;

const CheckBox = styled.input.attrs({
  type: 'checkbox',
  id: 'telemetry-banner-opt-in',
})`
  height: 18px;
  width: 18px;
  margin: 5px 12px 0 0;
`;

const CloseIcon = styled(CloseSVG)`
  color: ${({ theme }) => theme.internalTheme.colors.white};
  margin: 0 auto;
  padding: 2px;
  width: 14px;
  height: auto;
  display: inline-block;
`;

const ToggleButton = styled.button.attrs({
  ['aria-label']: __(
    'Dismiss telemetry data sharing opt-in banner',
    'web-stories'
  ),
})`
  display: flex;
  height: 16px;
  width: 16px;
  border: ${({ theme }) => theme.internalTheme.borders.transparent};
  border-radius: 50%;
  padding: 0;
  background: ${({ theme }) => theme.internalTheme.colors.gray200};
  cursor: pointer;
  float: right;
  margin-right: 14px;

  &:hover svg {
    color: ${({ theme }) => theme.internalTheme.colors.gray50};
  }
  &:active svg {
    color: ${({ theme }) => theme.internalTheme.colors.gray50};
  }
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

    useEffect(() => {
      if (focusOnCheckbox.current) {
        checkboxRef.current.focus();
      }
    });

    return visible ? (
      <Banner
        ref={ref}
        backgroundUrl={`${assetsURL}images/dashboard/analytics-banner-bg.png`}
      >
        <Header>
          <Title>
            {checked
              ? __(
                  'Your selection has been updated. Thank you for helping to improve the editor!',
                  'web-stories'
                )
              : __('Help improve the editor!', 'web-stories')}
          </Title>
          <ToggleButton onClick={onClose}>
            <CloseIcon />
          </ToggleButton>
        </Header>
        <Label>
          <CheckBox
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
          <LabelText aria-checked={checked}>
            <TranslateWithMarkup
              mapping={{
                a: (
                  //eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a
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
        <VisitSettingsText>
          {__(
            'You can update your selection later by visiting Settings.',
            'web-stories'
          )}
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
    actions: { setTelemetryBannerOpen, setTelemetryBannerHeight },
  } = useLayoutContext();

  const previousBannerVisible = useRef(bannerVisible);

  useLayoutEffect(() => {
    if (
      bannerVisible &&
      previousBannerVisible.current === false &&
      ref.current
    ) {
      setTelemetryBannerOpen(true);
      setTelemetryBannerHeight(ref.current.offsetHeight);
      previousBannerVisible.current = true;
    } else if (!bannerVisible && previousBannerVisible.current) {
      setTelemetryBannerOpen(false);
      previousBannerVisible.current = false;
    }
  }, [bannerVisible, setTelemetryBannerOpen, setTelemetryBannerHeight]);

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
