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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
/**
 * External dependencies
 */
import { useRef } from 'react';
/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';
import StoryPropTypes from '../../types';
import { useUploader } from '../../app/uploader';
import { disableDefaults } from './utils';
import {
  DropzoneComponent,
  OverlayWrapper,
  Overlay,
  Icon,
  Heading,
  Text,
  OverContent,
} from './shared';
import DropZone, { useDropZone } from './';

function MediaDropzone({ children }) {
  const {
    actions: { isDragging },
  } = useDropZone();
  const { uploadFile } = useUploader();
  const { allowedFileTypes } = useConfig();
  const dropZoneElement = useRef(null);

  const onDropHandler = (evt) => {
    disableDefaults(evt);
    const files = [...evt.dataTransfer.files];
    files.forEach(uploadFile);
  };

  return (
    <DropzoneComponent>
      <DropZone onDropHandler={onDropHandler} dropZoneElement={dropZoneElement}>
        {isDragging(dropZoneElement) && (
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
      </DropZone>
    </DropzoneComponent>
  );
}

MediaDropzone.propTypes = {
  children: StoryPropTypes.children.isRequired,
};

export default MediaDropzone;
