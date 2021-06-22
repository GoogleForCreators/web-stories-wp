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
import { videoElementResolution } from '../videoElementResolution';

describe('videoElementResolution', () => {
  it('should return a message if a video element is less than 480p', () => {
    const tooLowResolutionVideoElement = {
      id: 789,
      type: 'video',
      resource: {
        sizes: {
          full: {
            height: 480,
            width: 852,
          },
        },
      },
    };

    const result = videoElementResolution(tooLowResolutionVideoElement);
    expect(result).toBe(true);
  });
});
