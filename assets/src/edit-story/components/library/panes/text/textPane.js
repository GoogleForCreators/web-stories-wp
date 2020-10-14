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
import { useFeatures } from 'flagged';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { Section, MainButton, SearchInput } from '../../common';
import { FontPreview } from '../../text';
import useLibrary from '../../useLibrary';
import { Pane as SharedPane } from '../shared';
import useResizeEffect from '../../../../utils/useResizeEffect';
import paneId from './paneId';
import { PRESETS, DEFAULT_PRESET } from './textPresets';
import useInsertPreset from './useInsertPreset';
import TextSets from './textSets';

const Pane = styled(SharedPane)`
  overflow-y: scroll;
  max-height: 100%;
`;

const TYPE = 'text';

function TextPane(props) {
  const paneRef = useRef();
  const [, forceUpdate] = useState();
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const { showTextSets, showTextAndShapesSearchInput } = useFeatures();

  const insertPreset = useInsertPreset();

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      forceUpdate(Date.now());
    });

    ro.observe(paneRef.current);

    return () => ro.disconnect();
  }, []);

  // useResizeEffect(paneRef, () => forceUpdate(Date.now()), []);

  return (
    <Pane id={paneId} {...props} ref={paneRef}>
      {showTextAndShapesSearchInput && (
        <SearchInput
          initialValue={'test'}
          placeholder={__('Search', 'web-stories')}
          onSearch={() => {}}
          disabled
        />
      )}

      <Section
        title={__('Presets', 'web-stories')}
        titleTools={
          <MainButton onClick={() => insertElement(TYPE, DEFAULT_PRESET)}>
            {__('Add new text', 'web-stories')}
          </MainButton>
        }
      >
        {PRESETS.map(({ title, element }, i) => (
          <FontPreview
            key={i}
            title={title}
            element={element}
            onClick={() => insertPreset(element)}
          />
        ))}
      </Section>
      {showTextSets && paneRef.current && <TextSets paneRef={paneRef} />}
    </Pane>
  );
}

export default TextPane;
