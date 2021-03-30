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
import getHighlightLineHeight from '../getHighlightLineHeight';

describe('getHighlightLineHeight', () => {
  it('should return correct value when just line-height', () => {
    const actual = getHighlightLineHeight(3);
    const expected = '3em';
    expect(actual).toStrictEqual(expected);
  });

  it('should return correct value with positive padding', () => {
    const actual = getHighlightLineHeight(3, 10);
    const expected = 'calc(3em + 20px)';
    expect(actual).toStrictEqual(expected);
  });

  it('should return correct value with negative padding', () => {
    const actual = getHighlightLineHeight(3, -6);
    const expected = 'calc(3em - 12px)';
    expect(actual).toStrictEqual(expected);
  });

  it('should return correct value with given units', () => {
    const actual = getHighlightLineHeight(3, 2, '%');
    const expected = 'calc(3em + 4%)';
    expect(actual).toStrictEqual(expected);
  });
});
