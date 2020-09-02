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
import * as React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingForm, SettingHeading, FormLabel } from '../components';

const CheckBox = styled.input.attrs({
  type: 'checkbox',
  id: 'telemetry-opt-in',
})`
  height: 18px;
  width: 18px;
  margin: 0 12px 0 0;
  flex: 1 0 18px;
`;

const Label = styled.label.attrs({ htmlFor: 'telemetry-opt-in' })`
  display: flex;
  justify-content: flex-start;
`;

export default function TelemetrySettings({
  selected,
  onCheckboxSelected,
  disabled,
}) {
  return (
    <SettingForm>
      <div>
        <SettingHeading>
          {__('Anonymous Data Sharing Opt-in', 'web-stories')}
        </SettingHeading>
      </div>
      <div>
        <Label>
          <CheckBox
            disabled={disabled}
            onChange={onCheckboxSelected}
            checked={Boolean(selected)}
          />
          <FormLabel>
            {__(
              'Help us improve the Web Stories for WordPress plugin by allowing tracking of usage stats. All data are treated in accordance with',
              'web-stories'
            )}
            &nbsp;
            <a
              href={__('https://policies.google.com/privacy', 'web-stories')}
              rel="noreferrer"
              target="_blank"
            >
              {__('Google Privacy Policy', 'web-stories')}
              {'.'}
            </a>
          </FormLabel>
        </Label>
      </div>
    </SettingForm>
  );
}

TelemetrySettings.propTypes = {
  disabled: propTypes.bool.isRequired,
  selected: propTypes.bool.isRequired,
  onCheckboxSelected: propTypes.func.isRequired,
};
