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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { NoResults } from '../../shared';
import { DefaultParagraph1 } from '../../../../components';

function EmptyView({ searchKeyword }) {
  if (!searchKeyword) {
    return (
      <DefaultParagraph1>
        {__('No templates currently available', 'web-stories')}
      </DefaultParagraph1>
    );
  }
  return <NoResults typeaheadValue={searchKeyword} />;
}

EmptyView.propTypes = {
  searchKeyword: PropTypes.string,
};

export default EmptyView;
