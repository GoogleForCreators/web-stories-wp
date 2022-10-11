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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  THEME_CONSTANTS,
  NumericInput,
  Switch,
} from '@googleforcreators/design-system';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import {
  InlineForm,
  SettingForm,
  SettingHeading,
  SettingSubheading,
} from '../components';

const MIN_MAX = {
  PAGE_DURATION: {
    MIN: 1,
    MAX: 20,
  },
};

export const TEXT = {
  CONTEXT: __(
    'All new stories will be set to this page advancement setting. Control whether a story auto-advances between pages, or whether the reader has to manually tap to advance.',
    'web-stories'
  ),
  SECTION_HEADING: __('Default Page Advancement', 'web-stories'),
  LABEL_AUTO: __('Auto', 'web-stories'),
  LABEL_MANUAL: __('Manual', 'web-stories'),
  SWITCH_LABEL: __('Page Advancement', 'web-stories'),
  INPUT_LABEL: __('Default page duration in seconds', 'web-stories'),
  INPUT_SUFFIX: __('Duration', 'web-stories'),
};

const InputsWrapper = styled.div`
  margin-top: 8px;
`;

function PageAdvancementSettings({
  updateSettings,
  autoAdvance,
  defaultPageDuration,
}) {
  const onAdvanceChange = useCallback(() => {
    trackEvent('change_auto_advance', {
      value: !autoAdvance,
    });
    updateSettings({ autoAdvance: !autoAdvance });
  }, [autoAdvance, updateSettings]);

  const onDurationChange = useCallback(
    (_, newDuration) => {
      updateSettings({ defaultPageDuration: newDuration });
      trackEvent('change_default_page_duration', {
        value: newDuration,
      });
    },
    [updateSettings]
  );

  return (
    <SettingForm onSubmit={(e) => e.preventDefault()}>
      <div>
        <SettingHeading as="h3">{TEXT.SECTION_HEADING}</SettingHeading>
        <SettingSubheading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {TEXT.CONTEXT}
        </SettingSubheading>
      </div>
      <InputsWrapper>
        <InlineForm>
          <Switch
            groupLabel={TEXT.SWITCH_LABEL}
            name="page-advancement-switch"
            value={autoAdvance}
            onLabel={TEXT.LABEL_AUTO}
            offLabel={TEXT.LABEL_MANUAL}
            onChange={onAdvanceChange}
          />
          {autoAdvance && (
            <NumericInput
              unit={` ${__('seconds', 'web-stories')}`}
              suffix={TEXT.INPUT_SUFFIX}
              value={defaultPageDuration}
              onChange={onDurationChange}
              aria-label={TEXT.INPUT_SUFFIX}
              min={MIN_MAX.PAGE_DURATION.MIN}
              max={MIN_MAX.PAGE_DURATION.MAX}
              isFloat
            />
          )}
        </InlineForm>
      </InputsWrapper>
    </SettingForm>
  );
}

PageAdvancementSettings.propTypes = {
  updateSettings: PropTypes.func.isRequired,
  autoAdvance: PropTypes.bool.isRequired,
  defaultPageDuration: PropTypes.number.isRequired,
};

export default PageAdvancementSettings;
