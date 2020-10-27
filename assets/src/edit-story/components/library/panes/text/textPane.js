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
import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFeatures } from 'flagged';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Section, SearchInput } from '../../common';
import { FontPreview } from '../../text';
import { Pane as SharedPane } from '../shared';
import paneId from './paneId';
import { PRESETS } from './textPresets';
import useInsertPreset from './useInsertPreset';
import TextSets from './textSets';

const Pane = styled(SharedPane)`
  overflow-y: scroll;
  max-height: 100%;
`;

function TextPane(props) {
  const paneRef = useRef();
  const [, forceUpdate] = useState();

  const { showTextAndShapesSearchInput } = useFeatures();

  const insertPreset = useInsertPreset();

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      // requestAnimationFrame prevents the 'ResizeObserver loop limit exceeded' error
      // https://stackoverflow.com/a/58701523/13078978
      window.requestAnimationFrame(() => {
        forceUpdate(Date.now());
      });
    });

    ro.observe(paneRef.current);

    return () => ro.disconnect();
  }, []);

  return (
    <Pane id={paneId} {...props} ref={paneRef}>
      {showTextAndShapesSearchInput && (
        <SearchInput
          initialValue={''}
          placeholder={__('Search', 'web-stories')}
          onSearch={() => {}}
          disabled
        />
      )}

      <Section title={__('Presets', 'web-stories')}>
        {PRESETS.map(({ title, element }, i) => (
          <FontPreview
            key={i}
            title={title}
            element={element}
            onClick={() => insertPreset(element)}
          />
        ))}
      </Section>
      {paneRef.current && <TextSets paneRef={paneRef} />}
    </Pane>
  );
}

export default TextPane;
