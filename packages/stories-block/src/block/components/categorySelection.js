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
 * CategorySelection props.
 *
 * @typedef CategorySelectionProps
 * @property {Array<number>} categories List of category IDs.
 * @property {()=>void} setAttributes Callable function for saving attribute values.
 */

/**
 * CategorySelection component. Used for selecting categories of stories.
 *
 * @param {CategorySelection} props Component props.
 * @return {*} JSX markup.
 */
const CategorySelection = ({ categories: categoryIds, setAttributes }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);

  useEffect(() => {
    if (isInitialized || !categoryIds?.length) {
      return;
    }

    apiFetch({
      path: addQueryArgs('/web-stories/v1/web_story_category', {
        per_page: 100,
        include: categoryIds.join(','),
      }),
    })
      .then((categories) => {
        if ('undefined' !== typeof categories && Array.isArray(categories)) {
          setCategoriesList(categories.map(({ id, name }) => ({ id, value: name })));
        }
      })
      .catch(() => {
        setCategoriesList([]);
      })
      .finally(() => setIsInitialized(true));
  }, [isInitialized, categoryIds]);

  /**
   * Callback function called when user selects a category from the suggestions.
   *
   * Will process the names given by the user and valid category names will be saved.
   *
   * @param {Array} tokens Array of strings that were parsed from the text field.
   * @return {void}
   */
  const onChange = (tokens) => {
    if ('undefined' === typeof tokens || !Array.isArray(tokens)) {
      return;
    }

    const categories = tokens
      .map((token) =>
        [...categorySuggestions, ...categoriesList].find(
          ({ value }) => value === token
        )
      )
      .filter(Boolean);

    setCategoriesList(categories);
    setAttributes({ categories: categories.map(({ id }) => id) });
  };

  /**
   * Callback function used when user types in the search query in the text field.
   *
   * Makes an API call to fetch categories matching the search query.
   *
   * @param {string} search Search query to look for categories.
   * @return {void}
   */
  const onInputChange = (search) => {
    apiFetch({
      path: addQueryArgs('/web-stories/v1/web_story_category', { per_page: 100, search }),
    })
      .then((categories) => {
        if ('undefined' !== typeof categories && Array.isArray(categories)) {
          setCategorySuggestions(
            categories.map(({ id, name }) => ({ id, value: name }))
          );
        }
      })
      .catch(() => {
        setCategorySuggestions([]);
      });
  };

  const debouncedOnInputChange = useDebounce(onInputChange, 500);

  return (
    <Autocomplete
      label={__('Categories', 'web-stories')}
      value={categoriesList.map(({ value }) => value)}
      options={categorySuggestions.map(({ value }) => value)}
      onChange={onChange}
      onInputChange={debouncedOnInputChange}
    />
  );
}

CategorySelection.propTypes = {
  categories: PropTypes.array.isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default CategorySelection;
