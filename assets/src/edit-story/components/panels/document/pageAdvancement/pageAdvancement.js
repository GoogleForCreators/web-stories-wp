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
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import clamp from '../../../../utils/clamp';
import { useStory } from '../../../../app/story';
import { Switch, Numeric, Row, Label } from '../../../form';
import RangeInput from '../../../rangeInput';
import Note from '../../shared/note';
import { SimplePanel } from '../../panel';

const SwitchRow = styled.div`
  margin-bottom: 16px;
`;

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
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
    (value) => updateStory({ properties: { autoAdvance: value } }),
    [updateStory]
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
    }
  }, 800);

  useEffect(() => {
    updateDefaultPageDuration(duration);
  }, [duration, updateDefaultPageDuration]);

  const handleRangeChange = useCallback(
    // Make sure to round to nearest .1
    (value) => setDuration(Math.round(value * 10) / 10),
    []
  );

  return (
    <SimplePanel
      name="pageAdvancement"
      title={__('Page Advancement', 'web-stories')}
      collapsedByDefault={false}
    >
      <Row>
        <Note>
          {__(
            'Control whether a story auto-advances between pages, or whether the reader has to manually tap to advance.',
            'web-stories'
          )}
        </Note>
      </Row>
      <SwitchRow>
        <Switch
          label={__('Page Advancement', 'web-stories')}
          value={autoAdvance}
          onLabel={__('Auto', 'web-stories')}
          offLabel={__('Manual', 'web-stories')}
          onChange={updateAutoAdvance}
        />
      </SwitchRow>
      {autoAdvance && (
        <>
          <Row>
            <Label>{__('Default Page Duration', 'web-stories')}</Label>
            <RangeInput
              min={MIN_MAX.PAGE_DURATION.MIN}
              max={MIN_MAX.PAGE_DURATION.MAX}
              majorStep={1}
              minorStep={0.1}
              value={duration}
              handleChange={handleRangeChange}
              aria-label={__('Default Page Duration', 'web-stories')}
            />
          </Row>
          <Row>
            <BoxedNumeric
              symbol={_x('s', 'Seconds', 'web-stories')}
              value={duration}
              onChange={setDuration}
              aria-label={__('Default page duration in seconds', 'web-stories')}
              min={MIN_MAX.PAGE_DURATION.MIN}
              max={MIN_MAX.PAGE_DURATION.MAX}
            />
          </Row>
        </>
      )}
    </SimplePanel>
  );
}

export default PageAdvancementPanel;
