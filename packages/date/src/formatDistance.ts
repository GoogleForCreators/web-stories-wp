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
import { __, _n, sprintf } from '@googleforcreators/i18n';

type Token = 'lessThanXMinutes' | 'xMinutes' | 'aboutXHours' | 'xHours';
type Formatter = Record<Token, (count: number) => string>;
type Options = {
  addSuffix?: boolean;
  comparison?: number;
};

const formatDistanceLocale: Formatter = {
  lessThanXMinutes(count: number) {
    return sprintf(
      /* translators: Time difference between two dates, in minutes (min=minute). %s: Number of minutes. */
      _n('less than %s min', 'less than %s mins', count, 'web-stories'),
      String(count)
    );
  },

  xMinutes(count: number) {
    return sprintf(
      /* translators: Time difference between two dates, in minutes. %s: Number of minutes. */
      _n('%s minute', '%s minutes', count, 'web-stories'),
      String(count)
    );
  },

  aboutXHours(count: number) {
    if (1 === count) {
      return __('an hour', 'web-stories');
    }

    return sprintf(
      /* translators: Time difference between two dates, in hours. %s: Number of hours. */
      _n('%s hour', '%s hours', count, 'web-stories'),
      String(count)
    );
  },

  xHours(count: number) {
    return sprintf(
      /* translators: Time difference between two dates, in hours. %s: Number of hours. */
      _n('%s hour', '%s hours', count, 'web-stories'),
      String(count)
    );
  },
};

export default function formatDistance(
  token: Token,
  count: number,
  options: Options
) {
  options = options || {};

  const result = formatDistanceLocale[token](count);

  if (options.addSuffix) {
    if ((options.comparison || 0) > 0) {
      return sprintf(
        /* translators: %s: Human-readable time difference. */
        __('in %s', 'web-stories'),
        result
      );
    } else {
      return sprintf(
        /* translators: %s: Human-readable time difference. */
        __('%s ago', 'web-stories'),
        result
      );
    }
  }

  return result;
}
