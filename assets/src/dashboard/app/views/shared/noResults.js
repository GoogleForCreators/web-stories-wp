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
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { DefaultParagraph1 } from '../../../components';

const NoResults = ({ typeaheadValue }) => (
  <DefaultParagraph1>
    {sprintf(
      /* translators: %s: search term. */
      __('Sorry, we couldn\'t find any results matching "%s"', 'web-stories'),
      typeaheadValue
    )}
  </DefaultParagraph1>
);

NoResults.propTypes = {
  typeaheadValue: PropTypes.string.isRequired,
};

export default NoResults;
