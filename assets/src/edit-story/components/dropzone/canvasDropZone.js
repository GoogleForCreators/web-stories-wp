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
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { useRef } from 'react';
import StoryPropTypes from '../../types';
import { useUploader } from '../../app/uploader';
import { useMedia } from '../../app/media';
import { useConfig } from '../../app/config';
import { INSPECTOR_MAX_WIDTH } from '../../constants';
import { disableDefaults } from './utils';
import { Heading, Icon, OverContent, OverlayWrapper, Text } from './shared';
import DropZone, { useDropZone } from './';

const Overlay = styled.div`
  position: absolute;
  top: 40%;
  text-align: center;
  width: 100%;
  z-index: 999;
  padding-right: ${INSPECTOR_MAX_WIDTH}px;
`;

function CanvasDropzone({ children }) {
  const dropZoneElement = useRef(null);
  const {
    actions: { isDragging },
  } = useDropZone();
  const { uploadFile } = useUploader();
  const {
    state: { DEFAULT_WIDTH },
    actions: { insertMediaElement },
  } = useMedia();
  const { allowedFileTypes } = useConfig();

  const onDropHandler = (evt) => {
    disableDefaults(evt);
    const files = [...evt.dataTransfer.files];
    files.forEach((file) => {
      uploadFile(file).then(
        ({
          id,
          guid: { rendered: src },
          media_details: { width: oWidth, height: oHeight },
          mime_type: mimeType,
          featured_media: posterId,
          featured_media_src: poster,
        }) => {
          const mediaEl = {
            id,
            posterId,
            poster,
            src,
            oWidth,
            oHeight,
            mimeType,
          };
          insertMediaElement(
            mediaEl,
            DEFAULT_WIDTH,
            undefined /** height */,
            false /** isBackground */
          );
        }
      );
    });
  };

  return (
    <DropZone onDropHandler={onDropHandler} dropZoneElement={dropZoneElement}>
      {isDragging(dropZoneElement) && (
        <OverlayWrapper>
          <Overlay>
            <Icon />
            <Heading>
              {__(
                'Upload to media library and add to the page.',
                'web-stories'
              )}
            </Heading>
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
    </DropZone>
  );
}

CanvasDropzone.propTypes = {
  children: StoryPropTypes.children.isRequired,
};

export default CanvasDropzone;
