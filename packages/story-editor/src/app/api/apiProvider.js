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
import { useCallback, useRef } from '@web-stories-wp/react';
import { DATA_VERSION } from '@web-stories-wp/migration';
import getAllTemplates from '@web-stories-wp/templates';

/**
 * Internal dependencies
 */
import base64Encode from '../../utils/base64Encode';
import { useConfig } from '../config';
import Context from './context';
import { removeImagesFromPageTemplates } from './utils';

function APIProvider({ children }) {
  const {
    api: {
      stories,
      media,
      hotlink,
      link,
      users,
      statusCheck,
      metaBoxes,
      currentUser,
      storyLocking,
      pageTemplates: customPageTemplates,
    },
    apiCallbacks: {
      getStoryById,
      getStoryLockById,
      setStoryLockById,
      deleteStoryLockById,
      getDemoStoryById,
      saveStoryById,
      autoSaveById,
      getMedia,
      uploadMedia,
      updateMedia,
      deleteMedia,
      getLinkMetadata,
      getAuthors,
      getCurrentUser,
      updateCurrentUser,
      saveMetaBoxes,
      getStatusCheck,
      getCustomPageTemplates,
      addPageTemplate,
      deletePageTemplate,
      getHotlinkInfo,
    },
    encodeMarkup,
    cdnURL,
  } = useConfig();

  const pageTemplates = useRef({
    base: [],
    withoutImages: [],
  });

  const getStorySaveData = useCallback(
    ({
      pages,
      featuredMedia,
      globalStoryStyles,
      publisherLogo,
      autoAdvance,
      defaultPageDuration,
      currentStoryStyles,
      backgroundAudio,
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
          backgroundAudio,
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

  const actions = {};

  actions.getPageTemplates = useCallback(
    async ({ showImages = false } = {}) => {
      // check if pageTemplates have been loaded yet
      if (pageTemplates.current.base.length === 0) {
        pageTemplates.current.base = await getAllTemplates({ cdnURL });
        pageTemplates.current.withoutImages = removeImagesFromPageTemplates(
          pageTemplates.current.base
        );
      }

      return pageTemplates.current[showImages ? 'base' : 'withoutImages'];
    },
    [cdnURL]
  );

  actions.getStoryById = useCallback(
    (storyId) => (getStoryById ? getStoryById(storyId, stories) : undefined),
    [stories, getStoryById]
  );

  // @todo Move to wp-story-editor along with PostLock component.
  actions.getStoryLockById = useCallback(
    (storyId) =>
      getStoryLockById ? getStoryLockById(storyId, stories) : undefined,
    [stories, getStoryLockById]
  );

  // @todo Move to wp-story-editor along with PostLock component.
  actions.setStoryLockById = useCallback(
    (storyId) =>
      setStoryLockById ? setStoryLockById(storyId, stories) : undefined,
    [stories, setStoryLockById]
  );

  // @todo Move to wp-story-editor along with PostLock component.
  actions.deleteStoryLockById = useCallback(
    (storyId, nonce) =>
      deleteStoryLockById
        ? deleteStoryLockById(storyId, nonce, storyLocking)
        : undefined,
    [storyLocking, deleteStoryLockById]
  );

  actions.getDemoStoryById = useCallback(
    (storyId) =>
      getDemoStoryById ? getDemoStoryById(storyId, stories) : undefined,
    [stories, getDemoStoryById]
  );

  actions.saveStoryById = useCallback(
    (story) =>
      saveStoryById
        ? saveStoryById(story, stories, getStorySaveData)
        : undefined,
    [stories, getStorySaveData, saveStoryById]
  );

  actions.autoSaveById = useCallback(
    (story) =>
      autoSaveById ? autoSaveById(story, stories, getStorySaveData) : undefined,
    [stories, getStorySaveData, autoSaveById]
  );

  actions.getMedia = useCallback(
    ({ mediaType, searchTerm, pagingNum, cacheBust }) =>
      getMedia
        ? getMedia({ mediaType, searchTerm, pagingNum, cacheBust }, media)
        : undefined,
    [media, getMedia]
  );

  actions.uploadMedia = useCallback(
    (file, additionalData) =>
      uploadMedia ? uploadMedia(file, additionalData, media) : undefined,
    [media, uploadMedia]
  );

  actions.updateMedia = useCallback(
    (mediaId, data) =>
      updateMedia ? updateMedia(mediaId, data, media) : undefined,
    [media, updateMedia]
  );

  actions.deleteMedia = useCallback(
    (mediaId) => (deleteMedia ? deleteMedia(mediaId, media) : undefined),
    [media, deleteMedia]
  );

  actions.getHotlinkInfo = useCallback(
    (url) => (getHotlinkInfo ? getHotlinkInfo(url, hotlink) : undefined),
    [hotlink, getHotlinkInfo]
  );

  actions.getLinkMetadata = useCallback(
    (url) => (getLinkMetadata ? getLinkMetadata(url, link) : undefined),
    [link, getLinkMetadata]
  );

  actions.getAuthors = useCallback(
    (search = null) => (getAuthors ? getAuthors(search, users) : undefined),
    [users, getAuthors]
  );

  actions.getCurrentUser = useCallback(
    () => (getCurrentUser ? getCurrentUser(currentUser) : undefined),
    [currentUser, getCurrentUser]
  );

  actions.updateCurrentUser = useCallback(
    (data) =>
      updateCurrentUser ? updateCurrentUser(data, currentUser) : undefined,
    [currentUser, updateCurrentUser]
  );

  // @todo Move to wp-story-editor along with meta-boxes.
  actions.saveMetaBoxes = useCallback(
    (story, formData) =>
      saveMetaBoxes ? saveMetaBoxes(story, formData, metaBoxes) : undefined,
    [metaBoxes, saveMetaBoxes]
  );

  // @todo Move to wp-story-editor along with StatusCheck component.
  actions.getStatusCheck = useCallback(
    (content) =>
      getStatusCheck
        ? getStatusCheck(content, statusCheck, encodeMarkup)
        : undefined,
    [statusCheck, encodeMarkup, getStatusCheck]
  );

  actions.getCustomPageTemplates = useCallback(
    (page = 1) =>
      getCustomPageTemplates
        ? getCustomPageTemplates(page, customPageTemplates)
        : undefined,
    [customPageTemplates, getCustomPageTemplates]
  );

  actions.addPageTemplate = useCallback(
    (page) =>
      addPageTemplate ? addPageTemplate(page, customPageTemplates) : undefined,
    [customPageTemplates, addPageTemplate]
  );

  actions.deletePageTemplate = useCallback(
    (id) =>
      deletePageTemplate
        ? deletePageTemplate(id, customPageTemplates)
        : undefined,
    [customPageTemplates, deletePageTemplate]
  );

  return <Context.Provider value={{ actions }}>{children}</Context.Provider>;
}

APIProvider.propTypes = {
  children: PropTypes.node,
};

export default APIProvider;
