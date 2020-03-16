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
import createSolid from '../../../../utils/createSolid';
import applyOpacityChange from '../applyOpacityChange';

describe('applyOpacityChange', () => {
  it('should return null for no pattern', () => {
    const pattern = null;
    const opacity = 0.3;
    const result = applyOpacityChange(pattern, opacity);
    const expected = null;
    expect(result).toStrictEqual(expected);
  });

  it('should return solid with opacity applied', () => {
    const pattern = createSolid(255, 0, 0);
    const opacity = 0.3;
    const result = applyOpacityChange(pattern, opacity);
    const expected = createSolid(255, 0, 0, 0.3);
    expect(result).toStrictEqual(expected);
  });

  it('should return non-solid with alpha applied', () => {
    const pattern = { type: 'linear', stops: [] };
    const opacity = 0.3;
    const result = applyOpacityChange(pattern, opacity);
    const expected = { type: 'linear', stops: [], alpha: 0.3 };
    expect(result).toStrictEqual(expected);
  });
});
