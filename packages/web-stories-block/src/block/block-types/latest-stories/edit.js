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
import { useDebouncedCallback } from '@web-stories-wp/react';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import StoriesInspectorControls from '../../components/storiesInspectorControls';
import StoriesLoading from '../../components/storiesLoading';
import { FETCH_STORIES_DEBOUNCE } from '../../constants';
import StoriesPreview from '../../components/storiesPreview';
import { useConfig } from '../../config';

/**
 * Module constants
 */
const LATEST_STORIES_QUERY = {
  per_page: 20,
  _embed: 'author',
};

/**
 * LatestStoriesEdit component
 *
 * @param {Object}   root0               Component props.
 * @param {Object}   root0.attributes    Block attributes.
 * @param {Function} root0.setAttributes Callable function for saving attribute values.
 *
 * @return {*} JSX markup for the editor.
 */
const LatestStoriesEdit = ({ attributes, setAttributes }) => {
  const {
    numOfStories,
    order,
    orderby,
    archiveLinkLabel,
    authors,
  } = attributes;

  const { api } = useConfig();

  const [fetchedStories, setFetchedStories] = useState([]);
  const [isFetchingStories, setIsFetchingStories] = useState([]);

  /**
   * Fetch stories based on the query.
   *
   * @return {void}
   */
  const fetchStories = async () => {
    try {
      setIsFetchingStories(true);
      const stories = await apiFetch({
        path: addQueryArgs(api.stories, LATEST_STORIES_QUERY),
      });

      if (Array.isArray(stories)) {
        setFetchedStories(stories);
      }
    } catch (err) {
      setFetchedStories([]);
    } finally {
      setIsFetchingStories(false);
    }
  };

  const [debouncedFetchStories] = useDebouncedCallback(
    fetchStories,
    FETCH_STORIES_DEBOUNCE
  );

  useEffect(() => {
    LATEST_STORIES_QUERY.order = order || 'desc';
    LATEST_STORIES_QUERY.orderby = orderby || 'date';
    LATEST_STORIES_QUERY.author = authors;

    debouncedFetchStories();
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
    </>
  );
};

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
