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
import getSearchOptions from '../getSearchOptions';

const initialData = [
  { id: 94, title: 'Maltese Falcon' },
  { id: 65, title: 'Rear Window' },
  { id: 78, title: 'Psycho' },
  { id: 12, title: 'The Birds' },
  { id: 2, title: 'Casa Blanca' },
  { id: 7, title: 'Valley of the Dolls' },
  { id: 8, title: 'Wrath of Khan' },
  { id: 999, noGoodKey: 'Princess Bride' },
  { id: 89, title: '' },
  { id: 876, title: undefined },
  { id: 76, title: null },
  { id: 796, title: false },
];

describe('getSearchOptions', () => {
  it('should shape an array of objects, returning label and value based on title', () => {
    const searchOptions = getSearchOptions(initialData);

    expect(searchOptions).toMatchObject([
      { label: 'Maltese Falcon', value: 'Maltese Falcon' },
      { label: 'Rear Window', value: 'Rear Window' },
      { label: 'Psycho', value: 'Psycho' },
      { label: 'The Birds', value: 'The Birds' },
      { label: 'Casa Blanca', value: 'Casa Blanca' },
      { label: 'Valley of the Dolls', value: 'Valley of the Dolls' },
      { label: 'Wrath of Khan', value: 'Wrath of Khan' },
    ]);
  });
});
