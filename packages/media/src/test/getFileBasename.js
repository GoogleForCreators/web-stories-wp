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
import getFileBasename from '../getFileBasename';

describe('getFileName', () => {
  it('should remove the file extension', () => {
    expect(getFileBasename({ name: 'my-video.mp4' })).toBe('my-video');
  });

  it('should remove the file extension with period in name', () => {
    expect(getFileBasename({ name: 'my.video.mp4' })).toBe('my.video');
  });

  it('should support files without extension', () => {
    expect(getFileBasename({ name: 'my-video' })).toBe('my-video');
  });

  it('should return an empty string if missing name', () => {
    expect(getFileBasename({ name: '' })).toBe('');
  });

  it('should default to an empty name', () => {
    expect(getFileBasename({})).toBe('');
  });
});
