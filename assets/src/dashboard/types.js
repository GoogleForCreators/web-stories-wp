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

/**
 * Internal dependencies
 */
import StoryPropTypes from '../edit-story/types';

export const StoryPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['publish', 'draft', 'template']).isRequired,
  title: PropTypes.string.isRequired,
  pages: PropTypes.arrayOf(StoryPropTypes.page),
  modified: PropTypes.object,
});

export const StoriesPropType = PropTypes.arrayOf(StoryPropType).isRequired;
