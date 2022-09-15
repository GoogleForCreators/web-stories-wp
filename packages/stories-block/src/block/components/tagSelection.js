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
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Autocomplete from './autocomplete';

/**
 * TagSelection props.
 *
 * @typedef TagSelectionProps
 * @property {Array<number>} tags List of tag IDs.
 * @property {()=>void} setAttributes Callable function for saving attribute values.
 */

/**
 * TagSelection component. Used for selecting tags of stories.
 *
 * @param {TagSelection} props Component props.
 * @return {*} JSX markup.
 */
const TagSelection = ({ tags: tagIds, setAttributes }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [tagsList, setTagsList] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);

  useEffect(() => {
    if (isInitialized || !tagIds?.length) {
      return;
    }

    apiFetch({
      path: addQueryArgs('/web-stories/v1/web_story_tag', {
        per_page: 100,
        include: tagIds.join(','),
      }),
    })
      .then((tags) => {
        if ('undefined' !== typeof tags && Array.isArray(tags)) {
          setTagsList(tags.map(({ id, name }) => ({ id, value: name })));
        }
      })
      .catch(() => {
        setTagsList([]);
      })
      .finally(() => setIsInitialized(true));
  }, [isInitialized, tagIds]);

  /**
   * Callback function called when user selects a tag from the suggestions.
   *
   * Will process the names given by the user and valid tag names will be saved.
   *
   * @param {Array} tokens Array of strings that were parsed from the text field.
   * @return {void}
   */
  const onChange = (tokens) => {
    if ('undefined' === typeof tokens || !Array.isArray(tokens)) {
      return;
    }

    const tags = tokens
      .map((token) =>
        [...tagSuggestions, ...tagsList].find(
          ({ value }) => value === token
        )
      )
      .filter(Boolean);

    setTagsList(tags);
    setAttributes({ tags: tags.map(({ id }) => id) });
  };

  /**
   * Callback function used when user types in the search query in the text field.
   *
   * Makes an API call to fetch tags matching the search query.
   *
   * @param {string} search Search query to look for tags.
   * @return {void}
   */
  const onInputChange = (search) => {
    apiFetch({
      path: addQueryArgs('/web-stories/v1/web_story_tag', { per_page: 100, search }),
    })
      .then((tags) => {
        if ('undefined' !== typeof tags && Array.isArray(tags)) {
          setTagSuggestions(
            tags.map(({ id, name }) => ({ id, value: name }))
          );
        }
      })
      .catch(() => {
        setTagSuggestions([]);
      });
  };

  const debouncedOnInputChange = useDebounce(onInputChange, 500);

  return (
    <Autocomplete
      label={__('Tags', 'web-stories')}
      value={tagsList.map(({ value }) => value)}
      options={tagSuggestions.map(({ value }) => value)}
      onChange={onChange}
      onInputChange={debouncedOnInputChange}
    />
  );
}

TagSelection.propTypes = {
  tags: PropTypes.array.isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default TagSelection;
