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
import flatternFormData from '../flatternFormData';

const append = jest.fn();
const FormData = {
  append,
};

describe('flatternFormData', () => {
  afterEach(() => {
    append.mockClear();
  });
  it('should call append for string', () => {
    flatternFormData(FormData, 'test', 'value');
    expect(append).toHaveBeenCalledWith('test', 'value');
  });

  it('should call append for object', () => {
    flatternFormData(FormData, 'test', {
      meta: 'test',
    });
    expect(append).toHaveBeenCalledWith('test[meta]', 'test');
  });

  it('should call append for multiple levels object', () => {
    flatternFormData(FormData, 'test', {
      level1: {
        level2: {
          level3: 'test',
        },
      },
    });
    expect(append).toHaveBeenCalledWith('test[level1][level2][level3]', 'test');
  });

  it('should call append for null', () => {
    flatternFormData(FormData, 'test', null);
    expect(append).not.toHaveBeenCalledWith('test', null);
  });
});
