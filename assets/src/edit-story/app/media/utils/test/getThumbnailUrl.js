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
import getThumbnailUrl from '../getThumbnailUrl';

describe('getThumbnailUrl', () => {
  it('should return the smallest available image URL (thumbnail < large < full < default)', () => {
    const resource = {
      src: 'default-url',
      sizes: {
        full: { source_url: 'full-url' },
        web_stories_thumbnail: { source_url: 'thumbnail-url' },
        large: { source_url: 'large-url' },
      },
    };
    expect(getThumbnailUrl(resource)).toBe('thumbnail-url');
  });

  it('should return the smallest available image URL (large < full < default)', () => {
    const resource = {
      src: 'default-url',
      sizes: {
        full: { source_url: 'full-url' },
        large: { source_url: 'large-url' },
      },
    };
    expect(getThumbnailUrl(resource)).toBe('large-url');
  });

  it('should return the smallest available image URL (full < default)', () => {
    const resource = {
      src: 'default-url',
      sizes: {
        full: { source_url: 'full-url' },
      },
    };
    expect(getThumbnailUrl(resource)).toBe('full-url');
  });

  it('should return the default src URL if no alternatives', () => {
    const resource = { src: 'default-url' };
    expect(getThumbnailUrl(resource)).toBe('default-url');
  });
});
