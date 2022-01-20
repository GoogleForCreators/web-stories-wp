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
import propTypes from 'prop-types';
import { useMemo } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@googleforcreators/i18n';
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

export default function MediaOptimizationSettings({
  selected,
  onCheckboxSelected,
  disabled,
}) {
  const mediaOptimizationId = useMemo(
    () => `media-optimization-${uuidv4()}`,
    []
  );

  return (
    <SettingForm>
      <div>
        <SettingHeading>
          {__('Video Optimization', 'web-stories')}
        </SettingHeading>
      </div>
      <div>
        <CheckboxLabel forwardedAs="label" htmlFor={mediaOptimizationId}>
          <Checkbox
            id={mediaOptimizationId}
            data-testid="media-optimization-settings-checkbox"
            disabled={disabled}
            onChange={onCheckboxSelected}
            checked={Boolean(selected)}
          />
          <CheckboxLabelText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            aria-checked={Boolean(selected)}
            forwardedAs="span"
          >
            {__(
              'Automatically optimize videos used in Web Stories. We recommend enabling this feature. Video files that are too large or have an unsupported format (like .mov) will otherwise not display properly.',
              'web-stories'
            )}
          </CheckboxLabelText>
        </CheckboxLabel>
      </div>
    </SettingForm>
  );
}

MediaOptimizationSettings.propTypes = {
  disabled: propTypes.bool.isRequired,
  selected: propTypes.bool.isRequired,
  onCheckboxSelected: propTypes.func.isRequired,
};
