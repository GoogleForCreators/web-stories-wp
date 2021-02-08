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
import { useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { SettingForm, SettingHeading, FormLabel } from '../components';

const CheckBox = styled.input.attrs({
  type: 'checkbox',
  id: 'media-optimization',
})`
  height: 18px;
  width: 18px;
  margin: 0 12px 0 0;
  flex: 1 0 18px;
`;

const Label = styled.label.attrs({ htmlFor: 'media-optimization' })`
  display: flex;
  justify-content: flex-start;
`;

export default function MediaOptimizationSettings({
  selected,
  onCheckboxSelected,
  disabled,
}) {
  const checkboxRef = useRef();
  const focusOnCheckbox = useRef(false);

  const checked = Boolean(selected);

  useEffect(() => {
    if (focusOnCheckbox.current) {
      checkboxRef.current.focus();
    }
  });

  return (
    <SettingForm>
      <div>
        <SettingHeading>
          {__('Video Optimization', 'web-stories')}
        </SettingHeading>
      </div>
      <div>
        <Label>
          <CheckBox
            ref={checkboxRef}
            data-testid="media-optimization-settings-checkbox"
            disabled={disabled}
            onChange={() => {
              onCheckboxSelected();
              focusOnCheckbox.current = true;
            }}
            onBlur={() => {
              focusOnCheckbox.current = false;
            }}
            checked={checked}
          />
          <FormLabel aria-checked={checked}>
            {__(
              'Automatically optimize videos used in Web Stories. We recommend enabling this feature. Video files that are too large or have an unsupported format (like .mov) will otherwise not display properly.',
              'web-stories'
            )}
          </FormLabel>
        </Label>
      </div>
    </SettingForm>
  );
}

MediaOptimizationSettings.propTypes = {
  disabled: propTypes.bool.isRequired,
  selected: propTypes.bool.isRequired,
  onCheckboxSelected: propTypes.func.isRequired,
};
