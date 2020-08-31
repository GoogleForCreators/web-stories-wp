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
import getInsertedElementSize from '../getInsertedElementSize';

describe('getInsertedElementSize', () => {
  it('should return original size if set', () => {
    const { width, height } = getInsertedElementSize('text', 100, 100, {
      x: 10,
      y: 10,
      content: 'Hello, Stories',
    });
    expect(width).toStrictEqual(100);
    expect(height).toStrictEqual(100);
  });

  it('should generate size if not set', () => {
    const { width, height } = getInsertedElementSize('text', null, null, {
      x: 10,
      y: 10,
      content: 'Hello, Stories',
    });
    expect(width).toBeNumber();
    expect(height).toBeNumber();
  });
});
