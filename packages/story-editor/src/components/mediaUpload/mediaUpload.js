/*
 * Copyright 2022 Google LLC
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
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import { useConfig, useLocalMedia, useStory } from '../../app';

function MediaUpload({ onUploadMedia, onDeleteMedia, onClose, ...props }) {
  const { allowedMimeTypes, MediaUpload: MediaUploader } = useConfig();

  const { deleteElementsByResourceId, updateStory, featuredMedia } = useStory(
    (state) => ({
      deleteElementsByResourceId: state.actions.deleteElementsByResourceId,
      updateStory: state.actions.updateStory,
      featuredMedia: state.state?.story?.featuredMedia || {},
    })
  );

  const { prependMedia, deleteMediaElement } = useLocalMedia(
    ({ actions: { prependMedia, deleteMediaElement } }) => {
      return {
        prependMedia,
        deleteMediaElement,
      };
    }
  );

  const uploadMedia = useCallback(
    (resource) => {
      const allowedTypes = [
        ...allowedMimeTypes.image,
        ...allowedMimeTypes.vector,
        ...allowedMimeTypes.video,
      ];

      // When uploading a new item in the media modal, we want to
      // directly add them to the library, but only
      // if it's a supported type and not for instance
      // TODO: Reconsider this approach for items like MOV or animated GIFs.
      if (allowedTypes.includes(resource.mimeType)) {
        prependMedia({
          media: [resource],
        });
      }

      if (onUploadMedia) {
        onUploadMedia(resource);
      }
    },
    [onUploadMedia, prependMedia, allowedMimeTypes]
  );

  const resetFeatureMedia = useCallback(
    (id) => {
      if (featuredMedia?.id === id) {
        updateStory({
          properties: {
            featuredMedia: {},
          },
        });
      }
    },
    [featuredMedia, updateStory]
  );

  const deleteMedia = useCallback(
    (resource) => {
      const { id } = resource;
      deleteMediaElement({ id: id });
      deleteElementsByResourceId({ id: id });
      resetFeatureMedia(id);
      if (onDeleteMedia) {
        onDeleteMedia(resource);
      }
    },
    [
      deleteElementsByResourceId,
      deleteMediaElement,
      onDeleteMedia,
      resetFeatureMedia,
    ]
  );

  return (
    <MediaUploader
      onUploadMedia={uploadMedia}
      onDeleteMedia={deleteMedia}
      onClose={onClose}
      {...props}
    />
  );
}

MediaUpload.propTypes = {
  onUploadMedia: PropTypes.func,
  onDeleteMedia: PropTypes.func,
  onClose: PropTypes.func,
};
export default MediaUpload;
