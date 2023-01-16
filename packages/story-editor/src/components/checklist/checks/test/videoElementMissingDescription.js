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
import { videoElementMissingDescription } from '../videoElementMissingDescription';

describe('videoElementMissingDescription', () => {
  it('should return a warning if video element missing title', () => {
    const element = {
      id: 'elementid',
      type: ELEMENT_TYPES.VIDEO,
      resource: {},
    };
    const test = videoElementMissingDescription(element);
    expect(test).toBeTrue();
  });

  it('should return a warning if video element has empty description', () => {
    const element = {
      id: 'elementid',
      type: ELEMENT_TYPES.VIDEO,
      alt: '',
      resource: {
        alt: '',
      },
    };
    const test = videoElementMissingDescription(element);
    expect(test).toBeTrue();
  });

  it('should return undefined if video element has title', () => {
    const element = {
      id: 'elementid',
      type: ELEMENT_TYPES.VIDEO,
      alt: 'Video description',
      resource: {},
    };
    expect(videoElementMissingDescription(element)).toBeFalse();
  });

  it('should return undefined if video resource has title', () => {
    const element = {
      id: 'elementid',
      type: ELEMENT_TYPES.VIDEO,
      resource: {
        alt: 'Video description',
      },
    };
    expect(videoElementMissingDescription(element)).toBeFalse();
  });
});
