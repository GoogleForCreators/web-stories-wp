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
  InlineForm,
  SettingForm,
  SettingHeading,
  VisuallyHiddenLabel,
} from '../components';
import { Dropdown } from '../../../../components';
import { DROPDOWN_TYPES } from '../../../../constants';

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
  SECTION_HEADING: __('Adloader', 'web-stories'),
  SLOT_ID_LABEL: __('Adloader type', 'web-stories'),
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

  return (
    <SettingForm onSubmit={(e) => e.preventDefault()}>
      <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>
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
