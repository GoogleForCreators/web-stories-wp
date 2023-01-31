/*
 * Copyright 2022 Google LLC
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
import { __ } from '@googleforcreators/i18n';
import { Checkbox, TextSize } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  SettingForm,
  SettingHeading,
  CheckboxLabel,
  CheckboxLabelText,
} from '../components';

export default function DataRemovalSettings({
  isEnabled = false,
  updateSettings,
}) {
  const onChange = useCallback(
    () => updateSettings({ dataRemoval: !isEnabled }),
    [updateSettings, isEnabled]
  );

  return (
    <SettingForm>
      <div>
        <SettingHeading>{__('Plugin Uninstall', 'web-stories')}</SettingHeading>
      </div>
      <div>
        <CheckboxLabel htmlFor="data-removal-settings">
          <Checkbox
            id="data-removal-settings"
            data-testid="data-removal-settings-checkbox"
            onChange={onChange}
            checked={Boolean(isEnabled)}
          />
          <CheckboxLabelText
            size={TextSize.Small}
            aria-checked={Boolean(isEnabled)}
          >
            {__(
              'Remove all data including stories and saved templates when uninstalling the Web Stories plugin.',
              'web-stories'
            )}
          </CheckboxLabelText>
        </CheckboxLabel>
      </div>
    </SettingForm>
  );
}

DataRemovalSettings.propTypes = {
  isEnabled: PropTypes.bool,
  updateSettings: PropTypes.func.isRequired,
};
