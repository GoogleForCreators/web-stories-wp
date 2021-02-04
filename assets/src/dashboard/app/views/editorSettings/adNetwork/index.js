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
import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import styled from 'styled-components';
import {
  InlineForm,
  InlineLink,
  SettingForm,
  SettingHeading,
  VisuallyHiddenLabel,
  TextInputHelperText,
} from '../components';
import { Dropdown } from '../../../../components';
import { AD_NETWORK_TYPE, DROPDOWN_TYPES } from '../../../../constants';
import { TranslateWithMarkup } from '../../../../../i18n';
import { trackClick } from '../../../../../tracking';
import { THEME_CONSTANTS } from '../../../../../design-system';

const AdNetworkDropdown = styled(Dropdown)`
  & button {
    border: ${({ theme, error }) =>
      error
        ? theme.DEPRECATED_THEME.borders.danger
        : theme.DEPRECATED_THEME.borders.gray100};

    &:active:enabled {
      border: ${({ theme, error }) =>
        error
          ? theme.DEPRECATED_THEME.borders.danger
          : theme.DEPRECATED_THEME.borders.action};
    }
  }
`;
const AdNetworkSettingForm = styled(SettingForm)`
  padding-bottom: 0;
`;

export const TEXT = {
  SECTION_HEADING: __('Monetization', 'web-stories'),
  SLOT_ID_LABEL: __('Monetization type', 'web-stories'),
  HELPER_MESSAGE_NONE: __(
    'Monetize your content by showing ads in your Web Stories. <a>Learn more</a>.',
    'web-stories'
  ),
  HELPER_MESSAGE_ADSENSE: __(
    'Learn more about <a>how to monetize your Web Stories</a> using AdSense.',
    'web-stories'
  ),
  HELPER_MESSAGE_ADMANAGER: __(
    'Learn how to <a>enable programmatic demand in Web Stories</a> through Ad Manager.',
    'web-stories'
  ),
  HELPER_LINK_NONE: __(
    'https://amp.dev/documentation/guides-and-tutorials/develop/advertise_amp_stories/',
    'web-stories'
  ),
  HELPER_LINK_ADSENSE: __(
    'https://support.google.com/adsense/answer/10175505',
    'web-stories'
  ),
  HELPER_LINK_ADMANAGER: __(
    'https://support.google.com/admanager/answer/9416436',
    'web-stories'
  ),
};

const OPTIONS = [
  {
    label: __('None', 'web-stories'),
    value: AD_NETWORK_TYPE.NONE,
  },
  {
    label: __('Google AdSense', 'web-stories'),
    value: AD_NETWORK_TYPE.ADSENSE,
  },
  {
    label: __('Google Ad Manager', 'web-stories'),
    value: AD_NETWORK_TYPE.ADMANAGER,
  },
];

function AdNetworkSettings({ adNetwork: adNetworkRaw, handleUpdate }) {
  const [adNetwork, setAdNetwork] = useState(adNetworkRaw);

  useEffect(() => setAdNetwork(adNetworkRaw), [adNetworkRaw]);

  const message = useMemo(() => {
    if (AD_NETWORK_TYPE.ADMANAGER === adNetwork) {
      return TEXT.HELPER_MESSAGE_ADMANAGER;
    }

    if (AD_NETWORK_TYPE.ADSENSE === adNetwork) {
      return TEXT.HELPER_MESSAGE_ADSENSE;
    }

    return null;
  }, [adNetwork]);

  const link = useMemo(() => {
    if (AD_NETWORK_TYPE.ADMANAGER === adNetwork) {
      return TEXT.HELPER_LINK_ADMANAGER;
    }

    if (AD_NETWORK_TYPE.ADSENSE === adNetwork) {
      return TEXT.HELPER_LINK_ADSENSE;
    }

    return null;
  }, [adNetwork]);

  const handleMonetizationClick = useCallback(
    (evt) =>
      trackClick(evt, 'monetization', 'dashboard', TEXT.HELPER_LINK_NONE),
    []
  );
  const handleAdNetworkClick = useCallback(
    (evt) => trackClick(evt, 'monetization', 'dashboard', link),
    [link]
  );

  return (
    <AdNetworkSettingForm onSubmit={(e) => e.preventDefault()}>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>
        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          <TranslateWithMarkup
            mapping={{
              a: (
                <InlineLink
                  href={TEXT.HELPER_LINK_NONE}
                  rel="noreferrer"
                  target="_blank"
                  onClick={handleMonetizationClick}
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                  as="a"
                />
              ),
            }}
          >
            {TEXT.HELPER_MESSAGE_NONE}
          </TranslateWithMarkup>
        </TextInputHelperText>
      </div>
      <div>
        <InlineForm>
          <VisuallyHiddenLabel>{TEXT.SLOT_ID_LABEL}</VisuallyHiddenLabel>
          <AdNetworkDropdown
            ariaLabel={TEXT.SLOT_ID_LABEL}
            items={OPTIONS}
            type={DROPDOWN_TYPES.MENU}
            value={adNetwork}
            onChange={(newAdNetwork) => handleUpdate(newAdNetwork.value)}
          />
        </InlineForm>
        {message && (
          <TextInputHelperText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            <TranslateWithMarkup
              mapping={{
                a: (
                  <InlineLink
                    href={link}
                    rel="noreferrer"
                    target="_blank"
                    onClick={handleAdNetworkClick}
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                    as="a"
                  />
                ),
              }}
            >
              {message}
            </TranslateWithMarkup>
          </TextInputHelperText>
        )}
      </div>
    </AdNetworkSettingForm>
  );
}
AdNetworkSettings.propTypes = {
  handleUpdate: PropTypes.func,
  adNetwork: PropTypes.oneOf(Object.values(AD_NETWORK_TYPE)),
};

export default AdNetworkSettings;
