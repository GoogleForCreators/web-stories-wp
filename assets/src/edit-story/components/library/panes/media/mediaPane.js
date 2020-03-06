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
import { useEffect } from 'react';
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
import Dropzone from '../../dropzone';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import paneId from './paneId';

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
`;

const Column = styled.div``;

export const styledTiles = css`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Image = styled.img`
  ${styledTiles}
`;

const Video = styled.video`
  ${styledTiles}
`;

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

const DEFAULT_WIDTH = 150;

function MediaPane(props) {
  const {
    state: { media, isMediaLoading, isMediaLoaded, mediaType, searchTerm },
    actions: {
      loadMedia,
      reloadMedia,
      resetMedia,
      setMediaType,
      setSearchTerm,
      uploadVideoFrame,
    },
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

  useEffect(loadMedia);

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

  const openMediaPicker = useMediaPicker({
    onSelect,
    onClose,
  });

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

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} attachment Attachment object
   * @param {number} width      Width that element is inserted into editor.
   * @return {null|*}          Return onInsert or null.
   */
  const insertMediaElement = (attachment, width) => {
    const { src, mimeType, oWidth, oHeight } = attachment;
    const origRatio = oWidth / oHeight;
    const height = width / origRatio;
    if (allowedImageMimeTypes.includes(mimeType)) {
      return insertElement('image', {
        src,
        width,
        height,
        x: 5,
        y: 5,
        rotationAngle: 0,
        origRatio,
        origWidth: oWidth,
        origHeight: oHeight,
      });
    } else if (allowedVideoMimeTypes.includes(mimeType)) {
      const { id: videoId, poster, posterId: posterIdRaw } = attachment;
      const posterId = parseInt(posterIdRaw);
      const videoEl = insertElement('video', {
        src,
        width,
        height,
        x: 5,
        y: 5,
        rotationAngle: 0,
        origRatio,
        origWidth: oWidth,
        origHeight: oHeight,
        mimeType,
        videoId,
        posterId,
        poster,
      });

      // Generate video poster if one not set.
      if (videoId && !posterId) {
        uploadVideoFrame(videoId, src, videoEl.id);
      }

      return videoEl;
    }
    return null;
  };

  /**
   * Get a formatted element for different media types.
   *
   * @param {Object} mediaEl Attachment object
   * @param {number} width      Width that element is inserted into editor.
   * @return {null|*}          Element or null if does not map to video/image.
   */
  const getMediaElement = (mediaEl, width) => {
    const { src, oWidth, oHeight, mimeType } = mediaEl;
    const origRatio = oWidth / oHeight;
    const height = width / origRatio;
    if (allowedImageMimeTypes.includes(mimeType)) {
      return (
        <Image
          key={src}
          src={src}
          width={width}
          height={height}
          loading={'lazy'}
          onClick={() => insertMediaElement(mediaEl, width)}
        />
      );
    } else if (allowedVideoMimeTypes.includes(mimeType)) {
      return (
        <Video
          key={src}
          width={width}
          height={height}
          onClick={() => insertMediaElement(mediaEl, width)}
          onPointerEnter={(evt) => {
            evt.target.play();
          }}
          onPointerLeave={(evt) => {
            evt.target.pause();
            evt.target.currentTime = 0;
          }}
        >
          <source src={src} type={mimeType} />
        </Video>
      );
    }
    return null;
  };

  return (
    <Pane id={paneId} {...props}>
      <Dropzone>
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
    </Pane>
  );
}

export default MediaPane;
