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
import getPreviewOpacity from '../getPreviewOpacity';

describe('getPreviewOpacity', () => {
  it('should return null for no pattern', () => {
    const pattern = null;
    const result = getPreviewOpacity(pattern);
    const expected = null;
    expect(result).toBe(expected);
  });

  it('should return default alpha for non-solid pattern', () => {
    const pattern = { type: 'linear' };
    const result = getPreviewOpacity(pattern);
    const expected = 100;
    expect(result).toBe(expected);
  });

  it('should return non-default alpha for non-solid pattern', () => {
    const pattern = { type: 'linear', alpha: 0.7 };
    const result = getPreviewOpacity(pattern);
    const expected = 70;
    expect(result).toBe(expected);
  });

  it('should return 100% for solid pattern without alpha component', () => {
    const pattern = createSolid(255, 0, 0);
    const result = getPreviewOpacity(pattern);
    const expected = 100;
    expect(result).toBe(expected);
  });

  it('should return alpha as percent for solid pattern with alpha component', () => {
    const pattern = createSolid(255, 0, 0, 0.2);
    const result = getPreviewOpacity(pattern);
    const expected = 20;
    expect(result).toBe(expected);
  });
});
