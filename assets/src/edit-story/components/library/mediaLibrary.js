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
import styled, { css } from 'styled-components';

/**
 * WordPress dependencies
 */
import { Spinner, Dashicon } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */

import { useMedia } from '../../app/media';
import UploadButton from '../uploadButton';
import Dropzone from './dropzone';

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
`;

const Column = styled.div``;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.fg.v1};
  margin: 0;
  font-size: 19px;
  line-height: 1.4;
  flex: 3 0 0;
`;

const Header = styled.div`
  display: flex;
  margin: 0 0 25px;
`;

const Message = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 19px;
`;

const FilterButtons = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.mg.v1};
  padding: 18px 0;
  margin: 10px 0 15px;
`;

const FilterButton = styled.button`
  border: 0;
  background: none;
  padding: 0;
  margin: 0 28px 0 0;
  color: ${({ theme, active }) =>
    active ? theme.colors.fg.v1 : theme.colors.mg.v1};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  font-size: 13px;
`;

const SearchField = styled.div`
  position: relative;
`;

const Search = styled.input.attrs({ type: 'text' })`
  width: 100%;
  background: ${({ theme }) => theme.colors.mg.v1} !important;
  border-color: ${({ theme }) => theme.colors.mg.v1} !important;
  color: ${({ theme }) => theme.colors.mg.v2} !important;
  padding: 2px 10px 2px 33px !important;

  &::placeholder {
    color: ${({ theme }) => theme.colors.mg.v2};
  }
`;

const Icon = styled(Dashicon)`
  position: absolute;
  top: 8px;
  left: 10px;
  fill: ${({ theme }) => theme.colors.mg.v2};
`;

const buttonStyles = css`
  background: none;
  color: ${({ theme }) => theme.colors.fg.v1};
  padding: 5px;
  font-weight: bold;
  flex: 1 0 0;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.mg.v1};
  border-radius: 3px;
`;

const FILTERS = [
  { filter: '', name: __('All', 'web-stories') },
  { filter: 'image', name: __('Images', 'web-stories') },
  { filter: 'video', name: __('Video', 'web-stories') },
];

function MediaLibrary() {
  const {
    state: {
      media,
      isMediaLoading,
      isMediaLoaded,
      mediaType,
      searchTerm,
      DEFAULT_WIDTH,
    },
    actions: {
      loadMedia,
      reloadMedia,
      resetMedia,
      setMediaType,
      setSearchTerm,
      insertMediaElement,
      getMediaElement,
    },
  } = useMedia();

  useEffect(loadMedia);

  /**
   * Check if number is odd or even.
   *
   * @param {number} n Number
   * @return {boolean} Is even.
   */
  const isEven = (n) => {
    return n % 2 === 0;
  };

  /**
   * Handle search term changes.
   *
   * @param {Object} evt Doc Event
   */
  const onSearch = (evt) => {
    setSearchTerm(evt.target.value);
    reloadMedia();
  };

  /**
   * Filter REST API calls and re-request API.
   *
   * @param {string} filter Value that is passed to rest api to filter.
   */
  const onFilter = (filter) => {
    if (filter !== mediaType) {
      setMediaType(filter);
      reloadMedia();
    }
  };

  const onClose = resetMedia;

  /**
   * Callback of select in media picker to insert media element.
   *
   * @param {Object} attachment Attachment object from backbone media picker.
   */
  const onSelect = (attachment) => {
    const {
      url: src,
      mime: mimeType,
      width: oWidth,
      height: oHeight,
      id,
      featured_media: posterId,
      featured_media_src: poster,
    } = attachment;
    const mediaEl = { src, mimeType, oWidth, oHeight, id, posterId, poster };
    insertMediaElement(mediaEl, DEFAULT_WIDTH);
  };

  return (
    <Dropzone>
      <Header>
        <Title>
          {__('Media', 'web-stories')}
          {(!isMediaLoaded || isMediaLoading) && <Spinner />}
        </Title>
        <UploadButton
          onClose={onClose}
          onSelect={onSelect}
          buttonCSS={buttonStyles}
        />
      </Header>

      <SearchField>
        <Icon icon="search" />
        <Search
          value={searchTerm}
          placeholder={__('Search Media', 'web-stories')}
          onChange={onSearch}
        />
      </SearchField>

      <FilterButtons>
        {FILTERS.map(({ filter, name }, index) => (
          <FilterButton
            key={index}
            active={filter === mediaType}
            onClick={() => onFilter(filter)}
          >
            {name}
          </FilterButton>
        ))}
      </FilterButtons>

      {isMediaLoaded && !media.length ? (
        <Message>{__('No media found', 'web-stories')}</Message>
      ) : (
        <Container>
          <Column>
            {media.map((mediaEl, index) => {
              return isEven(index)
                ? getMediaElement(mediaEl, DEFAULT_WIDTH)
                : null;
            })}
          </Column>
          <Column>
            {media.map((mediaEl, index) => {
              return !isEven(index)
                ? getMediaElement(mediaEl, DEFAULT_WIDTH)
                : null;
            })}
          </Column>
        </Container>
      )}
    </Dropzone>
  );
}

export default MediaLibrary;
