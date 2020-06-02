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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import addQueryArgs from '../../utils/addQueryArgs';
import { DATA_VERSION } from '../../migration';
import { useConfig } from '../';
import Context from './context';

function APIProvider({ children }) {
  const {
    api: { stories, media, fonts, link, users },
  } = useConfig();

  const getStoryById = useCallback(
    (storyId) => {
      const path = addQueryArgs(`${stories}/${storyId}`, { context: `edit` });
      return apiFetch({ path });
    },
    [stories]
  );

  const getStorySaveData = ({
    pages,
    featuredMedia,
    stylePresets,
    publisherLogo,
    autoAdvance,
    defaultPageDuration,
    ...rest
  }) => {
    return {
      story_data: {
        version: DATA_VERSION,
        pages,
        autoAdvance,
        defaultPageDuration,
      },
      featured_media: featuredMedia,
      style_presets: stylePresets,
      publisher_logo: publisherLogo,
      ...rest,
    };
  };

  const saveStoryById = useCallback(
    /**
     * Fire REST API call to save story.
     *
     * @param {import('../../types').Story} story Story object.
     * @return {Promise} Return apiFetch promise.
     */
    (story) => {
      const { storyId } = story;
      return apiFetch({
        path: `${stories}/${storyId}`,
        data: getStorySaveData(story),
        method: 'POST',
      });
    },
    [stories]
  );

  const autoSaveById = useCallback(
    /**
     * Fire REST API call to save story.
     *
     * @param {import('../../types').Story} story Story object.
     * @return {Promise} Return apiFetch promise.
     */
    (story) => {
      const { storyId } = story;
      return apiFetch({
        path: `${stories}/${storyId}/autosaves`,
        data: getStorySaveData(story),
        method: 'POST',
      });
    },
    [stories]
  );

  const getMedia = useCallback(
    ({ mediaType, searchTerm, pagingNum }) => {
      let apiPath = media;
      const perPage = 100;
      apiPath = addQueryArgs(apiPath, {
        context: 'edit',
        per_page: perPage,
        page: pagingNum,
      });

      if (mediaType) {
        apiPath = addQueryArgs(apiPath, { media_type: mediaType });
      }

      if (searchTerm) {
        apiPath = addQueryArgs(apiPath, { search: searchTerm });
      }

      return apiFetch({ path: apiPath, parse: false }).then(
        async (response) => {
          const jsonArray = await response.json();
          return { data: jsonArray, headers: response.headers };
        }
      );
    },
    [media]
  );

  /**
   * Upload file to via REST API.
   *
   * @param {File}    file           Media File to Save.
   * @param {?Object} additionalData Additional data to include in the request.
   *
   * @return {Promise} Media Object Promise.
   */
  const uploadMedia = useCallback(
    (file, additionalData) => {
      // Create upload payload
      const data = new window.FormData();
      data.append('file', file, file.name || file.type.replace('/', '.'));
      Object.entries(additionalData).forEach(([key, value]) =>
        data.append(key, value)
      );

      // TODO: Intercept window.fetch here to support progressive upload indicator when uploading
      return apiFetch({
        path: media,
        body: data,
        method: 'POST',
      });
    },
    [media]
  );

  /**
   * Update Existing media.
   *
   * @param  {number} mediaId
   * @param  {Object} data Object of properties to update on attachment.
   * @return {Promise} Media Object Promise.
   */
  const updateMedia = useCallback(
    (mediaId, data) => {
      return apiFetch({
        path: `${media}/${mediaId}`,
        data,
        method: 'POST',
      });
    },
    [media]
  );

  /**
   * Delete existing media.
   *
   * @param  {number} mediaId
   * @return {Promise} Media Object Promise.
   */
  const deleteMedia = useCallback(
    (mediaId) => {
      return apiFetch({
        path: `${media}/${mediaId}`,
        data: { force: true },
        method: 'DELETE',
      });
    },
    [media]
  );

  /**
   * Gets metadata (title, favicon, etc.) from
   * a provided URL.
   *
   * @param  {number} url
   * @return {Promise} Result promise
   */
  const getLinkMetadata = useCallback(
    (url) => {
      const path = addQueryArgs(link, { url });
      return apiFetch({
        path,
      });
    },
    [link]
  );

  const getAllFonts = useCallback(() => {
    return apiFetch({ path: fonts }).then((data) =>
      data.map((font) => ({
        name: font.family,
        value: font.family,
        ...font,
      }))
    );
  }, [fonts]);

  const getAllUsers = useCallback(() => {
    return apiFetch({ path: addQueryArgs(users, { per_page: '-1' }) });
  }, [users]);

  const state = {
    actions: {
      autoSaveById,
      getStoryById,
      getMedia,
      getLinkMetadata,
      saveStoryById,
      getAllFonts,
      getAllUsers,
      uploadMedia,
      updateMedia,
      deleteMedia,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

APIProvider.propTypes = {
  children: PropTypes.node,
};

export default APIProvider;
