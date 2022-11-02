/*
 * Copyright 2021 Google LLC
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
import safeDecodeURIComponent from '../safeDecodeUriComponent';

describe('safeDecodeURIComponent', () => {
  it('should decode the URI correctly', () => {
    let url = 'kanji-漢字';
    expect(safeDecodeURIComponent('kanji-%e6%bc%a2%e5%ad%97')).toBe(url);

    url = 'Χαίρετε';
    expect(
      safeDecodeURIComponent('%CE%A7%CE%B1%CE%AF%CF%81%CE%B5%CF%84%CE%B5')
    ).toBe(url);

    url = '你好世界';
    expect(safeDecodeURIComponent('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C')).toBe(
      url
    );
  });
});
