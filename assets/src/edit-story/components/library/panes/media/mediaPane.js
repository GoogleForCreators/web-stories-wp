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
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app/config';
import { useMedia } from '../../../../app/media';
import { useMediaPicker } from '../../../mediaPicker';
import { MainButton, Title, SearchInput, Header } from '../../common';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import { DEFAULT_DPR, PAGE_WIDTH } from '../../../../constants';
import paneId from './paneId';
import {
  getResourceFromMediaPicker,
  getResourceFromAttachment,
} from './mediaUtils';
import MediaElement from './mediaElement';

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
`;

const Column = styled.div``;

const Message = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 16px;
`;

const FilterButtons = styled.div`
  border-bottom: 1px solid ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  padding: 18px 0;
  margin: 10px 0 15px;
`;

const FilterButton = styled.button`
  border: 0;
  background: none;
  padding: 0;
  margin: 0 18px 0 0;
  color: ${({ theme, active }) =>
    active ? theme.colors.fg.v1 : theme.colors.mg.v1};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  font-size: 13px;
  text-transform: uppercase;
`;

const FILTERS = [
  { filter: '', name: __('All', 'web-stories') },
  { filter: 'image', name: __('Images', 'web-stories') },
  { filter: 'video', name: __('Video', 'web-stories') },
];

// By default, the element should be 50% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 2;
const PREVIEW_SIZE = 150;

function MediaPane(props) {
  const {
    state: { media, isMediaLoading, isMediaLoaded, mediaType, searchTerm },
    actions: { resetFilters, setMediaType, setSearchTerm },
  } = useMedia();

  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();

  const {
    actions: { insertElement },
  } = useLibrary();

  const onClose = resetFilters;

  /**
   * Callback of select in media picker to insert media element.
   *
   * @param {Object} mediaPickerEl Object coming from backbone media picker.
   */
  const onSelect = (mediaPickerEl) => {
    const resource = getResourceFromMediaPicker(mediaPickerEl);
    insertMediaElement(resource);
  };

  const openMediaPicker = useMediaPicker({
    onSelect,
    onClose,
  });

  /**
   * Handle search term changes.
   *
   * @param {Object} evt Doc Event
   */
  const onSearch = (evt) => {
    setSearchTerm({ searchTerm: evt.target.value });
  };

  /**
   * Filter REST API calls and re-request API.
   *
   * @param {string} filter Value that is passed to rest api to filter.
   */
  const onFilter = (filter) => () => {
    setMediaType({ mediaType: filter });
  };

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = (resource) => {
    const width = Math.min(resource.width * DEFAULT_DPR, DEFAULT_ELEMENT_WIDTH);
    return insertElement(resource.type, { resource, width });
  };

  /**
   * Check if number is odd or even.
   *
   * @param {number} n Number
   * @return {boolean} Is even.
   */
  const isEven = (n) => {
    return n % 2 === 0;
  };

  const resources = media
    .filter(
      ({ mimeType }) =>
        allowedImageMimeTypes.includes(mimeType) ||
        allowedVideoMimeTypes.includes(mimeType)
    )
    .map((attachment) => getResourceFromAttachment(attachment));

  return (
    <Pane id={paneId} {...props}>
      <Header>
        <Title>
          {__('Media', 'web-stories')}
          {(!isMediaLoaded || isMediaLoading) && <Spinner />}
        </Title>
        <MainButton onClick={openMediaPicker}>
          {__('Upload', 'web-stories')}
        </MainButton>
      </Header>

      <SearchInput
        value={searchTerm}
        placeholder={__('Search media...', 'web-stories')}
        onChange={onSearch}
      />

      <FilterButtons>
        {FILTERS.map(({ filter, name }, index) => (
          <FilterButton
            key={index}
            active={filter === mediaType}
            onClick={onFilter(filter)}
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
            {resources
              .filter((_, index) => isEven(index))
              .map((resource) => (
                <MediaElement
                  resource={resource}
                  key={resource.src}
                  width={PREVIEW_SIZE}
                  onInsert={insertMediaElement}
                />
              ))}
          </Column>
          <Column>
            {resources
              .filter((_, index) => !isEven(index))
              .map((resource) => (
                <MediaElement
                  resource={resource}
                  key={resource.src}
                  width={PREVIEW_SIZE}
                  onInsert={insertMediaElement}
                />
              ))}
          </Column>
        </Container>
      )}
    </Pane>
  );
}

export default MediaPane;
