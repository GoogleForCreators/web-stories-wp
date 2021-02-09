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
import { __ } from '@web-stories-wp/i18n';
import { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useVirtual } from 'react-virtual';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { FullWidthWrapper } from '../../common/styles';
import PillGroup from '../../shared/pillGroup';
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
import Switch from '../../../../switch';
import {
  Container as SectionContainer,
  Title as SectionTitle,
} from '../../../common/section';
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

const TitleBar = styled.div`
  display: flex;

  label {
    margin-top: 14px;
    margin-bottom: 28px;
  }
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
};

function TextSets({ paneRef }) {
  const { textSets } = useLibrary(({ state: { textSets } }) => ({ textSets }));
  const [showInUse, setShowInUse] = useState(false);

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
        textSets: selectedCat ? textSets[selectedCat] : allTextSets,
      }),
    [allTextSets, storyPages, selectedCat, textSets]
  );

  const filteredTextSets = useMemo(() => {
    if (showInUse) {
      return getTextSetsForInUseFonts();
    }
    return selectedCat ? textSets[selectedCat] : allTextSets;
  }, [selectedCat, textSets, allTextSets, getTextSetsForInUseFonts, showInUse]);

  const categories = useMemo(
    () => [
      ...Object.keys(textSets).map((cat) => ({
        id: cat,
        label: CATEGORIES[cat] ?? cat,
      })),
    ],
    [textSets]
  );

  const rowVirtualizer = useVirtual({
    size: Math.ceil((filteredTextSets || []).length / 2),
    parentRef: paneRef,
    estimateSize: useCallback(() => TEXT_SET_SIZE + TEXT_SET_ROW_GAP, []),
    overscan: 5,
  });

  const handleSelectedCategory = useCallback((selectedCategory) => {
    setSelectedCat(selectedCategory);
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TEXT_SET_SETTINGS}`, {
      selectedCategory,
    });
    if (selectedCategory) {
      trackEvent('textsets_select_category', 'editor', '', selectedCategory);
    } else {
      trackEvent('textsets_deselect_category', 'editor');
    }
  }, []);

  const sectionId = useMemo(() => `section-${uuidv4()}`, []);
  const title = useMemo(() => __('Text Sets', 'web-stories'), []);

  const onChangeShowInUse = useCallback(
    (value) => {
      requestAnimationFrame(() => setShowInUse(value));
      trackEvent('textsets_toggle_show_in_use', 'editor', '', value);
    },
    [setShowInUse]
  );

  return (
    <SectionContainer id={sectionId}>
      <TitleBar>
        <SectionTitle>{title}</SectionTitle>
        <Switch
          onChange={onChangeShowInUse}
          value={showInUse}
          label={__('Match fonts from story', 'web-stories')}
        />
      </TitleBar>
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
                {(filteredTextSets[firstColumnIndex] || []).length > 0 && (
                  <TextSet
                    key={firstColumnIndex}
                    elements={filteredTextSets[firstColumnIndex]}
                  />
                )}
                {filteredTextSets[secondColumnIndex] &&
                  (filteredTextSets[secondColumnIndex] || []).length > 0 && (
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
    </SectionContainer>
  );
}

TextSets.propTypes = {
  paneRef: PropTypes.object,
};

export default TextSets;
