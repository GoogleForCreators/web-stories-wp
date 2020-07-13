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
import apiFetcher from '../../../../../../app/media/media3p/api/apiFetcher';
import { Fixture, MEDIA_PER_PAGE } from '../../../../../../karma/fixture';
import { ROOT_MARGIN } from '../../local/mediaPane';

const createMediaResource = (name) => ({
  name,
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
});

const mediaPage1 = [...new Array(20).keys()].map((n) =>
  createMediaResource(`media/unsplash:${n + 1}`)
);
const mediaPage2 = [...new Array(20).keys()].map((n) =>
  createMediaResource(`media/unsplash:${n + 21}`)
);

describe('Media3pPane fetching', () => {
  let fixture;
  let media3pTab;
  let media3pPane;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ media3pTab: true });

    await fixture.render();

    media3pTab = fixture.querySelector('#library-tab-media3p');
    media3pPane = fixture.querySelector('#library-pane-media3p');
  });

  function mockListMedia() {
    /* eslint-disable-next-line jasmine/no-unsafe-spy */
    spyOn(apiFetcher, 'listMedia').and.callFake(({ pageToken }) => {
      switch (pageToken) {
        case undefined:
          return { media: mediaPage1, nextPageToken: 'page2' };
        case 'page2':
          return { media: mediaPage2, nextPageToken: undefined };
        default:
          throw new Error(`Unexpected pageToken: ${pageToken}`);
      }
    });
  }

  async function expectMediaElements(expectedCount) {
    let mediaElements;
    await waitFor(() => {
      mediaElements = media3pPane.querySelectorAll(
        '[data-testid=mediaElement]'
      );
      if (!mediaElements || mediaElements.length !== expectedCount) {
        throw new Error('Not ready');
      }
    });
    expect(mediaElements.length).toBe(expectedCount);
  }

  it('should render no results message', async () => {
    spyOn(apiFetcher, 'listMedia').and.callFake(() => ({ media: [] }));
    fixture.events.click(media3pTab);

    await waitFor(() => {
      expect(
        fixture.screen.getByText(new RegExp('^No media found$'))
      ).toBeTruthy();
    });
  });

  it('should fetch media resources', async () => {
    mockListMedia();
    fixture.events.click(media3pTab);
    await expectMediaElements(MEDIA_PER_PAGE);
  });

  it('should fetch 2nd page', async () => {
    mockListMedia();
    fixture.events.click(media3pTab);

    const mediaGallery = media3pPane.querySelector(
      '[data-testid="media-gallery-container"]'
    );
    await expectMediaElements(MEDIA_PER_PAGE);

    mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN
    );
    await expectMediaElements(MEDIA_PER_PAGE * 2);
  });
});
