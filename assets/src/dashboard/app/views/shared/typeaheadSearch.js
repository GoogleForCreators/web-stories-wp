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
import { useMemo } from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { Typeahead } from '../../../components';

export default function TypeaheadSearch({
  placeholder = '',
  handleChange,
  currentValue = '',
  stories = [],
}) {
  const typeaheadMenuOptions = useMemo(() => {
    // todo add different option sets, value and label won't always be the same
    return stories.reduce((acc, story) => {
      if (!story.title || story.title.trim().length <= 0) {
        return acc;
      }
      return [
        ...acc,
        {
          label: story.title,
          value: story.title,
        },
      ];
    }, []);
  }, [stories]);

  return (
    <Typeahead
      inputId="typeahead-search"
      items={typeaheadMenuOptions}
      onChange={handleChange}
      value={currentValue}
      placeholder={placeholder}
      ariaLabel={placeholder}
    />
  );
}

TypeaheadSearch.propTypes = {
  placeholder: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  currentValue: PropTypes.string,
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    })
  ),
};
