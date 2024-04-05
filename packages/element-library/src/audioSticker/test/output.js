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
import AudioStickerOutput from '../output';

describe('AudioSticker output', () => {
  // eslint-disable-next-line jest/no-disabled-tests -- This test will fail until this PR - https://github.com/ampproject/amphtml/pull/39913 is merged.
  it.skip('should produce valid AMP output', async () => {
    const props = {
      element: {
        type: 'audioSticker',
        id: '123',
        x: 50,
        y: 100,
        height: 1920,
        width: 1080,
        rotationAngle: 0,
        size: 'small',
        sticker: 'headphone-cat',
        style: 'none',
      },
      box: { width: 1080, height: 1920, x: 50, y: 100, rotationAngle: 0 },
    };

    await expect(<AudioStickerOutput {...props} />).toBeValidAMPStoryElement();
  });
});
