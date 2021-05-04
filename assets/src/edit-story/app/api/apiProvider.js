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
import { useCallback, useRef } from 'react';
import { DATA_VERSION } from '@web-stories-wp/migration';
import getAllTemplates from '@web-stories-wp/templates';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { addQueryArgs } from '../../../design-system';
import base64Encode from '../../utils/base64Encode';
import { useConfig } from '../config';
import Context from './context';
import removeImagesFromPageTemplates from './removeImagesFromPageTemplates';

function APIProvider({ children }) {
  const {
    api: {
      stories,
      media,
      link,
      users,
      statusCheck,
      metaBoxes,
      currentUser,
      storyLocking,
      pageTemplates: customPageTemplates,
    },
    encodeMarkup,
    cdnURL,
    assetsURL,
  } = useConfig();

  const pageTemplates = useRef({
    base: [],
    withoutImages: [],
  });

  const getStoryById = useCallback(
    (storyId) => {
      const path = addQueryArgs(`${stories}${storyId}/`, {
        context: 'edit',
        _embed: 'wp:featuredmedia,wp:lockuser,author',
        web_stories_demo: false,
      });

      return apiFetch({ path });
    },
    [stories]
  );

  const getStoryLockById = useCallback(
    (storyId) => {
      const path = addQueryArgs(`${stories}${storyId}/lock`, {
        _embed: 'author',
      });

      return apiFetch({ path });
    },
    [stories]
  );

  const setStoryLockById = useCallback(
    (storyId) => {
      const path = `${stories}${storyId}/lock`;

      return apiFetch({ path, method: 'POST' });
    },
    [stories]
  );

  const deleteStoryLockById = useCallback(
    (storyId, nonce) => {
      const data = new window.FormData();
      data.append('_wpnonce', nonce);

      const url = addQueryArgs(storyLocking, { _method: 'DELETE' });

      window.navigator.sendBeacon?.(url, data);
    },
    [storyLocking]
  );

  const getDemoStoryById = useCallback(
    (storyId) => {
      const path = addQueryArgs(`${stories}${storyId}/`, {
        context: 'edit',
        _embed: 'wp:featuredmedia,author',
        web_stories_demo: true,
      });

      return apiFetch({ path });
    },
    [stories]
  );

  const getStorySaveData = useCallback(
    ({
      pages,
      featuredMedia,
      globalStoryStyles,
      publisherLogo,
      autoAdvance,
      defaultPageDuration,
      currentStoryStyles,
      content,
      author,
      ...rest
    }) => {
      return {
        story_data: {
          version: DATA_VERSION,
          pages,
          autoAdvance,
          defaultPageDuration,
          currentStoryStyles,
        },
        featured_media: featuredMedia.id,
        style_presets: globalStoryStyles,
        publisher_logo: publisherLogo,
        content: encodeMarkup ? base64Encode(content) : content,
        author: author.id,
        ...rest,
      };
    },
    [encodeMarkup]
  );

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
        path: `${stories}${storyId}/`,
        data: getStorySaveData(story),
        method: 'POST',
      });
    },
    [stories, getStorySaveData]
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
        path: `${stories}${storyId}/autosaves/`,
        data: getStorySaveData(story),
        method: 'POST',
      });
    },
    [stories, getStorySaveData]
  );

  const getMedia = useCallback(
    ({ mediaType, searchTerm, pagingNum, cacheBust }) => {
      let apiPath = media;
      const perPage = 100;
      apiPath = addQueryArgs(apiPath, {
        context: 'edit',
        per_page: perPage,
        page: pagingNum,
        _web_stories_envelope: true,
      });

      if (mediaType) {
        apiPath = addQueryArgs(apiPath, { media_type: mediaType });
      }

      if (searchTerm) {
        apiPath = addQueryArgs(apiPath, { search: searchTerm });
      }

      // cacheBusting is due to the preloading logic preloading and caching
      // some requests. (see preload_paths in Dashboard.php)
      // Adding cache_bust forces the path to look different from the preloaded
      // paths and hence skipping the cache. (cache_bust itself doesn't do
      // anything)
      if (cacheBust) {
        apiPath = addQueryArgs(apiPath, { cache_bust: true });
      }

      return apiFetch({ path: apiPath }).then((response) => {
        return { data: response.body, headers: response.headers };
      });
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
        path: `${media}${mediaId}/`,
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
      // `apiFetch` by default turns `DELETE` requests into `POST` requests
      // with `X-HTTP-Method-Override: DELETE` headers.
      // However, some Web Application Firewall (WAF) solutions prevent this.
      // `?_method=DELETE` is an alternative solution to override the request method.
      // See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header
      return apiFetch({
        path: addQueryArgs(`${media}${mediaId}/`, { _method: 'DELETE' }),
        data: { force: true },
        method: 'POST',
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

  const getAuthors = useCallback(
    (search = null) => {
      return apiFetch({
        path: addQueryArgs(users, { per_page: '100', who: 'authors', search }),
      });
    },
    [users]
  );

  const getCurrentUser = useCallback(() => {
    return apiFetch({
      path: currentUser,
    });
  }, [currentUser]);

  const updateCurrentUser = useCallback(
    (data) => {
      return apiFetch({
        path: currentUser,
        method: 'POST',
        data,
      });
    },
    [currentUser]
  );

  // See https://github.com/WordPress/gutenberg/blob/148e2b28d4cdd4465c4fe68d97fcee154a6b209a/packages/edit-post/src/store/effects.js#L72-L126
  const saveMetaBoxes = useCallback(
    (story, formData) => {
      // Additional data needed for backward compatibility.
      // If we do not provide this data, the post will be overridden with the default values.
      const additionalData = [
        story.comment_status ? ['comment_status', story.comment_status] : false,
        story.ping_status ? ['ping_status', story.ping_status] : false,
        story.sticky ? ['sticky', story.sticky] : false,
        story.author ? ['post_author', story.author.id] : false,
      ].filter(Boolean);

      additionalData.forEach(([key, value]) => formData.append(key, value));

      return apiFetch({
        url: metaBoxes,
        method: 'POST',
        body: formData,
        parse: false,
      });
    },
    [metaBoxes]
  );

  /**
   * Status check, submit html string.
   *
   * @param {string} HTML string.
   * @return {Promise} Result promise
   */
  const getStatusCheck = useCallback(
    (content) => {
      return apiFetch({
        path: statusCheck,
        data: { content: encodeMarkup ? base64Encode(content) : content },
        method: 'POST',
      });
    },
    [statusCheck, encodeMarkup]
  );

  const getPageTemplates = useCallback(
    async ({ showImages = false } = {}) => {
      // check if pageTemplates have been loaded yet
      if (pageTemplates.current.base.length === 0) {
        pageTemplates.current.base = await getAllTemplates({ cdnURL });
        pageTemplates.current.withoutImages = removeImagesFromPageTemplates({
          templates: pageTemplates.current.base,
          assetsURL,
        });
      }

      return pageTemplates.current[showImages ? 'base' : 'withoutImages'];
    },
    [cdnURL, assetsURL]
  );

  // @todo Add pagination.
  const getCustomPageTemplates = useCallback(() => {
    let apiPath = customPageTemplates;
    const perPage = 100;
    apiPath = addQueryArgs(apiPath, {
      context: 'edit',
      per_page: perPage,
      page: 1,
    });
    return apiFetch({ path: apiPath }).then((response) =>
      response.map((template) => {
        return { ...template['story_data'], templateId: template.id };
      })
    );
  }, [customPageTemplates]);

  const addPageTemplate = useCallback(
    (page) => {
      return apiFetch({
        path: `${customPageTemplates}/`,
        data: {
          story_data: page,
          status: 'publish',
        },
        method: 'POST',
      }).then((response) => {
        return { ...response['story_data'], templateId: response.id };
      });
    },
    [customPageTemplates]
  );

  const deletePageTemplate = useCallback(
    (id) => {
      // `?_method=DELETE` is an alternative solution to override the request method.
      // See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header
      return apiFetch({
        path: addQueryArgs(`${customPageTemplates}${id}/`, {
          _method: 'DELETE',
        }),
        data: { force: true },
        method: 'POST',
      });
    },
    [customPageTemplates]
  );

  const state = {
    actions: {
      autoSaveById,
      getStoryById,
      getDemoStoryById,
      getStoryLockById,
      setStoryLockById,
      deleteStoryLockById,
      getMedia,
      getLinkMetadata,
      saveStoryById,
      getAuthors,
      uploadMedia,
      updateMedia,
      deleteMedia,
      saveMetaBoxes,
      getStatusCheck,
      addPageTemplate,
      getCustomPageTemplates,
      deletePageTemplate,
      getPageTemplates,
      getCurrentUser,
      updateCurrentUser,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

APIProvider.propTypes = {
  children: PropTypes.node,
};

export default APIProvider;
