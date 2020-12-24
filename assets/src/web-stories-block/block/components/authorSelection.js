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
import { useDebouncedCallback } from 'use-debounce';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

/**
 * AuthorSelection props.
 *
 * @typedef AuthorSelectionProps
 *
 * @property {Array}    authors       An array of authors objects which are currently selected.
 * @property {()=>void} setAttributes Callable function for saving attribute values.
 */

/**
 * Internal dependencies
 */
import { FETCH_AUTHORS_DEBOUNCE } from '../constants';
import Autocomplete from './autocomplete';

/**
 * Module Constants
 */
const USERS_LIST_QUERY = {
  per_page: 100,
};

/**
 * AuthorSelection component. Used for selecting authors of stories.
 *
 * @param {AuthorSelection} props Component props.
 *
 * @return {*} JSX markup.
 */
const AuthorSelection = ({ authors, setAttributes }) => {
  const [authorsList, setAuthorsList] = useState([]);

  /**
   * Returns an array of author objects with author's name as the key. An object will contain 'id' and 'value' field.
   * 'value' is author's name.
   *
   * @return {Array} An array of author objects with author's name as the key.
   */
  const getAuthorSuggestions = () => {
    if (
      'undefined' !== typeof authorsList &&
      Array.isArray(authorsList) &&
      authorsList.length > 0
    ) {
      return authorsList.reduce(
        (accumulator, author) => ({
          ...accumulator,
          [author.name]: {
            id: author.id,
            value: author.name,
          },
        }),
        {}
      );
    }
    return [];
  };

  /**
   * Returns an array of authors' names in string format, used by the Autocomplete component to display suggestions.
   *
   * @return {Array} An array of authors' names in string format.
   */
  const getAuthorNames = () => {
    const authorsObj = getAuthorSuggestions();

    if ('object' !== typeof authorsObj) {
      return [];
    }

    return Object.keys(authorsObj);
  };

  /**
   * Callback function called when user selects an author from the suggestions. Will process the names given
   * by the user and valid author names will be saved.
   *
   * @param {Array} tokens Array of strings that were parsed from the text field.
   * @return {void}
   */
  const selectAuthors = (tokens) => {
    if ('undefined' !== typeof tokens && !Array.isArray(tokens)) {
      return;
    }

    const authorSuggestions = getAuthorSuggestions();

    const hasNoSuggestion = tokens.some(
      (token) => 'string' === typeof token && !authorSuggestions[token]
    );

    if (hasNoSuggestion) {
      return;
    }

    const allAuthors = tokens.map((token) => {
      return 'string' === typeof token ? authorSuggestions[token] : token;
    });

    setAttributes({ authors: allAuthors });
  };

  /**
   * Callback function used when user types in the search query in the text field. Makes an API call
   * to fetch authors matching the search query.
   *
   * @param {string} searchQuery Search query to look for authors.
   * @return {void}
   */
  const onAuthorChange = (searchQuery) => {
    if (searchQuery) {
      USERS_LIST_QUERY.search = searchQuery;
    }

    apiFetch({
      path: addQueryArgs('/wp/v2/users', USERS_LIST_QUERY),
    })
      .then((data) => {
        if ('undefined' !== typeof data && Array.isArray(data)) {
          setAuthorsList(data);
        }
      })
      .catch(() => {
        setAuthorsList([]);
      });
  };

  const [debouncedOnAuthorChange] = useDebouncedCallback(
    onAuthorChange,
    FETCH_AUTHORS_DEBOUNCE
  );

  return (
    <Autocomplete
      label={__('Authors', 'web-stories')}
      value={authors}
      options={getAuthorNames()}
      onChange={(value) => selectAuthors(value)}
      onInputChange={debouncedOnAuthorChange}
    />
  );
};

AuthorSelection.propTypes = {
  authors: PropTypes.array.isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default AuthorSelection;
