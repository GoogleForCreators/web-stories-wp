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
import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useVirtual } from 'react-virtual';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Section } from '../../../common';
import PillGroup from '../../shared/pillGroup';
import { FullWidthWrapper } from '../../common/styles';
import localStore, {
  LOCAL_STORAGE_PREFIX,
} from '../../../../../utils/localStore';
import { UnitsProvider } from '../../../../../units';
import { PAGE_RATIO, TEXT_SET_SIZE } from '../../../../../constants';
import useLibrary from '../../../useLibrary';
import useStory from '../../../../../app/story/useStory';
import {
  getInUseFontsForPages,
  getTextSetsForFonts,
} from '../../../../../utils/getInUseFonts';
import TextSet from './textSet';

const TEXT_SET_ROW_GAP = 12;

const TextSetContainer = styled.div`
  height: ${({ height }) => `${height}px`};
  width: 100%;
  position: relative;
  margin-top: 28px;
  overflow-x: hidden;
`;

const TextSetRow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => `${height}px`};
  transform: ${({ translateY }) => `translateY(${translateY}px)`};
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 12px;
`;

const CATEGORIES = {
  contact: __('Contact', 'web-stories'),
  editorial: __('Editorial', 'web-stories'),
  list: __('List', 'web-stories'),
  cover: __('Cover', 'web-stories'),
  section_header: __('Header', 'web-stories'),
  step: __('Steps', 'web-stories'),
  table: __('Table', 'web-stories'),
  quote: __('Quote', 'web-stories'),
  inUse: __('Fonts In Use', 'web-stories'),
};

function TextSets({ paneRef }) {
  const { textSets } = useLibrary(({ state: { textSets } }) => ({ textSets }));

  const allTextSets = useMemo(() => Object.values(textSets).flat(), [textSets]);
  const storyPages = useStory(({ state: { pages } }) => pages);

  const [selectedCat, setSelectedCat] = useState(
    localStore.getItemByKey(`${LOCAL_STORAGE_PREFIX.TEXT_SET_SETTINGS}`)
      ?.selectedCategory
  );

  const getTextSetsForInUseFonts = useCallback(
    () =>
      getTextSetsForFonts({
        fonts: getInUseFontsForPages(storyPages),
        textSets: allTextSets,
      }),
    [allTextSets, storyPages]
  );

  const filteredTextSets = useMemo(() => {
    if (selectedCat === 'inUse') {
      return getTextSetsForInUseFonts();
    }
    return selectedCat ? textSets[selectedCat] : allTextSets;
  }, [selectedCat, textSets, allTextSets, getTextSetsForInUseFonts]);

  const categories = useMemo(
    () => [
      ...Object.keys(textSets).map((cat) => ({
        id: cat,
        label: CATEGORIES[cat] ?? cat,
      })),
      { id: 'inUse', label: CATEGORIES.inUse },
    ],
    [textSets]
  );

  const rowVirtualizer = useVirtual({
    size: Math.ceil(filteredTextSets.length / 2),
    parentRef: paneRef,
    estimateSize: useCallback(() => TEXT_SET_SIZE + TEXT_SET_ROW_GAP, []),
    overscan: 5,
  });

  const handleSelectedCategory = useCallback((selectedCategory) => {
    setSelectedCat(selectedCategory);
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TEXT_SET_SETTINGS}`, {
      selectedCategory,
    });
  }, []);

  const sectionId = useMemo(() => `section-${uuidv4()}`, []);
  const title = useMemo(() => __('Text Sets', 'web-stories'), []);

  return (
    <Section id={sectionId} title={title}>
      <FullWidthWrapper>
        <PillGroup
          items={categories}
          selectedItemId={selectedCat}
          selectItem={handleSelectedCategory}
          deselectItem={() => handleSelectedCategory(null)}
        />
      </FullWidthWrapper>
      <UnitsProvider
        pageSize={{
          width: TEXT_SET_SIZE,
          height: TEXT_SET_SIZE / PAGE_RATIO,
        }}
      >
        <TextSetContainer height={rowVirtualizer.totalSize}>
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const firstColumnIndex = virtualRow.index * 2;
            const secondColumnIndex = firstColumnIndex + 1;

            return (
              <TextSetRow
                key={virtualRow.index}
                height={virtualRow.size}
                translateY={virtualRow.start}
              >
                {filteredTextSets[firstColumnIndex].length > 0 && (
                  <TextSet
                    key={firstColumnIndex}
                    elements={filteredTextSets[firstColumnIndex]}
                  />
                )}
                {filteredTextSets[secondColumnIndex] &&
                  filteredTextSets[secondColumnIndex].length > 0 && (
                    <TextSet
                      key={secondColumnIndex}
                      elements={filteredTextSets[secondColumnIndex]}
                    />
                  )}
              </TextSetRow>
            );
          })}
        </TextSetContainer>
      </UnitsProvider>
    </Section>
  );
}

TextSets.propTypes = {
  paneRef: PropTypes.object,
};

export default TextSets;
