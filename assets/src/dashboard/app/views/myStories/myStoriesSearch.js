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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useMemo } from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { TypeaheadInput } from '../../../components';

export default function MyStoriesSearch({
  handleChange,
  currentValue = '',
  filteredStories = [],
}) {
  const typeaheadMenuOptions = useMemo(() => {
    // todo add different option sets, value and label won't always be the same
    return filteredStories.map((filteredStory) => {
      return {
        label: filteredStory.title,
        value: filteredStory.title,
      };
    });
  }, [filteredStories]);

  return (
    <TypeaheadInput
      inputId="my-stories-search"
      items={typeaheadMenuOptions}
      onChange={(val) => handleChange(val.trim())}
      value={currentValue}
      placeholder={__('Search Stories', 'web-stories')}
      ariaLabel={__('Search Stories', 'web-stories')}
    />
  );
}

MyStoriesSearch.propTypes = {
  handleChange: PropTypes.func.isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.string]),
  filteredStories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    })
  ),
};
