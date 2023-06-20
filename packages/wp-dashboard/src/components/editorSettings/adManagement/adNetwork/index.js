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
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __, _x, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import { TextSize, DropDown } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { InlineLink, TextInputHelperText } from '../../components';
import { AD_NETWORK_TYPE } from '../../../../constants';

export const TEXT = {
  SLOT_ID_LABEL: __('Monetization type', 'web-stories'),

  HELPER_MESSAGE_ADSENSE: __(
    'Learn more about <a>how to monetize your Web Stories</a> using AdSense. Once configured, AdSense will determine where and how to insert ads into the story. Consult <help>AdSense Help</help> for any further assistance.',
    'web-stories'
  ),
  HELPER_MESSAGE_ADMANAGER: __(
    'Learn how to <a>enable programmatic demand in Web Stories</a> through Ad Manager.',
    'web-stories'
  ),
  HELPER_MESSAGE_MGID: __(
    'Learn how to start <a>monetizing Web Stories with MGID Native Solution</a>',
    'web-stories'
  ),
  HELPER_LINK_ADSENSE: __(
    'https://support.google.com/adsense/answer/10175505',
    'web-stories'
  ),
  HELPER_LINK_ADSENSE_HELP: __(
    'https://support.google.com/adsense/',
    'web-stories'
  ),
  HELPER_LINK_ADMANAGER: __(
    'https://support.google.com/admanager/answer/9416436',
    'web-stories'
  ),
  HELPER_LINK_MGID: __(
    'https://help.mgid.com/generate-revenue-with-amp-web-stories?utm_source=wp-plugin&utm_medium=web-stories-by-google',
    'web-stories'
  ),
};

const OPTIONS = [
  {
    label: _x('None', 'ad network', 'web-stories'),
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
  {
    label: __('MGID', 'web-stories'),
    value: AD_NETWORK_TYPE.MGID,
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

    if (AD_NETWORK_TYPE.MGID === adNetwork) {
      return TEXT.HELPER_MESSAGE_MGID;
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

    if (AD_NETWORK_TYPE.MGID === adNetwork) {
      return TEXT.HELPER_LINK_MGID;
    }

    return null;
  }, [adNetwork]);

  const handleMonetizationClick = useCallback(
    (evt) => trackClick(evt, 'click_monetization_docs'),
    []
  );

  return (
    <>
      <DropDown
        ariaLabel={TEXT.SLOT_ID_LABEL}
        options={OPTIONS}
        selectedValue={adNetwork}
        onMenuItemClick={(_, newAdNetwork) => handleUpdate(newAdNetwork)}
        fillWidth
      />

      {message && (
        <TextInputHelperText size={TextSize.Small}>
          <TranslateWithMarkup
            mapping={{
              a: (
                <InlineLink
                  href={link}
                  rel="noreferrer"
                  target="_blank"
                  onClick={handleMonetizationClick}
                  size={TextSize.Small}
                />
              ),
              help: (
                <InlineLink
                  href={TEXT.HELPER_LINK_ADSENSE_HELP}
                  rel="noreferrer"
                  target="_blank"
                  size={TextSize.Small}
                />
              ),
            }}
          >
            {message}
          </TranslateWithMarkup>
        </TextInputHelperText>
      )}
    </>
  );
}
AdNetworkSettings.propTypes = {
  handleUpdate: PropTypes.func,
  adNetwork: PropTypes.oneOf(Object.values(AD_NETWORK_TYPE)),
};

export default AdNetworkSettings;
