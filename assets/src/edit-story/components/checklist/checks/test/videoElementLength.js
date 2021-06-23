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
import { videoElementLength } from '../videoElementLength';

describe('videoElementLength', () => {
  it('should return true if the video element is longer than 1 minute', () => {
    const tooLongVideo = {
      id: 202,
      type: 'video',
      resource: {
        length: 75,
        sizes: {
          full: {
            height: 2160,
            width: 3840,
          },
        },
      },
    };

    const result = videoElementLength(tooLongVideo);
    expect(result).toBe(true);
  });
});
