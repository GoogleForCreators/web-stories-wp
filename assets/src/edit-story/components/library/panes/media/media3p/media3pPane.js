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
import { rgba } from 'polished';
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
import { ProviderType } from '../common/providerType';
import { SearchInput } from '../../../common';
import useLibrary from '../../../useLibrary';
import Flags from '../../../../../flags';
import paneId from './paneId';
import ProviderTab from './providerTab';

const ProviderTabSection = styled.div`
  margin-top: 30px;
  padding: 0 24px;
`;

const CategorySection = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v3};
  min-height: 94px;
  padding: 30px 24px;
`;

export const AttributionPill = styled.div`
  position: absolute;
  left: 28px;
  bottom: 10px;
  height: 20px;
  padding: 2px 10px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.7)};
  border-radius: 100px;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
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
    selectedProvider,
    searchTerm,
    setSelectedProvider,
    setSearchTerm,
  } = useMedia3p(({ state, actions }) => ({
    selectedProvider: state.selectedProvider,
    searchTerm: state.searchTerm,
    setSelectedProvider: actions.setSelectedProvider,
    setSearchTerm: actions.setSearchTerm,
  }));

  useEffect(() => {
    if (isActive) {
      setSelectedProvider({ provider: ProviderType.UNSPLASH });
    }
  }, [isActive, setSelectedProvider]);

  const {
    media,
    hasMore,
    setNextPage,
    isMediaLoading,
    isMediaLoaded,
  } = useMedia3pForProvider(
    selectedProvider ?? ProviderType.UNSPLASH,
    ({
      state: { media, hasMore, isMediaLoading, isMediaLoaded },
      actions: { setNextPage },
    }) => ({ media, hasMore, isMediaLoading, isMediaLoaded, setNextPage })
  );

  const onSearch = (v) => setSearchTerm({ searchTerm: v });

  const incrementalSearchDebounceMedia = useFeature(
    Flags.INCREMENTAL_SEARCH_DEBOUNCE_MEDIA
  );

  const onProviderTabClick = useCallback(
    (provider) => {
      setSelectedProvider({ provider });
    },
    [setSelectedProvider]
  );

  const attributionImage =
    selectedProvider === 'coverr' ? (
      <img
        height="10"
        alt="ALT"
        src="https://coverr.co/assets/images/coverr-main.svg"
      />
    ) : (
      <svg width="50" height="11.25" viewBox="0 0 50 11.25" fill="none">
        <rect width="50" height="11.25" fill="url(#pattern0)" />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              href="#image0"
              transform="translate(0 -0.0135802) scale(0.00444444 0.0197531)"
            />
          </pattern>
          <image
            id="image0"
            width="225"
            height="52"
            href="data:image/png;base64,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"
          />
        </defs>
      </svg>
    );

  const openLink = useCallback(
    () =>
      window.open(
        selectedProvider === ProviderType.UNSPLASH
          ? 'https://unsplash.com'
          : 'https://coverr.co'
      ),
    [selectedProvider]
  );

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
              active={selectedProvider == ProviderType.UNSPLASH}
              onClick={() => onProviderTabClick(ProviderType.UNSPLASH)}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <ProviderTab
              name={'Coverr'}
              active={selectedProvider == ProviderType.COVERR}
              onClick={() => onProviderTabClick(ProviderType.COVERR)}
            />
          </ProviderTabSection>
          {selectedProvider === ProviderType.UNSPLASH ? (
            <CategorySection>
              {__('Coming soon', 'web-stories')}
            </CategorySection>
          ) : null}
        </PaneHeader>
        <PaginatedMediaGallery
          providerType={selectedProvider ?? ProviderType.UNSPLASH}
          resources={media}
          isMediaLoading={isMediaLoading}
          isMediaLoaded={isMediaLoaded}
          hasMore={hasMore}
          onInsert={insertMediaElement}
          setNextPage={setNextPage}
        />
        <AttributionPill onClick={openLink}>
          {'Powered by'}&nbsp;{attributionImage}
        </AttributionPill>
      </PaneInner>
    </StyledPane>
  );
}

Media3pPane.propTypes = {
  isActive: PropTypes.bool,
};

export default Media3pPane;
