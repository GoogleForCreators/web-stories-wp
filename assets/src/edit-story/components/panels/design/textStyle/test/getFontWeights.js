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
import getFontWeights from '../getFontWeights';

describe('getFontWeights', () => {
  it('should return a default value if no font provided', () => {
    const result = getFontWeights();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: 'Regular',
      value: '400',
    });
  });

  it('should return a default value if no weights provided', () => {
    const result = getFontWeights({ family: 'Roboto' });
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: 'Regular',
      value: '400',
    });
  });

  it('should return a list of font weights with strings as values', () => {
    const result = getFontWeights({ weights: [200, 400, 700] });
    expect(result).toHaveLength(3);
    expect(result).toStrictEqual([
      {
        name: 'Extra-light',
        value: '200',
      },
      {
        name: 'Regular',
        value: '400',
      },
      {
        name: 'Bold',
        value: '700',
      },
    ]);
  });
});
