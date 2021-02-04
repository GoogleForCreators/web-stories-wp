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
 * Internal dependencies
 */
import convertFormatString, {
  FORMAT_TOKEN_SEPARATOR_REGEX,
} from '../convertFormatString';
import format from '../format';

describe('date/convertFormatString', () => {
  it.each([
    ['d-m-Y H:i', 'dd-MM-yyyy HH:mm'],
    ['F j, Y', 'MMMM d, yyyy'],
    ['F M l D', 'MMMM MMM EEEE EEE'],
    ['G \\h h \\m\\i\\n', "H 'h' hh 'm''i''n'"],
  ])(
    'converts PHP date format string to its date-fns equivalent',
    (formatString, expectedOutput) => {
      const convertedWithoutSeparator = convertFormatString(
        formatString
      ).replace(FORMAT_TOKEN_SEPARATOR_REGEX, '');
      expect(convertedWithoutSeparator).toStrictEqual(expectedOutput);
      expect(() => format(new Date(), formatString)).not.toThrow();
    }
  );
});
