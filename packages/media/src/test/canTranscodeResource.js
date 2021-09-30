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
import canTranscodeResource from '../canTranscodeResource';

describe('canTranscodeResource', () => {
  it('should return true and be transcoded', () => {
    const resource = {
      id: 789,
      src: 'http://image-url.com',
      type: 'image',
      mimeType: 'image/png',
      width: 100,
      height: 100,
      local: false,
      isExternal: false,
      isTranscoding: false,
      isTrimming: false,
      isMuting: false,
      alt: 'image :)',
    };
    expect(canTranscodeResource(resource)).toBeTrue();
  });

  it('should return true if given null', () => {
    expect(canTranscodeResource(null)).toBeTrue();
  });

  it('should return true if given empty object', () => {
    expect(canTranscodeResource({})).toBeTrue();
  });

  it('should return false if is local', () => {
    const resource = {
      id: 789,
      src: 'http://image-url.com',
      type: 'image',
      mimeType: 'image/png',
      width: 100,
      height: 100,
      local: true, // Not yet uploaded
      alt: 'image :)',
    };
    expect(canTranscodeResource(resource)).toBeFalse();
  });

  it('should return false if is external', () => {
    const resource = {
      id: 789,
      src: 'http://image-url.com',
      type: 'image',
      mimeType: 'image/png',
      width: 100,
      height: 100,
      local: false,
      isExternal: true,
      alt: 'image :)',
    };
    expect(canTranscodeResource(resource)).toBeFalse();
  });

  it('should return false if is transcoding', () => {
    const resource = {
      id: 789,
      src: 'http://image-url.com',
      type: 'image',
      mimeType: 'image/png',
      width: 100,
      height: 100,
      local: false,
      isExternal: false,
      isTranscoding: true,
      alt: 'image :)',
    };
    expect(canTranscodeResource(resource)).toBeFalse();
  });
});
