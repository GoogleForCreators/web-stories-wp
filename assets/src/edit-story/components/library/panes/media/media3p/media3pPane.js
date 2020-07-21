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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useEffect } from 'react';
import { useFeature } from 'flagged';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import {
  useMedia3p,
  useMedia3pForProvider,
} from '../../../../../app/media/media3p/useMedia3p';
import {
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import { SearchInput } from '../../../common';
import useLibrary from '../../../useLibrary';
import { ProviderType } from '../common/providerType';
import Flags from '../../../../../flags';
import paneId from './paneId';
import ProviderTab from './providerTab';

const ProviderTabSection = styled.div`
  margin-top: 30px;
  padding: 0 24px;
`;

// TODO:(https://github.com/google/web-stories-wp/issues/2360)
// Category should be collapsible and expandable.
const CategorySection = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v3};
  min-height: 94px;
  padding: 30px 24px;
  display: flex;
  flex-wrap: wrap;
`;

export const Pill = styled.span`
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.fg.v1};
  background-color: rgba(
    255,
    255,
    255,
    ${(props) => (props.isSelected ? 0.1 : 0)}
  );
  margin: 4px;
  padding: 6px 12px;
  border-radius: 2px;
  font-size: 14px;
  user-select: none;
  background-clip: padding-box;
  :hover {
    background-color: rgba(
      255,
      255,
      255,
      ${(props) => (props.isSelected ? 0.1 : 0.05)}
    );
  }
`;

Pill.propTypes = {
  isSelected: PropTypes.bool,
};

// TODO:(https://github.com/google/web-stories-wp/issues/2362)
// Wire up pill list to state and remove these fake pills.
const fakePillList = ['COVID-19', 'Nature', 'Wallpapers', 'People'];
const selectedPill = 'Nature';
/**
 * Pane that contains the media 3P integrations.
 *
 * @param {Object} props Component props
 * @return {*} The media pane element for 3P integrations.
 */
function Media3pPane(props) {
  const { isActive } = props;

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource) => insertElement(resource.type, { resource }),
    [insertElement]
  );

  const { searchTerm, setSelectedProvider, setSearchTerm } = useMedia3p(
    ({ state, actions }) => ({
      searchTerm: state.searchTerm,
      setSelectedProvider: actions.setSelectedProvider,
      setSearchTerm: actions.setSearchTerm,
    })
  );

  useEffect(() => {
    if (isActive) {
      setSelectedProvider({ provider: 'unsplash' });
    }
  }, [isActive, setSelectedProvider]);

  const {
    media,
    hasMore,
    setNextPage,
    isMediaLoading,
    isMediaLoaded,
  } = useMedia3pForProvider(
    'unsplash',
    ({
      state: { media, hasMore, isMediaLoading, isMediaLoaded },
      actions: { setNextPage },
    }) => ({ media, hasMore, isMediaLoading, isMediaLoaded, setNextPage })
  );

  const onSearch = (v) => setSearchTerm({ searchTerm: v });

  const incrementalSearchDebounceMedia = useFeature(
    Flags.INCREMENTAL_SEARCH_DEBOUNCE_MEDIA
  );

  const onProviderTabClick = useCallback(() => {
    // TODO(#2393): set state.
  }, []);

  // TODO(#2368): handle pagination / infinite scrolling
  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <PaneHeader>
          <SearchInputContainer>
            <SearchInput
              initialValue={searchTerm}
              placeholder={__('Search', 'web-stories')}
              onSearch={onSearch}
              incremental={incrementalSearchDebounceMedia}
            />
          </SearchInputContainer>
          <ProviderTabSection>
            <ProviderTab
              name={'Unsplash'}
              active={true}
              onClick={onProviderTabClick}
            />
          </ProviderTabSection>
          <CategorySection>
            {fakePillList.map((e, i) => (
              <Pill isSelected={e == selectedPill} key={i}>
                {e}
              </Pill>
            ))}
          </CategorySection>
        </PaneHeader>
        <PaginatedMediaGallery
          providerType={ProviderType.UNSPLASH}
          resources={media}
          isMediaLoading={isMediaLoading}
          isMediaLoaded={isMediaLoaded}
          hasMore={hasMore}
          onInsert={insertMediaElement}
          setNextPage={setNextPage}
        />
      </PaneInner>
    </StyledPane>
  );
}

Media3pPane.propTypes = {
  isActive: PropTypes.bool,
};

export default Media3pPane;
