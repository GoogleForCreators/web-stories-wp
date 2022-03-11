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
import { useCallback } from '@googleforcreators/react';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import { Link, Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import { Dialog } from '@googleforcreators/story-editor';

const SUPPORT_URL = __(
  'https://wordpress.org/support/plugin/web-stories/',
  'web-stories'
);

function StatusCheckFailed({ isOpen, onClose }) {
  const onSupportClick = useCallback((evt) => {
    trackClick(evt, 'click_support_page');
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={__('Unable to save your story', 'web-stories')}
      contentLabel={__('Unable to save your story', 'web-stories')}
      onPrimary={onClose}
      primaryText={__('Dismiss', 'web-stories')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                href={SUPPORT_URL}
                target="_blank"
                onClick={onSupportClick}
              />
            ),
          }}
        >
          {__(
            'We are currently unable to save your story, any changes you make may be lost. This may be due to temporary issues connecting to WordPress. <a>Submit a new support topic</a> for additional help.',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Text>
    </Dialog>
  );
}

StatusCheckFailed.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatusCheckFailed;
