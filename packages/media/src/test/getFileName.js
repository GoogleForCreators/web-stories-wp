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
import getFileName from '../getFileName';

describe('getFileName', () => {
  it('should remove the file extension', () => {
    expect(getFileName({ name: 'my-video.mp4' })).toStrictEqual('my-video');
  });

  it('should remove the file extension with period in name', () => {
    expect(getFileName({ name: 'my.video.mp4' })).toStrictEqual('my.video');
  });

  it('should support files without extension', () => {
    expect(getFileName({ name: 'my-video' })).toStrictEqual('my-video');
  });

  it('should return an empty string if missing name', () => {
    expect(getFileName({ name: '' })).toStrictEqual('');
  });

  it('should default to an empty name', () => {
    expect(getFileName({})).toStrictEqual('');
  });
});
