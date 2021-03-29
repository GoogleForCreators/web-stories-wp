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
import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * External dependencies
 */
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import clamp from '../../../../utils/clamp';
import { useStory } from '../../../../app/story';
import { Row, Switch } from '../../../form';
import { SimplePanel } from '../../panel';
import {
  NumericInput,
  Text,
  THEME_CONSTANTS,
} from '../../../../../design-system';

const SwitchRow = styled.div`
  margin-bottom: 16px;
`;

const MutedText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const DEFAULT_AUTO_ADVANCE = true;
const DEFAULT_PAGE_DURATION = 7;
const MIN_MAX = {
  PAGE_DURATION: {
    MIN: 1,
    MAX: 20,
  },
};

function PageAdvancementPanel() {
  const { autoAdvance, defaultPageDuration, updateStory } = useStory(
    ({
      state: {
        story: {
          autoAdvance = DEFAULT_AUTO_ADVANCE,
          defaultPageDuration = DEFAULT_PAGE_DURATION,
        },
      },
      actions: { updateStory },
    }) => ({ autoAdvance, defaultPageDuration, updateStory })
  );

  const [duration, setDuration] = useState(defaultPageDuration);

  // Update duration if changed in global store
  useEffect(() => {
    setDuration(defaultPageDuration);
  }, [defaultPageDuration]);

  const updateAutoAdvance = useCallback(
    (_evt, value) => {
      updateStory({ properties: { autoAdvance: value } });
      trackEvent('change_page_advancement', {
        status: value ? 'auto' : 'manual',
        duration: duration,
      });
    },
    [updateStory, duration]
  );

  const [updateDefaultPageDuration] = useDebouncedCallback((value) => {
    const newValue = clamp(value, MIN_MAX.PAGE_DURATION);
    if (value !== newValue) {
      setDuration(newValue);
    }
    if (defaultPageDuration !== newValue) {
      updateStory({
        properties: { defaultPageDuration: newValue },
      });
      trackEvent('change_page_advancement', {
        status: autoAdvance ? 'auto' : 'manual',
        duration: newValue,
      });
    }
  }, 800);

  useEffect(() => {
    updateDefaultPageDuration(duration);
  }, [duration, updateDefaultPageDuration]);

  const handleChange = useCallback(
    (_evt, newValue) => setDuration(newValue),
    []
  );

  return (
    <SimplePanel
      name="pageAdvancement"
      title={__('Page Advancement', 'web-stories')}
      collapsedByDefault={false}
    >
      <Row>
        <MutedText>
          {__(
            'Control whether a story auto-advances between pages, or whether the reader has to manually tap to advance.',
            'web-stories'
          )}
        </MutedText>
      </Row>
      <SwitchRow>
        <Switch
          groupLabel={__('Page Advancement', 'web-stories')}
          name="page-advancement-switch"
          value={autoAdvance}
          onLabel={__('Auto', 'web-stories')}
          offLabel={__('Manual', 'web-stories')}
          onChange={updateAutoAdvance}
        />
      </SwitchRow>
      {autoAdvance && (
        <Row>
          <NumericInput
            unit={` ${__('seconds', 'web-stories')}`}
            suffix={__('Duration', 'web-stories')}
            value={duration}
            onChange={handleChange}
            aria-label={__('Default page duration in seconds', 'web-stories')}
            min={MIN_MAX.PAGE_DURATION.MIN}
            max={MIN_MAX.PAGE_DURATION.MAX}
            isFloat
          />
        </Row>
      )}
    </SimplePanel>
  );
}

export default PageAdvancementPanel;
