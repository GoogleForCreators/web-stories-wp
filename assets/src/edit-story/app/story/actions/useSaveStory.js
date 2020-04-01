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
import { useCallback, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useConfig } from '../../config';
import { useSnackbar } from '../../snackbar';
import OutputStory from '../../../output/story';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';

/**
 * Creates AMP HTML markup for saving to DB for rendering in the FE.
 *
 * @param {import('../../../types').Story} story Story object.
 * @param {Array<Object>} pages List of pages.
 * @param {Object} metadata Metadata.
 * @return {Element} Story markup.
 */
const getStoryMarkup = (story, pages, metadata) => {
  return renderToStaticMarkup(
    <OutputStory story={story} pages={pages} metadata={metadata} />
  );
};

/**
 * Custom hook to save story.
 *
 * @param {Object}    properties Properties to update.
 * @param {number}    properties.storyId Story post id.
 * @param {Array}     properties.pages Array of all pages.
 * @param {Object}    properties.story Story-global properties
 * @return {Function} Function that can be called to save a story.
 */
function useSaveStory({ storyId, pages, story, updateStory }) {
  const {
    actions: { saveStoryById },
  } = useAPI();
  const { metadata } = useConfig();
  const { showSnackbar } = useSnackbar();
  const [isSaving, setIsSaving] = useState(false);

  const refreshPostEditURL = useRefreshPostEditURL(storyId);

  const titleFormatted = useCallback((rawTitle) => {
    return rawTitle === __('Auto Draft', 'web-stories') ? '' : rawTitle;
  }, []);

  const saveStory = useCallback(() => {
    const {
      title,
      status,
      author,
      date,
      modified,
      slug,
      excerpt,
      featuredMedia,
      password,
      publisherLogo,
      autoAdvance,
      defaultPageDuration,
    } = story;

    const formattedTitle = titleFormatted(title);

    if (!formattedTitle || formattedTitle === '') {
      showSnackbar({
        message: __('Title is required to save story', 'web-stories'),
      });
      return;
    }

    setIsSaving(true);
    const content = getStoryMarkup(story, pages, metadata);
    saveStoryById({
      storyId,
      title,
      status,
      pages,
      author,
      slug,
      date,
      modified,
      content,
      excerpt,
      featuredMedia,
      password,
      publisherLogo,
      autoAdvance,
      defaultPageDuration,
    })
      .then((post) => {
        const {
          status: newStatus,
          slug: newSlug,
          link,
          featured_media_url: featuredMediaUrl,
        } = post;

        updateStory({
          properties: {
            status: newStatus,
            slug: newSlug,
            link,
            featuredMediaUrl,
          },
        });
        refreshPostEditURL();
      })
      .catch(() => {
        showSnackbar({
          message: __('Failed to save the story', 'web-stories'),
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [
    story,
    titleFormatted,
    pages,
    metadata,
    saveStoryById,
    storyId,
    showSnackbar,
    updateStory,
    refreshPostEditURL,
    showSnackbar,
  ]);

  return { saveStory, isSaving };
}

export default useSaveStory;
