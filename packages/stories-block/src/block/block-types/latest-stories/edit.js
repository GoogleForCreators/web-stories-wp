/*
 * Copyright 2021 Google LLC
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

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Button, Placeholder } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { useDebounce } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { BlockIcon as WebStoriesLogo } from '../../icons';
import StoriesInspectorControls from '../../components/storiesInspectorControls';
import StoriesLoading from '../../components/storiesLoading';
import StoriesPreview from '../../components/storiesPreview';

const {
  config: {
    api: { stories: storiesApi },
  },
} = window.webStoriesBlockSettings;

/**
 * LatestStoriesEdit component
 *
 * @param {Object}   root0               Component props.
 * @param {Object}   root0.attributes    Block attributes.
 * @param {Function} root0.setAttributes Callable function for saving attribute values.
 * @return {*} JSX markup for the editor.
 */
function LatestStoriesEdit({ attributes, setAttributes }) {
  const { numOfStories, order, orderby, archiveLinkLabel, authors } =
    attributes;

  const [fetchedStories, setFetchedStories] = useState([]);
  const [isFetchingStories, setIsFetchingStories] = useState([]);

  /**
   * Fetch stories based on the query.
   *
   * @return {void}
   */
  const fetchStories = useCallback(async (query) => {
    try {
      setIsFetchingStories(true);
      const stories = await apiFetch({
        path: addQueryArgs(storiesApi, {
          per_page: 20,
          _embed: 'author,wp:featuredmedia',
          orderby: query.orderby || 'modified',
          order: query.order || 'desc',
          author: query.author || undefined,
        }),
      });

      if (Array.isArray(stories)) {
        setFetchedStories(stories);
      }
    } catch (err) {
      setFetchedStories([]);
    } finally {
      setIsFetchingStories(false);
    }
  }, []);

  const debouncedFetchStories = useDebounce(fetchStories, 1000);

  useEffect(() => {
    debouncedFetchStories({
      order: order || 'desc',
      orderby: orderby || 'date',
      author: authors,
    });
  }, [authors, numOfStories, order, orderby, debouncedFetchStories]);

  const viewAllLabel = archiveLinkLabel
    ? archiveLinkLabel
    : __('View All Stories', 'web-stories');

  const storiesToDisplay =
    fetchedStories.length > numOfStories
      ? fetchedStories.slice(0, numOfStories)
      : fetchedStories;

  return (
    <>
      <StoriesInspectorControls
        attributes={attributes}
        setAttributes={setAttributes}
      />

      {isFetchingStories && <StoriesLoading />}

      {!isFetchingStories && Boolean(storiesToDisplay?.length) && (
        <StoriesPreview
          attributes={attributes}
          stories={storiesToDisplay}
          viewAllLabel={viewAllLabel}
        />
      )}
      {!isFetchingStories && !storiesToDisplay?.length && (
        <Placeholder
          icon={<BlockIcon icon={<WebStoriesLogo />} showColors />}
          label={__('Latest Stories', 'web-stories')}
          className="wp-block-web-stories-embed"
          instructions={__('No stories found.', 'web-stories')}
        >
          <Button
            href={addQueryArgs('post-new.php', { post_type: 'web-story' })}
            isLink
          >
            {__('Create New Story', 'web-stories')}
          </Button>
        </Placeholder>
      )}
    </>
  );
}

LatestStoriesEdit.propTypes = {
  attributes: PropTypes.shape({
    blockType: PropTypes.string,
    align: PropTypes.string,
    viewType: PropTypes.string,
    numOfStories: PropTypes.number,
    numOfColumns: PropTypes.number,
    orderby: PropTypes.string,
    order: PropTypes.string,
    archiveLinkLabel: PropTypes.string,
    authors: PropTypes.array,
    circleSize: PropTypes.number,
    fieldState: PropTypes.object,
  }),
  setAttributes: PropTypes.func.isRequired,
};

export default LatestStoriesEdit;
