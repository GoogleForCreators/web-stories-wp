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
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Section } from '../../../common';
import PillGroup from '../../shared/pillGroup';
import { PANE_PADDING } from '../../shared';
import useRovingTabIndex from '../../../../../utils/useRovingTabIndex';
import localStore, {
  LOCAL_STORAGE_PREFIX,
} from '../../../../../utils/localStore';
import { UnitsProvider } from '../../../../../units';
import { PAGE_RATIO, TEXT_SET_SIZE } from '../../../../../constants';
import useLibrary from '../../../useLibrary';
import TextSet from './textSet';
import { TEXT_SET_ACTIONS, getTextSetReducer } from './getTextSetReducer';

const TextSetContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 12px;
  column-gap: 12px;
  margin-top: 28px;
`;

/* Undo the -1.5em set by the Pane */
const CategoryWrapper = styled.div`
  margin-left: -${PANE_PADDING};
  margin-right: -${PANE_PADDING};
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

const RENDER_TEXT_SET_DELAY = 10;

function TextSets() {
  const { textSets } = useLibrary(({ state: { textSets } }) => ({ textSets }));

  const [selectedCat, setSelectedCat] = useState(
    localStore.getItemByKey(`${LOCAL_STORAGE_PREFIX.TEXT_SET_SETTINGS}`)
      ?.selectedCategory
  );

  const ref = useRef();

  const allTextSets = useMemo(() => Object.values(textSets).flat(), [textSets]);
  const categories = useMemo(
    () =>
      Object.keys(textSets).map((cat) => ({
        id: cat,
        label: CATEGORIES[cat] ?? cat,
      })),
    [textSets]
  );

  const textSetReducer = useMemo(
    () => getTextSetReducer(textSets, allTextSets),
    [textSets, allTextSets]
  );

  const [{ filteredTextSets, renderedTextSets }, dispatch] = useReducer(
    textSetReducer,
    {
      filteredTextSets: [],
      renderedTextSets: [],
    }
  );

  const handleSelectedCategory = useCallback((selectedCategory) => {
    setSelectedCat(selectedCategory);
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TEXT_SET_SETTINGS}`, {
      selectedCategory,
    });
  }, []);

  useEffect(() => {
    dispatch({ type: TEXT_SET_ACTIONS.RESET, payload: selectedCat });
  }, [selectedCat, textSets, allTextSets]);

  useEffect(() => {
    if (renderedTextSets.length >= filteredTextSets.length) {
      return () => {};
    }

    const loadingTimeoutId = window.setTimeout(() => {
      dispatch({
        type: TEXT_SET_ACTIONS.RENDER_NEXT_TEXT_SET,
      });
    }, RENDER_TEXT_SET_DELAY);

    return () => {
      window.clearTimeout(loadingTimeoutId);
    };
  }, [renderedTextSets, filteredTextSets]);

  useRovingTabIndex({ ref });

  const sectionId = `section-${uuidv4()}`;
  const title = __('Text Sets', 'web-stories');
  return (
    <Section id={sectionId} title={title}>
      <CategoryWrapper>
        <PillGroup
          items={categories}
          selectedItemId={selectedCat}
          selectItem={handleSelectedCategory}
          deselectItem={() => handleSelectedCategory(null)}
        />
      </CategoryWrapper>
      <UnitsProvider
        pageSize={{
          width: TEXT_SET_SIZE,
          height: TEXT_SET_SIZE / PAGE_RATIO,
        }}
      >
        <TextSetContainer ref={ref} role="list" aria-labelledby={sectionId}>
          {renderedTextSets.map(
            (elements) =>
              elements.length > 0 && (
                <TextSet key={elements[0].id} elements={elements} />
              )
          )}
        </TextSetContainer>
      </UnitsProvider>
    </Section>
  );
}

export default TextSets;
