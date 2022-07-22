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
import { useCallback, useState, useEffect } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import { useConfig, useLocalMedia, useStory } from '../../app';

function MediaUpload({
  onUploadMedia,
  onDeleteMedia,
  onClose: onCloseCallback,
  ...props
}) {
  const { MediaUpload: MediaUploader } = useConfig();
  const [newResources, setNewResources] = useState([]);
  const [doProcess, setDoProcess] = useState(false);

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

  useEffect(() => {
    if (doProcess && newResources.length) {
      prependMedia({
        media: newResources,
      });
      setDoProcess(false);
      setNewResources([]);
    }
  }, [doProcess, newResources, prependMedia]);

  const onClose = useCallback(() => {
    if (onCloseCallback) {
      onCloseCallback();
    }
    setDoProcess(true);
  }, [onCloseCallback]);

  const uploadMedia = useCallback(
    (resource) => {
      if (['image', 'video', 'gif'].includes(resource.type)) {
        setNewResources((state) => [resource, ...state]);
      }
      if (onUploadMedia) {
        onUploadMedia(resource);
      }
    },
    [onUploadMedia]
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
      deleteMediaElement({ id: resource.id });
      deleteElementsByResourceId({ id: resource.id });
      setNewResources((state) => state.filter(({ id }) => id !== resource.id));
      resetFeatureMedia(resource.id);
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
