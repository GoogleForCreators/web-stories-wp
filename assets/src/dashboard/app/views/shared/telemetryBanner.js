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

const Banner = styled.div.attrs({ id: 'dillon' })`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 161px;
  margin: 0 20px;
  background-image: url('/wp-content/plugins/web-stories/assets/images/analytics-banner-bg.png');
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
  ['aria-label']: __('Close Telemetry Banner', 'web-stories'),
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

export default function TelemetryBanner({
  visible = true,
  disabled = false,
  onChange = () => {},
  onClose = () => {},
  checked = false,
}) {
  return visible ? (
    <Banner>
      <Header>
        <Title>{__('Help improve the editor!', 'web-stories')}</Title>
        <ToggleButton onClick={onClose}>
          <CloseIcon />
        </ToggleButton>
      </Header>
      <Label>
        <CheckBox checked={checked} disabled={disabled} onChange={onChange} />
        <LabelText aria-checked={checked}>
          {__(
            'Check the box to help us improve the Web Stories plugin by allowing tracking of product usage stats. All data are treated in accordance with',
            'web-stories'
          )}
          &nbsp;
          <a
            href={__('https://policies.google.com/privacy', 'web-stories')}
            rel="noreferrer"
            target="_blank"
          >
            {__('Google Privacy Policy', 'web-stories')}
            {'.'}
          </a>
        </LabelText>
      </Label>
      <VisitSettingsText>
        {__('You can update your selection later by visiting', 'web-stories')}
        &nbsp;
        <a
          href={`${window.location.href}editor-settings`}
          rel="noreferrer"
          target="_blank"
        >
          {__('Settings', 'web-stories')}
          {'.'}
        </a>
      </VisitSettingsText>
    </Banner>
  ) : null;
}

TelemetryBanner.propTypes = {
  visible: PropTypes.boolean,
  checked: PropTypes.boolean,
  disabled: PropTypes.boolean,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
};
