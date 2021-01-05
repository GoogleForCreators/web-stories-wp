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
import generatePatternStylesMock from '../../../../utils/generatePatternStyles';
import createSolid from '../../../../utils/createSolid';
import getPreviewStyle from '../getPreviewStyle';

jest.mock('../../../../utils/generatePatternStyles', () => jest.fn());

describe('getPreviewStyle', () => {
  beforeEach(() => {
    generatePatternStylesMock.mockReset();
    generatePatternStylesMock.mockImplementation(() => ({
      backgroundColor: 'red',
    }));
  });

  it('should return transparent for no pattern', () => {
    const pattern = null;
    const result = getPreviewStyle(pattern);
    expect(result).toStrictEqual({});
    expect(generatePatternStylesMock).not.toHaveBeenCalled();
  });

  it('should return generated pattern for non-solid', () => {
    const pattern = { type: 'linear' };
    const result = getPreviewStyle(pattern);
    expect(result).toStrictEqual({ backgroundColor: 'red' });
    expect(generatePatternStylesMock).toHaveBeenCalledWith(pattern);
  });

  it('should ignore alpha for non-solid', () => {
    const pattern = { type: 'linear', alpha: 0.7 };
    const result = getPreviewStyle(pattern);
    expect(result).toStrictEqual({ backgroundColor: 'red' });
    // Note the absense of alpha below
    expect(generatePatternStylesMock).toHaveBeenCalledWith({ type: 'linear' });
  });

  it('should return transparent for transparent solid', () => {
    const pattern = createSolid(255, 0, 255, 0);
    const result = getPreviewStyle(pattern);
    expect(result).toStrictEqual({ backgroundColor: 'red' });
    expect(generatePatternStylesMock).toHaveBeenCalledWith(
      createSolid(255, 0, 255)
    );
  });

  it('should return fully opaque style for non-transparent solid', () => {
    const pattern = createSolid(255, 0, 255, 0.1);
    const result = getPreviewStyle(pattern);
    expect(result).toStrictEqual({ backgroundColor: 'red' });
    expect(generatePatternStylesMock).toHaveBeenCalledWith(
      createSolid(255, 0, 255)
    );
  });
});
