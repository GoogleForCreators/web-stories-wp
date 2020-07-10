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
 * External dependencies
 */
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../../karma/fixture';
import apiFetcher from '../../../../../../app/media/media3p/api/apiFetcher';

const media = [
  {
    name: 'media/unsplash:1',
    provider: 'UNSPLASH',
    imageUrls: [
      {
        imageName: 'full',
        url: 'http://www.img.com/1',
        width: 640,
        height: 480,
        mimeType: 'image/png',
      },
      {
        imageName: 'large',
        url: 'http://www.img.com/2',
        width: 300,
        height: 200,
        mimeType: 'image/png',
      },
      {
        imageName: 'web_stories_thumbnail',
        url: 'http://www.img.com/3',
        width: 200,
        height: 100,
        mimeType: 'image/png',
      },
    ],
    description: 'A cat',
    type: 'IMAGE',
    createTime: '1234',
    updateTime: '5678',
  },
  {
    name: 'media/unsplash:2',
    provider: 'UNSPLASH',
    imageUrls: [
      {
        imageName: 'full',
        url: 'http://www.img.com/4',
        width: 640,
        height: 480,
        mimeType: 'image/png',
      },
      {
        imageName: 'large',
        url: 'http://www.img.com/5',
        width: 300,
        height: 200,
        mimeType: 'image/png',
      },
      {
        imageName: 'web_stories_thumbnail',
        url: 'http://www.img.com/6',
        width: 200,
        height: 100,
        mimeType: 'image/png',
      },
    ],
    description: 'A dog',
    type: 'IMAGE',
    createTime: '91234',
    updateTime: '95678',
  },
];

describe('Media3pPane fetching', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ media3pTab: true });

    spyOn(apiFetcher, 'listMedia').and.callFake(() => ({ media }));

    await fixture.render();
  });

  it('should fetch media resources', async () => {
    const media3pTab = fixture.querySelector('#library-tab-media3p');
    fixture.events.click(media3pTab);

    const media3pPane = fixture.querySelector('#library-pane-media3p');

    let mediaElements;
    await waitFor(() => {
      mediaElements = media3pPane.querySelectorAll(
        '[data-testid=mediaElement]'
      );
      if (!mediaElements || mediaElements.length === 0) {
        throw new Error('Not ready');
      }
    });
    expect(mediaElements.length).toBe(2);
  });
});
