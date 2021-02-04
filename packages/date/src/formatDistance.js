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
import { __, _n, sprintf } from '@wordpress/i18n';

const formatDistanceLocale = {
  lessThanXMinutes(count) {
    return sprintf(
      /* translators: Time difference between two dates, in minutes (min=minute). %s: Number of minutes. */
      _n('less than %s min', 'less than %s mins', count, 'web-stories'),
      count
    );
  },

  xMinutes(count) {
    /* translators: Time difference between two dates, in minutes. %s: Number of minutes. */
    return sprintf(_n('%s minute', '%s minutes', count, 'web-stories'), count);
  },

  aboutXHours(count) {
    if (1 === count) {
      return __('an hour', 'web-stories');
    }

    /* translators: Time difference between two dates, in hours. %s: Number of hours. */
    return sprintf(_n('%s hour', '%s hours', count, 'web-stories'), count);
  },

  xHours(count) {
    /* translators: Time difference between two dates, in hours. %s: Number of hours. */
    return sprintf(_n('%s hour', '%s hours', count, 'web-stories'), count);
  },
};

export default function formatDistance(token, count, options) {
  options = options || {};

  const result = formatDistanceLocale[token](count);

  if (options.addSuffix) {
    if (options.comparison > 0) {
      /* translators: %s: Human-readable time difference. */
      return sprintf(__('in %s', 'web-stories'), result);
    } else {
      /* translators: %s: Human-readable time difference. */
      return sprintf(__('%s ago', 'web-stories'), result);
    }
  }

  return result;
}
