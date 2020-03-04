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
import createSolid from '../createSolid';

describe('createSolid', () => {
  it('should convert with specifying opacity', () => {
    expect(createSolid(255, 0, 0)).toStrictEqual({
      color: { r: 255, g: 0, b: 0 },
    });
  });

  it('should convert with full opacity', () => {
    expect(createSolid(0, 255, 0, 1)).toStrictEqual({
      color: { r: 0, g: 255, b: 0 },
    });
  });

  it('should convert with less than full opacity', () => {
    expect(createSolid(0, 0, 255, 0.1)).toStrictEqual({
      color: { r: 0, g: 0, b: 255, a: 0.1 },
    });
  });
});
