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
import { useState, useEffect } from 'react';
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
  FormContainer,
  HelperText,
  InlineForm,
  InlineLink,
  SettingForm,
  SettingHeading,
  VisuallyHiddenLabel,
} from '../components';
import { Dropdown } from '../../../../components';
import { DROPDOWN_TYPES } from '../../../../constants';
import { TranslateWithMarkup } from '../../../../../i18n';

const SortDropdown = styled(Dropdown)`
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
};

export const LINK = {
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
    value: 'none',
  },
  {
    label: __('Google AdSense', 'web-stories'),
    value: 'adsense',
  },
  {
    label: __('Google Ad manager', 'web-stories'),
    value: 'admanager',
  },
];

function AdNetworkSettings({ adNetwork: adNetworkRaw, handleUpdate }) {
  const [adNetwork, setAdNetwork] = useState(adNetworkRaw);

  useEffect(() => {
    setAdNetwork(adNetworkRaw);
  }, [adNetworkRaw]);

  let message;
  let link;

  switch (adNetwork) {
    case 'admanager':
      message = TEXT.HELPER_MESSAGE_ADMANAGER;
      link = LINK.HELPER_LINK_ADMANAGER;
      break;
    case 'adsense':
      message = TEXT.HELPER_MESSAGE_ADSENSE;
      link = LINK.HELPER_LINK_ADSENSE;
      break;
    case 'none':
    default:
      message = TEXT.HELPER_MESSAGE_NONE;
      link = LINK.HELPER_LINK_NONE;
      break;
  }

  return (
    <SettingForm onSubmit={(e) => e.preventDefault()}>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>
        <HelperText>
          <TranslateWithMarkup
            mapping={{
              a: <InlineLink href={link} rel="noreferrer" target="_blank" />,
            }}
          >
            {message}
          </TranslateWithMarkup>
        </HelperText>
      </div>
      <FormContainer>
        <InlineForm>
          <VisuallyHiddenLabel htmlFor="adManagerSlotId">
            {TEXT.SLOT_ID_LABEL}
          </VisuallyHiddenLabel>
          <SortDropdown
            ariaLabel={TEXT.SLOT_ID_LABEL}
            items={OPTIONS}
            type={DROPDOWN_TYPES.MENU}
            value={adNetwork}
            onChange={(newAdNetwork) => handleUpdate(newAdNetwork.value)}
          />
        </InlineForm>
      </FormContainer>
    </SettingForm>
  );
}
AdNetworkSettings.propTypes = {
  handleUpdate: PropTypes.func,
  adNetwork: PropTypes.string,
};

export default AdNetworkSettings;
