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

export const DROPDOWN_VALUE_TYPE = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
]);

export const DROPDOWN_ITEM = PropTypes.shape({
  label: PropTypes.string,
  value: DROPDOWN_VALUE_TYPE,
});

export const DROPDOWN_ITEMS = PropTypes.arrayOf(DROPDOWN_ITEM);

export const NESTED_DROPDOWN_ITEM = PropTypes.shape({
  group: PropTypes.shape({ label: PropTypes.string, options: DROPDOWN_ITEMS }),
});

export const NESTED_DROPDOWN_ITEMS = PropTypes.arrayOf(NESTED_DROPDOWN_ITEM);

export const MENU_OPTIONS = PropTypes.oneOfType([
  DROPDOWN_ITEMS,
  NESTED_DROPDOWN_ITEMS,
]);
