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
import { useState, useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useUploader } from '../../../app/uploader';
import StoryPropTypes from '../../../types';
import { useConfig } from '../../../app/config';
import { useMedia } from '../../../app/media';
import { getResourceFromLocalFile } from '../../../components/library/panes/media/mediaUtils';
import { ReactComponent as UploadIcon } from './icons/upload.svg';

const DropzoneComponent = styled.div`
  min-width: 100%;
  min-height: 100%;
`;
const OverContent = styled.div``;

const OverlayWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v1, 0.6)};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
`;
const Heading = styled.h4`
  color: ${({ theme }) => theme.colors.fg.v1};
  margin: 0;
`;
const Text = styled.p`
  color: ${({ theme }) => theme.colors.fg.v1};
`;
const Icon = styled(UploadIcon)`
  height: 54px;
  width: 54px;
  fill: ${({ theme }) => theme.colors.fg.v1};
`;
const Overlay = styled.div`
  position: absolute;
  top: 45%;
  text-align: center;
  width: 100%;
`;

function Dropzone({ children }) {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFile } = useUploader();
  const {
    state: { media, mediaType, searchTerm },
    actions: { fetchMediaSuccess },
  } = useMedia();
  const { allowedFileTypes } = useConfig();

  const ref = useRef(null);

  const disableDefaults = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const onDragEnter = (evt) => {
    disableDefaults(evt);
    evt.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
  };

  const onDragLeave = (evt) => {
    disableDefaults(evt);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (
        evt.clientY < rect.top ||
        evt.clientY >= rect.bottom ||
        evt.clientX < rect.left ||
        evt.clientX >= rect.right
      ) {
        setIsDragging(false);
      }
    }
  };

  const onDropHandler = async (evt) => {
    disableDefaults(evt);
    const files = [...evt.dataTransfer.files];
    const localFiles = files.map(getResourceFromLocalFile);
    const localMedia = await Promise.all(localFiles);
    const filesUploading = files.map((file) => uploadFile(file));

    fetchMediaSuccess({
      media: [...localMedia, ...media],
      mediaType,
      searchTerm,
    });
    setIsDragging(false);

    Promise.all(filesUploading).then((uploadedFiles) => {
      const uploadedMedia = uploadedFiles.map(
        ({
          guid: { rendered: src },
          media_details: {
            width: oWidth,
            height: oHeight,
            length_formatted: lengthFormatted,
          },
          mime_type: mimeType,
          featured_media: posterId,
          featured_media_src: poster,
        }) => ({
          posterId,
          poster,
          src,
          oWidth,
          oHeight,
          mimeType,
          lengthFormatted,
        })
      );

      fetchMediaSuccess({
        media: [...uploadedMedia, ...media],
        mediaType,
        searchTerm,
      });
    });
  };

  return (
    <DropzoneComponent
      onDragOver={disableDefaults}
      onDragLeave={onDragLeave}
      onDragEnter={onDragEnter}
      onDrop={onDropHandler}
      ref={ref}
    >
      {isDragging && (
        <OverlayWrapper>
          <Overlay>
            <Icon />
            <Heading>{__('Upload to media library', 'web-stories')}</Heading>
            <Text>
              {sprintf(
                /* translators: %s is a list of allowed file extensions. */
                __('You can upload %s.', 'web-stories'),
                allowedFileTypes.join(', ')
              )}
            </Text>
          </Overlay>
        </OverlayWrapper>
      )}
      <OverContent>{children}</OverContent>
    </DropzoneComponent>
  );
}

Dropzone.propTypes = {
  children: StoryPropTypes.children.isRequired,
};

export default Dropzone;
