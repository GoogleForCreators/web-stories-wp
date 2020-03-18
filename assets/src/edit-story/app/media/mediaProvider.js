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
import { useEffect, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useAPI } from '../api';
import { useUploader } from '../uploader';
import { useStory } from '../story';
import {
  getResourceFromLocalFile,
  getResourceFromUploadAPI,
} from '../../components/library/panes/media/mediaUtils';
import useInsertElement from '../../components/canvas/useInsertElement';
import useUploadVideoFrame from './utils/useUploadVideoFrame';
import useMediaReducer from './useMediaReducer';
import Context from './context';

function MediaProvider({ children }) {
  const { state, actions } = useMediaReducer();
  const { uploadFile } = useUploader();
  const {
    actions: { updateElementById },
  } = useStory();
  const insertElement = useInsertElement();
  const { uploadVideoFrame } = useUploadVideoFrame();
  const { media, mediaType, searchTerm } = state;
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    resetFilters,
    setMediaType,
    setSearchTerm,
  } = actions;

  const {
    actions: { getMedia },
  } = useAPI();

  const fetchMedia = useCallback(() => {
    fetchMediaStart();
    getMedia({ mediaType, searchTerm })
      .then((res) => {
        fetchMediaSuccess({ media: res, mediaType, searchTerm });
      })
      .catch(fetchMediaError);
  }, [
    fetchMediaError,
    fetchMediaStart,
    fetchMediaSuccess,
    getMedia,
    mediaType,
    searchTerm,
  ]);

  const uploadMediaFromLibrary = useCallback(
    async (files) => {
      try {
        const localMedia = await Promise.all(
          files.map(getResourceFromLocalFile)
        );
        const filesUploading = files.map((file) => uploadFile(file));
        fetchMediaSuccess({
          media: [...localMedia, ...media],
          mediaType,
          searchTerm,
        });
        await Promise.all(filesUploading);

        // To avoid race conditions updating media library, a new request is necessary
        fetchMedia();
      } catch (e) {
        fetchMediaError(e);
      }
    },
    [
      fetchMedia,
      fetchMediaSuccess,
      fetchMediaError,
      uploadFile,
      media,
      mediaType,
      searchTerm,
    ]
  );

  const uploadMediaFromWorkspace = useCallback(
    async (files) => {
      try {
        const filesOnCanvas = await Promise.all(
          files.map(async (file) => {
            const resource = await getResourceFromLocalFile(file);
            const element = insertElement(resource.type, { resource });

            return {
              element,
              file,
            };
          })
        );

        fetchMediaSuccess({
          media: [
            ...filesOnCanvas.map(({ element: { resource } }) => resource),
            ...media,
          ],
          mediaType,
          searchTerm,
        });

        await Promise.all(
          filesOnCanvas.map(async ({ element, file }) => {
            const uploadedFile = await uploadFile(file);
            const resource = getResourceFromUploadAPI(uploadedFile);

            updateElementById({
              elementId: element.elementId,
              properties: {
                resource: {
                  ...resource,
                  poster: resource.poster,
                },
                type: element.resource.type,
              },
            });

            return resource;
          })
        );

        // To avoid race conditions updating media library, a new request is necessary
        fetchMedia();
      } catch (e) {
        fetchMediaError(e);
      }
    },
    [
      fetchMedia,
      fetchMediaSuccess,
      fetchMediaError,
      uploadFile,
      insertElement,
      updateElementById,
      media,
      mediaType,
      searchTerm,
    ]
  );

  useEffect(fetchMedia, [fetchMedia, mediaType, searchTerm]);

  const context = {
    state,
    actions: {
      ...actions,
      setMediaType,
      setSearchTerm,
      fetchMedia,
      resetFilters,
      uploadVideoFrame,
      uploadMediaFromLibrary,
      uploadMediaFromWorkspace,
    },
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

MediaProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default MediaProvider;
