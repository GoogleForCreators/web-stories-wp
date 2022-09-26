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
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { trackEvent } from '@googleforcreators/tracking';
import {
  _n,
  sprintf,
  __,
  _x,
  translateToInclusiveList,
} from '@googleforcreators/i18n';
import {
  THEME_CONSTANTS,
  LOCAL_STORAGE_PREFIX,
  Text,
  Toggle,
  Headline,
  useLiveRegion,
  localStore,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { FullWidthWrapper } from '../../common/styles';
import { ChipGroup } from '../../shared';
import useLibrary from '../../../useLibrary';
import useStory from '../../../../../app/story/useStory';
import {
  getInUseFontsForPages,
  getTextSetsForFonts,
} from '../../../../../utils/getInUseFonts';
import { Container as SectionContainer } from '../../../common/section';
import { virtualPaneContainer } from '../../shared/virtualizedPanelGrid';
import EmptyContentMessage from '../../../../emptyContentMessage';
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
  const { areTextSetsLoading, textSets } = useLibrary(
    ({ state: { areTextSetsLoading, textSets } }) => ({
      areTextSetsLoading,
      textSets,
    })
  );
  const [showInUse, setShowInUse] = useState(false);
  const trackChange = useRef(false);

  const allTextSets = useMemo(() => Object.values(textSets).flat(), [textSets]);
  const storyPages = useStory(({ state: { pages } }) => pages);

  const [selectedCat, setSelectedCat] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.TEXT_SET_SETTINGS)
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
      textSetsArray.map(
        ({ textSetFonts = [], textSetCategory, elements, id }) => {
          return {
            id,
            title: sprintf(
              /* translators: 1: text set category. 2: list of fonts. */
              _n(
                'Text set %1$s with %2$s font',
                'Text set %1$s with %2$s fonts',
                textSetFonts.length,
                'web-stories'
              ),
              CATEGORIES[textSetCategory],
              translateToInclusiveList(textSetFonts)
            ),
            elements,
          };
        }
      ),
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
      { id: null, label: _x('All', 'text sets', 'web-stories') },
      ...Object.keys(textSets).map((category) => ({
        id: category,
        label: CATEGORIES[category] ?? category,
      })),
    ],
    [textSets]
  );

  const speak = useLiveRegion();

  const handleSelectedCategory = useCallback(
    (selectedCategory) => {
      setSelectedCat(selectedCategory);
      speak(
        selectedCategory === null
          ? __('Show all text sets', 'web-stories')
          : sprintf(
              /* translators: %s: filter category name */
              __('Selected text set filter %s', 'web-stories'),
              CATEGORIES[selectedCategory]
            )
      );
      localStore.setItemByKey(LOCAL_STORAGE_PREFIX.TEXT_SET_SETTINGS, {
        selectedCategory,
      });
      trackChange.current = true;
    },
    [speak]
  );

  const onChangeShowInUse = useCallback(() => {
    requestAnimationFrame(() => setShowInUse((prevVal) => !prevVal));
    trackChange.current = true;
  }, [setShowInUse]);

  useEffect(() => {
    if (trackChange.current) {
      trackEvent('search', {
        search_type: 'textsets',
        search_term: '',
        search_category: selectedCat,
        search_filter: showInUse ? 'show_in_use' : undefined,
      });
    }
  }, [selectedCat, showInUse]);

  const sectionId = useMemo(() => `section-${uuidv4()}`, []);
  const toggleId = useMemo(() => `toggle_text_sets_${uuidv4()}`, []);

  const emptyContentMessage = useMemo(
    () =>
      showInUse
        ? __(
            'No matching Text Sets available. Try adding text to your story.',
            'web-stories'
          )
        : __('No Text Sets available.', 'web-stories'),
    [showInUse]
  );

  return (
    <SectionContainer id={sectionId}>
      <TitleBar>
        <Headline
          as="h2"
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
        <ChipGroup
          items={categories}
          selectedItemId={selectedCat}
          selectItem={handleSelectedCategory}
          deselectItem={() => handleSelectedCategory(null)}
          ariaLabel={__('Select filter for text sets list', 'web-stories')}
        />
      </FullWidthWrapper>
      <TextSetsWrapper>
        {!filteredTextSets?.length && !areTextSetsLoading ? (
          <EmptyContentMessage>{emptyContentMessage}</EmptyContentMessage>
        ) : (
          <TextSets paneRef={paneRef} filteredTextSets={filteredTextSets} />
        )}
      </TextSetsWrapper>
    </SectionContainer>
  );
}

TextSetsPane.propTypes = {
  paneRef: PropTypes.object,
};

export default TextSetsPane;
