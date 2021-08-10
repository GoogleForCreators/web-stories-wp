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

/* global __dirname */

/**
 * External dependencies
 */
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Internal dependencies
 */
import isAnimatedGif from '../isAnimatedGif';

describe('isAnimatedGif', () => {
  it('should detect animated GIF', () => {
    const buffer = readFileSync(join(__dirname, '/testUtils/nyancat.gif'));
    const arrayBuffer = buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
    const result = isAnimatedGif(arrayBuffer);

    expect(result).toBeTrue();
  });

  it('should not detect non-animated GIF', () => {
    const buffer = readFileSync(join(__dirname, '/testUtils/still.gif'));
    const arrayBuffer = buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
    const result = isAnimatedGif(arrayBuffer);

    expect(result).toBeFalse();
  });
});
