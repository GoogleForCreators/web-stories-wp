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
import { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import {
  THEME_CONSTANTS,
  Text,
  Toggle,
  Headline,
} from '../../../../../../design-system';
import { FullWidthWrapper } from '../../common/styles';
import PillGroup from '../../shared/pillGroup';
import localStore, {
  LOCAL_STORAGE_PREFIX,
} from '../../../../../utils/localStore';
import useLibrary from '../../../useLibrary';
import useStory from '../../../../../app/story/useStory';
import {
  getInUseFontsForPages,
  getTextSetsForFonts,
} from '../../../../../utils/getInUseFonts';
import { Container as SectionContainer } from '../../../common/section';
import { virtualPaneContainer } from '../../shared/virtualizedPanelGrid';
import TextSets from './textSets';
import { CATEGORIES, PANE_TEXT } from './constants';

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const TextSetsToggle = styled.div`
  display: flex;

  label {
    cursor: pointer;
    margin: auto 12px;
    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;

const TextSetsWrapper = styled.div`
  ${virtualPaneContainer};
`;

function TextSetsPane({ paneRef }) {
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

  const addIdToTextSets = useCallback(
    (textSetsArray = []) =>
      textSetsArray.map((elements) => {
        return {
          id: `text_set_${uuidv4()}`,
          elements,
        };
      }),
    []
  );
  const filteredTextSets = useMemo(() => {
    if (showInUse) {
      return addIdToTextSets(getTextSetsForInUseFonts());
    }
    return addIdToTextSets(selectedCat ? textSets?.[selectedCat] : allTextSets);
  }, [
    selectedCat,
    textSets,
    allTextSets,
    addIdToTextSets,
    getTextSetsForInUseFonts,
    showInUse,
  ]);

  const categories = useMemo(
    () => [
      ...Object.keys(textSets).map((category) => ({
        id: category,
        label: CATEGORIES[category] ?? category,
      })),
    ],
    [textSets]
  );

  const handleSelectedCategory = useCallback((selectedCategory) => {
    setSelectedCat(selectedCategory);
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TEXT_SET_SETTINGS}`, {
      selectedCategory,
    });
  }, []);

  const onChangeShowInUse = useCallback(
    () => requestAnimationFrame(() => setShowInUse((prevVal) => !prevVal)),
    [setShowInUse]
  );

  useEffect(() => {
    trackEvent('search', {
      search_type: 'textsets',
      search_term: '',
      search_category: selectedCat,
      search_filter: showInUse ? 'show_in_use' : undefined,
    });
  }, [selectedCat, showInUse]);

  const sectionId = useMemo(() => `section-${uuidv4()}`, []);
  const toggleId = useMemo(() => `toggle_text_sets_${uuidv4()}`, []);
  return (
    <SectionContainer id={sectionId}>
      <TitleBar>
        <Headline
          as="h3"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
        >
          {PANE_TEXT.TITLE}
        </Headline>
        <TextSetsToggle>
          <Text
            as="label"
            htmlFor={toggleId}
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            {PANE_TEXT.SWITCH_LABEL}
          </Text>
          <Toggle
            id={toggleId}
            aria-label={PANE_TEXT.SWITCH_LABEL}
            name={toggleId}
            checked={showInUse}
            onChange={onChangeShowInUse}
          />
        </TextSetsToggle>
      </TitleBar>
      <FullWidthWrapper>
        <PillGroup
          items={categories}
          selectedItemId={selectedCat}
          selectItem={handleSelectedCategory}
          deselectItem={() => handleSelectedCategory(null)}
        />
      </FullWidthWrapper>
      <TextSetsWrapper>
        <TextSets paneRef={paneRef} filteredTextSets={filteredTextSets} />
      </TextSetsWrapper>
    </SectionContainer>
  );
}

TextSetsPane.propTypes = {
  paneRef: PropTypes.object,
};

export default TextSetsPane;
