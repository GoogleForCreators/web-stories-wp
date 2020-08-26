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
import { useRef, useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Section, MainButton, SearchInput } from '../../common';
import { FontPreview } from '../../text';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import { dataFontEm } from '../../../../units';
import { useHistory } from '../../../../app/history';
import getInsertedElementSize from '../../../../utils/getInsertedElementSize';
import { PAGE_HEIGHT } from '../../../../constants';
import paneId from './paneId';
import { PRESETS, DEFAULT_PRESET } from './textPresets';

const SectionContent = styled.p``;

const POSITION_MARGIN = dataFontEm(1);
const TYPE = 'text';

function TextPane(props) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const {
    state: { versionNumber },
  } = useHistory();

  const { showTextSets, showTextAndShapesSearchInput } = useFeatures();

  const lastPreset = useRef(null);

  const getPosition = useCallback(
    (element) => {
      const { y } = element;
      // If the difference between the new and the previous version number is not 1,
      // the preset wasn't clicked right after the previous.
      if (
        !lastPreset.current ||
        versionNumber - lastPreset.current.versionNumber !== 1
      ) {
        return y;
      }
      const {
        element: { height: lastHeight, y: lastY },
      } = lastPreset.current;
      let positionedY = lastY + lastHeight + POSITION_MARGIN;
      // Let's get the width/height of the element about to be inserted.
      const { width, height } = getInsertedElementSize(
        TYPE,
        element.width,
        element.height,
        {
          ...element,
          y: positionedY,
        }
      );
      // If the element is going out of page, use the default position.
      if (positionedY + height >= PAGE_HEIGHT) {
        positionedY = y;
      }
      return {
        width,
        height,
        y: positionedY,
      };
    },
    [versionNumber]
  );

  const handleClickPreset = useCallback(
    (element) => {
      const atts = getPosition(element);
      const addedElement = insertElement(TYPE, {
        ...element,
        ...atts,
      });
      lastPreset.current = {
        versionNumber,
        element: addedElement,
      };
    },
    [getPosition, versionNumber, insertElement]
  );

  return (
    <Pane id={paneId} {...props}>
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
            onClick={() => handleClickPreset(element)}
          />
        ))}
      </Section>
      {showTextSets && (
        <Section title={__('Text Sets', 'web-stories')}>
          <SectionContent>{__('Coming soon.', 'web-stories')}</SectionContent>
        </Section>
      )}
    </Pane>
  );
}

export default TextPane;
