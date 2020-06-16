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
import { useStory } from '../../../app/story';
import { Switch, Numeric, Row, Label } from '../../form';
import RangeInput from '../../rangeInput';
import Note from '../../panels/shared/note';
import { SimplePanel } from '../../panels/panel';

const SwitchRow = styled.div`
  margin-bottom: 16px;
`;

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const DEFAULT_AUTO_ADVANCE = true;
const DEFAULT_PAGE_DURATION = 7;
const MIN_PAGE_DURATION = 1;
const MAX_PAGE_DURATION = 20;

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

  const updateAutoAdvance = useCallback(
    (value) => updateStory({ properties: { autoAdvance: value } }),
    [updateStory]
  );

  const [updateDefaultPageDuration] = useDebouncedCallback((value) => {
    const newValue = Math.max(
      MIN_PAGE_DURATION,
      Math.min(MAX_PAGE_DURATION, value)
    );

    updateStory({
      properties: { defaultPageDuration: newValue },
    });
  }, 800);

  useEffect(() => {
    updateDefaultPageDuration(duration);
  }, [duration, updateDefaultPageDuration]);

  return (
    <SimplePanel
      name="pageAdvancement"
      title={__('Page Advancement', 'web-stories')}
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
              min={MIN_PAGE_DURATION}
              max={MAX_PAGE_DURATION}
              step={0.1}
              value={duration}
              onChange={(evt) => setDuration(Number(evt.target.value))}
              aria-label={__('Default Page Duration', 'web-stories')}
            />
          </Row>
          <Row>
            <BoxedNumeric
              symbol={_x('s', 'Seconds', 'web-stories')}
              value={duration}
              onChange={setDuration}
              aria-label={__('Default page duration in seconds', 'web-stories')}
            />
          </Row>
        </>
      )}
    </SimplePanel>
  );
}

export default PageAdvancementPanel;
