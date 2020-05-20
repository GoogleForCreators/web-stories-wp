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
 * Internal dependencies
 */
import MULTIPLE_VALUE from '../multipleValue';

function printRGB(r, g, b) {
  const hex = (v) => v.toString(16).padStart(2, '0');
  return `${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
}

function getPreviewText(pattern) {
  if (!pattern || pattern === MULTIPLE_VALUE) {
    return null;
  }
  switch (pattern.type) {
    case 'radial':
      return __('Radial', 'web-stories');
    case 'linear':
      return __('Linear', 'web-stories');
    case 'solid':
    default: {
      const {
        color: { r, g, b, a },
      } = pattern;
      if (a === 0) {
        return null;
      }
      return printRGB(r, g, b);
    }
  }
}

export default getPreviewText;
