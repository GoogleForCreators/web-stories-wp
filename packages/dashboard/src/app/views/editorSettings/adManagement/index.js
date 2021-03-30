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
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { __, TranslateWithMarkup } from '@web-stories-wp/i18n';
import { trackClick, trackEvent } from '@web-stories-wp/tracking';
/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '@web-stories-wp/design-system';
import { AD_NETWORK_TYPE } from '../../../../constants';
import {
  InlineLink,
  MultilineForm,
  SettingHeading,
  TextInputHelperText,
} from '../components';
import AdNetworkSettings from './adNetwork';
import GoogleAdManagerSettings from './googleAdManager';
import GoogleAdSenseSettings from './googleAdSense';

export const TEXT = {
  SECTION_HEADING: __('Monetization', 'web-stories'),
  HELPER_MESSAGE_NONE: __(
    'Monetize your content by showing ads in your Web Stories. <a>Learn more</a>.',
    'web-stories'
  ),
  HELPER_LINK_NONE: __(
    'https://amp.dev/documentation/guides-and-tutorials/develop/advertise_amp_stories/',
    'web-stories'
  ),
};

function AdManagement({
  updateSettings,
  adNetwork,
  publisherId,
  adSenseSlotId,
  adManagerSlotId,
}) {
  const handleMonetizationClick = useCallback(
    (evt) =>
      trackClick(evt, 'monetization', 'dashboard', TEXT.HELPER_LINK_NONE),
    []
  );

  const handleUpdateAdSensePublisherId = useCallback(
    (newAdSensePublisherId) =>
      updateSettings({ adSensePublisherId: newAdSensePublisherId }),
    [updateSettings]
  );

  const handleUpdateAdSenseSlotId = useCallback(
    (newAdSenseSlotId) => updateSettings({ adSenseSlotId: newAdSenseSlotId }),
    [updateSettings]
  );

  const handleUpdateAdManagerSlotId = useCallback(
    (newAdManagerSlotId) =>
      updateSettings({ adManagerSlotId: newAdManagerSlotId }),
    [updateSettings]
  );

  const handleUpdateAdNetwork = useCallback(
    (newAdNetwork) => {
      updateSettings({ adNetwork: newAdNetwork });
      trackEvent('change_ad_network', {
        name: newAdNetwork,
      });
    },
    [updateSettings]
  );

  return (
    <MultilineForm onSubmit={(e) => e.preventDefault()}>
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
                />
              ),
            }}
          >
            {TEXT.HELPER_MESSAGE_NONE}
          </TranslateWithMarkup>
        </TextInputHelperText>
      </div>
      <div>
        <AdNetworkSettings
          handleUpdate={handleUpdateAdNetwork}
          adNetwork={adNetwork}
        />

        {AD_NETWORK_TYPE.ADSENSE === adNetwork && (
          <GoogleAdSenseSettings
            handleUpdatePublisherId={handleUpdateAdSensePublisherId}
            handleUpdateSlotId={handleUpdateAdSenseSlotId}
            publisherId={publisherId}
            slotId={adSenseSlotId}
          />
        )}
        {AD_NETWORK_TYPE.ADMANAGER === adNetwork && (
          <GoogleAdManagerSettings
            handleUpdate={handleUpdateAdManagerSlotId}
            slotId={adManagerSlotId}
          />
        )}
      </div>
    </MultilineForm>
  );
}

AdManagement.propTypes = {
  updateSettings: PropTypes.func.isRequired,
  adNetwork: PropTypes.string.isRequired,
  publisherId: PropTypes.string,
  adSenseSlotId: PropTypes.string,
  adManagerSlotId: PropTypes.string,
};

export default AdManagement;
