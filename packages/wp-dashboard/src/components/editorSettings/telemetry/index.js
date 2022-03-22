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
import propTypes from 'prop-types';
import { useMemo } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { Checkbox, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  SettingForm,
  SettingHeading,
  CheckboxLabel,
  CheckboxLabelText,
} from '../components';

export default function TelemetrySettings({
  selected,
  onCheckboxSelected,
  disabled,
}) {
  const telemetryOptInId = useMemo(() => `telemetry-opt-in-${uuidv4()}`, []);

  return (
    <SettingForm>
      <div>
        <SettingHeading>
          {__('Data Sharing Opt-in', 'web-stories')}
        </SettingHeading>
      </div>
      <div>
        <CheckboxLabel forwardedAs="label" htmlFor={telemetryOptInId}>
          <Checkbox
            id={telemetryOptInId}
            data-testid="telemetry-settings-checkbox"
            disabled={disabled}
            onChange={onCheckboxSelected}
            checked={Boolean(selected)}
          />
          <CheckboxLabelText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            aria-checked={Boolean(selected)}
            forwardedAs="span"
          >
            <TranslateWithMarkup
              mapping={{
                a: (
                  <a
                    href={__(
                      'https://policies.google.com/privacy',
                      'web-stories'
                    )}
                    rel="noreferrer"
                    target="_blank"
                    aria-label={__(
                      'Learn more by visiting Google Privacy Policy',
                      'web-stories'
                    )}
                  />
                ),
              }}
            >
              {__(
                'Check the box to help us improve the Web Stories plugin by allowing tracking of product usage stats. All data are treated in accordance with <a>Google Privacy Policy</a>.',
                'web-stories'
              )}
            </TranslateWithMarkup>
          </CheckboxLabelText>
        </CheckboxLabel>
      </div>
    </SettingForm>
  );
}

TelemetrySettings.propTypes = {
  disabled: propTypes.bool.isRequired,
  selected: propTypes.bool.isRequired,
  onCheckboxSelected: propTypes.func.isRequired,
};
