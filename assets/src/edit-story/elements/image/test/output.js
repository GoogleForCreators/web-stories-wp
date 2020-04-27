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
import ImageOutput from '../output';

describe('Image output', () => {
  it('should produce valid AMP output', async () => {
    const props = {
      element: {
        id: '123',
        type: 'image',
        mimeType: 'image/png',
        scale: 1,
        x: 50,
        y: 100,
        height: 1920,
        width: 1080,
        rotationAngle: 0,
        resource: {
          id: 123,
          type: 'image',
          mimeType: 'image/png',
          src: 'https://example.com/image.png',
          height: 1920,
          width: 1080,
        },
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    await expect(<ImageOutput {...props} />).toBeValidAMPStoryElement();
  });
});
