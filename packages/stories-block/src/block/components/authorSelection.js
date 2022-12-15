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
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDebounce } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import Autocomplete from './autocomplete';

/**
 * AuthorSelection props.
 *
 * @typedef AuthorSelectionProps
 * @property {Array<number>} authors List of author IDs.
 * @property {()=>void} setAttributes Callable function for saving attribute values.
 */

/**
 * AuthorSelection component. Used for selecting authors of stories.
 *
 * @param {AuthorSelection} props Component props.
 * @return {*} JSX markup.
 */
const AuthorSelection = ({ authors: authorIds, setAttributes }) => {
  const [authorKeyword, setAuthorKeyword] = useState('');

  const { authorsList } = useSelect(
    (select) => {
      const { getUsers } = select(coreStore);

      const query = {
        per_page: 100,
        include: authorIds.join(','),
      };
      return {
        authorsList: getUsers(query),
      };
    },
    [authorIds]
  );

  const { authorSuggestions } = useSelect(
    (select) => {
      const { getUsers } = select(coreStore);

      const query = {
        per_page: 100,
        search: authorKeyword,
      };
      return {
        authorSuggestions: getUsers(query),
      };
    },
    [authorKeyword]
  );

  /**
   * Callback function called when user selects an author from the suggestions.
   *
   * Will process the names given by the user and valid author names will be saved.
   *
   * @param {Array} tokens Array of strings that were parsed from the text field.
   * @return {void}
   */
  const onChange = (tokens) => {
    if ('undefined' === typeof tokens || !Array.isArray(tokens)) {
      return;
    }

    const authors = tokens
      .map((token) =>
        [...authorSuggestions, ...authorsList].find(
          ({ value }) => value === token
        )
      )
      .filter(Boolean);

    setAttributes({ authors: authors.map(({ id }) => id) });
  };

  /**
   * Callback function used when user types in the search query in the text field.
   *
   * Makes an API call to fetch authors matching the search query.
   *
   * @param {string} search Search query to look for authors.
   * @return {void}
   */
  const onInputChange = (search) => setAuthorKeyword(search);

  const debouncedOnInputChange = useDebounce(onInputChange, 500);

  return (
    <Autocomplete
      label={__('Authors', 'web-stories')}
      value={authorsList ? authorsList.map(({ value }) => value) : []}
      options={
        authorSuggestions ? authorSuggestions.map(({ value }) => value) : []
      }
      onChange={onChange}
      onInputChange={debouncedOnInputChange}
    />
  );
};

AuthorSelection.propTypes = {
  authors: PropTypes.array.isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default AuthorSelection;
