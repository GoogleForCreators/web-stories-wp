/*
 * Copyright 2021 Google LLC
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
import { useCallback } from '@web-stories-wp/react';
import { __, _x, TranslateWithMarkup, sprintf } from '@web-stories-wp/i18n';
import { useFeature } from 'flagged';
import { DropDown, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */

import {
  InlineLink,
  SettingForm,
  SettingHeading,
  TextInputHelperText,
} from '../components';
import { ARCHIVE_TYPE } from '../../../../constants';

export const TEXT = {
  LABEL: __('Stories Archives', 'web-stories'),
  SECTION_HEADING: __('Stories Archives', 'web-stories'),
  ARCHIVE_CONTENT: __(
    "By default WordPress automatically creates an archive page, displaying your latest stories in your theme's layout.",
    'web-stories'
  ),
  SUB_TEXT_DISABLED: __(
    'This disables the default archive page.',
    'web-stories'
  ),
};

const OPTIONS = [
  {
    label: _x('Default', 'archive type', 'web-stories'),
    value: ARCHIVE_TYPE.DEFAULT,
  },
  {
    label: __('Disabled', 'web-stories'),
    value: ARCHIVE_TYPE.DISABLED,
  },
];

export default function ArchiveSettings({
  archive = ARCHIVE_TYPE.DEFAULT,
  archiveURL,
  updateSettings,
}) {
  const onChange = useCallback(
    (_, newArchive) => updateSettings({ archive: newArchive }),
    [updateSettings]
  );

  const isFeatureEnabled = useFeature('disableArchive');

  if (!isFeatureEnabled) {
    return null;
  }

  return (
    <SettingForm>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>
        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {TEXT.ARCHIVE_CONTENT}
        </TextInputHelperText>
      </div>
      <div>
        <DropDown
          ariaLabel={TEXT.LABEL}
          options={OPTIONS}
          selectedValue={archive}
          onMenuItemClick={onChange}
          fillWidth
        />
        <TextInputHelperText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {ARCHIVE_TYPE.DISABLED === archive && TEXT.SUB_TEXT_DISABLED}
          {ARCHIVE_TYPE.DEFAULT === archive && (
            <TranslateWithMarkup
              mapping={{
                a: (
                  <InlineLink
                    href={archiveURL}
                    rel="noreferrer"
                    target="_blank"
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                    as="a"
                  />
                ),
              }}
            >
              {sprintf(
                /* translators: %s: archive url. */
                __('Visit archive page at <a>%s</a>.', 'web-stories'),
                archiveURL
              )}
            </TranslateWithMarkup>
          )}
        </TextInputHelperText>
      </div>
    </SettingForm>
  );
}

ArchiveSettings.propTypes = {
  archive: PropTypes.string.isRequired,
  archiveURL: PropTypes.string.isRequired,
  updateSettings: PropTypes.func.isRequired,
};

ArchiveSettings.defaultProps = {
  archive: ARCHIVE_TYPE.DEFAULT,
};
