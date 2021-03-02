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
import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Typeahead } from '../../../dashboard/components';

export default function TypeaheadAuthorSearch({
  placeholder = '',
  handleChange,
  currentValue = '',
  authors = [],
}) {
  const typeaheadMenuOptions = useMemo(() => {
    return authors.reduce((acc, author) => {
      if (!author.name || author.name.trim().length <= 0) {
        return acc;
      }
      return [
        ...acc,
        {
          label: author.name,
          value: author.id.toString(),
        },
      ];
    }, []);
  }, [authors]);

  return (
    <Typeahead
      inputId="typeahead-author-search"
      items={typeaheadMenuOptions}
      onChange={handleChange}
      value={currentValue}
      placeholder={placeholder}
      ariaLabel={placeholder}
    />
  );
}

TypeaheadAuthorSearch.propTypes = {
  placeholder: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  currentValue: PropTypes.string,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    })
  ),
};
