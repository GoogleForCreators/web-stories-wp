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

// Returns string counting time pasted between display date and current time

export function getDateFormattedFromWordPressToMoment(
  date,
  wpFormat = 'Y-m-d'
) {
  const momentFormatWordPressKey = {
    'F j, Y': 'MMM D, YYYY', //May 2, 2020
    'Y-m-d': 'YYYY-MM-DD', // 2020-05-02
    'd-m-Y': 'MM-DD-YYYY', // 05-02-2020
    'm/d/Y': 'MM/DD/YYYY', // 05/02/2020
    'd/m/Y': 'DD/MM/YYYY', // 02/05/2020
  };

  const dateFormat = momentFormatWordPressKey[wpFormat];
  return dateFormat && date.format(dateFormat);
}
