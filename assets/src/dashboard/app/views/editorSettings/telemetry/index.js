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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TranslateWithMarkup } from '../../../../../i18n';
import {
  SettingForm,
  SettingHeading,
  CheckboxLabel,
  CheckboxLabelText,
} from '../components';
import { Checkbox, THEME_CONSTANTS } from '../../../../../design-system';

export default function TelemetrySettings({
  selected,
  onCheckboxSelected,
  disabled,
}) {
  return (
    <SettingForm>
      <div>
        <SettingHeading>
          {__('Data Sharing Opt-in', 'web-stories')}
        </SettingHeading>
      </div>
      <div>
        <CheckboxLabel forwardedAs="label" htmlFor="telemetry-opt-in">
          <Checkbox
            id="telemetry-opt-in"
            data-testid="telemetry-settings-checkbox"
            disabled={disabled}
            onChange={onCheckboxSelected}
            checked={Boolean(selected)}
          />
          <CheckboxLabelText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
            aria-checked={Boolean(selected)}
            forwardedAs="span"
          >
            <TranslateWithMarkup
              mapping={{
                a: (
                  //eslint-disable-next-line jsx-a11y/anchor-has-content
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
