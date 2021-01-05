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
import getPreviewText from '../getPreviewText';
import createSolid from '../../../../utils/createSolid';

describe('getPreviewText', () => {
  it('should return null for no pattern', () => {
    const input = null;
    const result = getPreviewText(input);
    const expected = null;
    expect(result).toBe(expected);
  });

  it('should return hex ignoring alpha for non-transparent solid', () => {
    const input = createSolid(255, 0, 0, 0.1);
    const result = getPreviewText(input);
    const expected = 'FF0000';
    expect(result).toBe(expected);
  });

  it('should return hex ignoring alpha for explicit non-transparent solid', () => {
    const input = { ...createSolid(255, 0, 255, 0.3), type: 'solid' };
    const result = getPreviewText(input);
    const expected = 'FF00FF';
    expect(result).toBe(expected);
  });

  it('should return correct text for gradient', () => {
    const linearResult = getPreviewText({ type: 'linear' });
    expect(linearResult).toBe('Linear');

    const radialResult = getPreviewText({ type: 'radial' });
    expect(radialResult).toBe('Radial');
  });
});
