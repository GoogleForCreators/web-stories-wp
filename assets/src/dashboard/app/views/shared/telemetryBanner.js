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
import PropTypes from 'prop-types';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { TypographyPresets } from '../../../components';
import { Close as CloseSVG } from '../../../icons';
import { ICON_METRICS } from '../../../constants';
import { useConfig } from '../../config';
import useTelemetryOptIn from './useTelemetryOptIn';

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 161px;
  margin: 0 20px;
  padding-top: 24px;
  background-image: url('${({ $backgroundUrl }) => $backgroundUrl}');
  border-radius: 8px;
`;

const Header = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  display: inline-block;
  font-size: 18px;
  font-weight: ${({ theme }) => theme.typography.weight.normal};
  line-height: 24px;
  margin-bottom: 13px;
`;

const Label = styled.label.attrs({ htmlFor: 'telemetry-banner-opt-in' })`
  display: flex;
`;

export const LabelText = styled.span`
  ${TypographyPresets.Small};
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 16px;
  max-width: 530px;
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

const CloseIcon = styled(CloseSVG).attrs(ICON_METRICS.TELEMETRY_BANNER_EXIT)`
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ToggleButton = styled.button.attrs({
  ['aria-label']: __('Dismiss Notice', 'web-stories'),
})`
  border: none;
  padding: 4px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray200};
  cursor: pointer;
  float: right;
  margin-right: 14px;

  &:hover svg {
    color: ${({ theme }) => theme.colors.gray50};
  }
  &:active svg {
    color: ${({ theme }) => theme.colors.gray50};
  }
`;

export function TelemetryOptInBanner({
  visible = true,
  disabled = false,
  onChange = () => {},
  onClose = () => {},
  checked = false,
}) {
  const { assetsURL } = useConfig();

  return visible ? (
    <Banner $backgroundUrl={`${assetsURL}images/analytics-banner-bg.png`}>
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
        <CheckBox checked={checked} disabled={disabled} onChange={onChange} />
        <LabelText aria-checked={checked}>
          {__(
            'Check the box to help us improve the Web Stories plugin by allowing tracking of product usage stats. All data are treated in accordance with Google Privacy Policy.',
            'web-stories'
          )}
          &nbsp;
          <a
            href={__('https://policies.google.com/privacy', 'web-stories')}
            rel="noreferrer"
            target="_blank"
          >
            {__('Learn more', 'web-stories')}
            {'.'}
          </a>
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

  return (
    <TelemetryOptInBanner
      visible={bannerVisible}
      checked={optedIn}
      disabled={disabled}
      onChange={toggleWebStoriesTrackingOptIn}
      onClose={closeBanner}
      {...props}
    />
  );
}
