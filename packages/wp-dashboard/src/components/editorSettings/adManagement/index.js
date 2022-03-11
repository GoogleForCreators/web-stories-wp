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
import { useCallback, useMemo } from '@googleforcreators/react';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick, trackEvent } from '@googleforcreators/tracking';
import { THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  InlineLink,
  MultilineForm,
  SettingHeading,
  SettingSubheading,
  TextInputHelperText,
} from '../components';
import { AD_NETWORK_TYPE } from '../../../constants';
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
  SITE_KIT_NOT_INSTALLED: __(
    'Install <a>Site Kit by Google</a> to easily enable Google AdSense for Web Stories.',
    'web-stories'
  ),
  SITE_KIT_INSTALLED: __(
    'Use Site Kit by Google to easily<a>activate Google AdSense</a> for Web Stories.',
    'web-stories'
  ),
  SITE_KIT_IN_USE: __(
    'Site Kit by Google has already enabled Google AdSense for your Web Stories, all changes to your ad configuration should occur there.',
    'web-stories'
  ),
};

function AdManagement({
  updateSettings,
  adNetwork,
  publisherId,
  adSenseSlotId,
  adManagerSlotId,
  siteKitStatus,
}) {
  const { adsenseActive, installed, adsenseLink } = siteKitStatus;

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

  const onSiteKitClick = useCallback(
    (evt) => trackClick(evt, 'click_site_kit_link'),
    []
  );

  const siteKitDisplayText = useMemo(() => {
    if (adsenseActive) {
      return null;
    }

    return (
      <TranslateWithMarkup
        mapping={{
          a: (
            <InlineLink
              href={adsenseLink}
              target="_blank"
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              onClick={onSiteKitClick}
            />
          ),
        }}
      >
        {installed ? TEXT.SITE_KIT_INSTALLED : TEXT.SITE_KIT_NOT_INSTALLED}
      </TranslateWithMarkup>
    );
  }, [adsenseActive, installed, adsenseLink, onSiteKitClick]);

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
        <SettingSubheading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {siteKitDisplayText}
        </SettingSubheading>
      </div>

      {adsenseActive ? (
        <div>
          <TextInputHelperText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            {TEXT.SITE_KIT_IN_USE}
          </TextInputHelperText>
        </div>
      ) : (
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
              siteKitStatus={siteKitStatus}
            />
          )}
          {AD_NETWORK_TYPE.ADMANAGER === adNetwork && (
            <GoogleAdManagerSettings
              handleUpdate={handleUpdateAdManagerSlotId}
              slotId={adManagerSlotId}
            />
          )}
        </div>
      )}
    </MultilineForm>
  );
}

AdManagement.propTypes = {
  updateSettings: PropTypes.func.isRequired,
  adNetwork: PropTypes.string.isRequired,
  publisherId: PropTypes.string,
  adSenseSlotId: PropTypes.string,
  adManagerSlotId: PropTypes.string,
  siteKitStatus: PropTypes.shape({
    installed: PropTypes.bool,
    active: PropTypes.bool,
    adsenseActive: PropTypes.bool,
    analyticsActive: PropTypes.bool,
    adsenseLink: PropTypes.string,
  }),
};

export default AdManagement;
