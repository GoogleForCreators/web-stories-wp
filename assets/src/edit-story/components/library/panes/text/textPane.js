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
import { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useFeatures } from 'flagged';
import ResizeObserver from 'resize-observer-polyfill';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import * as htmlToImage from 'html-to-image';

/**
 * Internal dependencies
 */
import { Section, SearchInput } from '../../common';
import { FontPreview } from '../../text';
import { Pane as SharedPane } from '../shared';
import useLibrary from '../../useLibrary';
import { useCanvas } from '../../../../app/canvas';
import { useStory } from '../../../../app';
import paneId from './paneId';
import { PRESETS } from './textPresets';
import useInsertPreset from './useInsertPreset';
import TextSetsPane from './textSets/textSetsPane';
import { getPageHash, hasPageHashChanged } from './utils';

// Relative position needed for Moveable to update its position properly.
const Pane = styled(SharedPane)`
  overflow-y: scroll;
  max-height: 100%;
  position: relative;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

function TextPane(props) {
  const paneRef = useRef();
  const [, forceUpdate] = useState();
  const { pageCanvasData, setPageCanvasData } = useLibrary((state) => ({
    pageCanvasData: state.state.pageCanvasData,
    setPageCanvasData: state.actions.setPageCanvasData,
  }));
  const { fullbleedContainer } = useCanvas((state) => ({
    fullbleedContainer: state.state.fullbleedContainer,
  }));

  const { currentPage } = useStory(({ state }) => {
    return {
      currentPage: state.currentPage,
    };
  });

  const { showTextAndShapesSearchInput } = useFeatures();

  const insertPreset = useInsertPreset();

  const onClick = useCallback(
    (title, element) => {
      insertPreset(element);
      trackEvent('insert_text_preset', { name: title });
    },
    [insertPreset]
  );

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

  const onPointerEnter = useCallback(() => {
    // Let's create the canvas image already when hovering for color calculations.
    if (
      !pageCanvasData ||
      hasPageHashChanged(currentPage, pageCanvasData.currentPage)
    ) {
      // @todo Create util.
      htmlToImage
        .toCanvas(fullbleedContainer, {
          fontEmbedCss: '',
        })
        .then((canvas) =>
          setPageCanvasData({
            canvas,
            currentPage: getPageHash(currentPage),
          })
        );
    }
  }, [fullbleedContainer, pageCanvasData, currentPage, setPageCanvasData]);

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

      <Section
        title={__('Presets', 'web-stories')}
        onPointerEnter={onPointerEnter}
      >
        <GridContainer>
          {PRESETS.map(({ title, element }) => (
            <FontPreview
              key={title}
              title={title}
              element={element}
              onClick={() => onClick(title, element)}
            />
          ))}
        </GridContainer>
      </Section>
      {paneRef.current && <TextSetsPane paneRef={paneRef} />}
    </Pane>
  );
}

export default TextPane;
