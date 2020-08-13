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
import { useCallback, useEffect, useRef } from 'react';
import { useFeature, useFeatures } from 'flagged';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import useMedia from '../../../../../app/media/useMedia';
import {
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import { SearchInput } from '../../../common';
import useLibrary from '../../../useLibrary';
import Flags from '../../../../../flags';
import { PROVIDERS } from '../../../../../app/media/media3p/providerConfiguration';
import Media3pCategories from './media3pCategories';
import paneId from './paneId';
import ProviderTab from './providerTab';

const ProviderTabSection = styled.div`
  margin-top: 30px;
  padding: 0 24px;
`;

const MediaSubheading = styled.div`
  margin-top: 24px;
  padding: 0 24px;
  visibility: ${(props) => (props.shouldDisplay ? 'inherit' : 'hidden')};
`;

const PaneBottom = styled.div`
  position: relative;
  height: 100%;
  flex: 0 1 auto;
  min-height: 0;
`;

const ProviderMediaCategoriesWrapper = styled.div`
  position: absolute;
  visibility: hidden;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  min-height: 100px;
  &.provider-selected {
    position: relative;
    visibility: visible;
  }
`;

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

  const {
    searchTerm,
    selectedProvider,
    setSelectedProvider,
    setSearchTerm,
    media3p,
  } = useMedia(
    ({
      media3p: {
        state: { selectedProvider, searchTerm },
        actions: { setSelectedProvider, setSearchTerm },
      },
      media3p,
    }) => ({
      searchTerm,
      selectedProvider,
      setSelectedProvider,
      setSearchTerm,
      media3p,
    })
  );

  useEffect(() => {
    if (isActive && !selectedProvider) {
      setSelectedProvider({ provider: Object.keys(PROVIDERS)[0] });
    }
  }, [isActive, selectedProvider, setSelectedProvider]);

  const onSearch = (v) => setSearchTerm({ searchTerm: v });

  const incrementalSearchDebounceMedia = useFeature(
    Flags.INCREMENTAL_SEARCH_DEBOUNCE_MEDIA
  );

  const paneBottomRef = useRef();

  const onProviderTabClick = useCallback(
    (providerType) => {
      setSelectedProvider({ provider: providerType });
    },
    [setSelectedProvider]
  );

  const features = useFeatures();
  const enabledProviders = Object.keys(PROVIDERS).filter(
    (p) => !PROVIDERS[p].featureName || features[PROVIDERS[p].featureName]
  );

  function getProviderMediaAndCategories(providerType) {
    const wrapperProps =
      providerType === selectedProvider
        ? { className: 'provider-selected' }
        : { 'aria-hidden': 'true' };
    const state = media3p[providerType].state;
    const actions = media3p[providerType].actions;
    const displayName = state.categories.selectedCategoryId
      ? state.categories.categories.find(
          (e) => e.id === state.categories.selectedCategoryId
        ).displayName
      : __('Trending', 'web-stories');

    // We display the media name if there's media to display or a category has
    // been selected.
    const shouldDisplayMediaSubheading = Boolean(
      state.media?.length || state.categories.selectedCategoryId
    );
    return (
      <ProviderMediaCategoriesWrapper
        dataProvider={providerType}
        {...wrapperProps}
        key={`provider-bottom-wrapper-${providerType}`}
        id={`provider-bottom-wrapper-${providerType}`}
      >
        {PROVIDERS[providerType].supportsCategories && (
          <Media3pCategories
            categories={state.categories.categories}
            selectedCategoryId={state.categories.selectedCategoryId}
            selectCategory={actions.selectCategory}
            deselectCategory={actions.deselectCategory}
          />
        )}
        <MediaSubheading
          data-testid={'media-subheading'}
          shouldDisplay={shouldDisplayMediaSubheading}
        >
          {displayName}
        </MediaSubheading>
        <PaginatedMediaGallery
          providerType={providerType}
          resources={state.media}
          isMediaLoading={state.isMediaLoading}
          isMediaLoaded={state.isMediaLoaded}
          hasMore={state.hasMore}
          setNextPage={actions.setNextPage}
          onInsert={insertMediaElement}
          searchTerm={searchTerm}
          selectedCategoryId={state.categories.selectedCategoryId}
        />
      </ProviderMediaCategoriesWrapper>
    );
  }

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
              disabled={Boolean(
                selectedProvider &&
                  PROVIDERS[selectedProvider].supportsCategories &&
                  media3p[selectedProvider].categories?.selectedCategoryId
              )}
            />
          </SearchInputContainer>
          <ProviderTabSection>
            {enabledProviders.map((providerType) => (
              <ProviderTab
                key={`provider-tab-${providerType}`}
                id={`provider-tab-${providerType}`}
                name={PROVIDERS[providerType].displayName}
                active={selectedProvider === providerType}
                onClick={() => onProviderTabClick(providerType)}
              />
            ))}
          </ProviderTabSection>
        </PaneHeader>
        <PaneBottom ref={paneBottomRef}>
          {enabledProviders.map((providerType) =>
            getProviderMediaAndCategories(providerType)
          )}
        </PaneBottom>
      </PaneInner>
    </StyledPane>
  );
}

Media3pPane.propTypes = {
  isActive: PropTypes.bool,
};

export default Media3pPane;
