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
 * External dependencies
 */
import { ELEMENT_TYPES } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import { videoElementMissingCaptions } from '../videoElementMissingCaptions';

describe('videoElementMissingCaptions', () => {
  it('should return a warning if video element missing captions', () => {
    const element = {
      id: 'elementid',
      type: ELEMENT_TYPES.VIDEO,
    };

    const test = videoElementMissingCaptions(element);
    expect(test).toBeTrue();
  });

  it('should return a warning if video element has empty captions', () => {
    const element = {
      id: 'elementid',
      type: ELEMENT_TYPES.VIDEO,
      tracks: [],
    };
    const test = videoElementMissingCaptions(element);
    expect(test).toBeTrue();
  });

  it('should return undefined if video element has captions', () => {
    const element = {
      id: 'elementid',
      type: ELEMENT_TYPES.TEXT,
      tracks: [{ id: 'trackid' }],
    };
    expect(videoElementMissingCaptions(element)).toBeFalse();
  });
});
