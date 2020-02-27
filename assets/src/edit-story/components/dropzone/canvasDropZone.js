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
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';
import StoryPropTypes from '../../types';
import { useUploader } from '../../app/uploader';
import { useMedia } from '../../app/media';
import { disableDefaults } from './utils';
import { OverContent, OverlayWrapper } from './shared';
import DropZone, { useDropZone } from './';

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
          insertMediaElement(mediaEl, DEFAULT_WIDTH, false);
        }
      );
    });
  };

  return (
    <DropZone onDropHandler={onDropHandler} dropZoneElement={dropZoneElement}>
      {isDragging(dropZoneElement) && <OverlayWrapper />}
      <OverContent>{children}</OverContent>
    </DropZone>
  );
}

CanvasDropzone.propTypes = {
  children: StoryPropTypes.children.isRequired,
};

export default CanvasDropzone;
