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
      width: 480,
      height: 640,
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
const categories = [
  {
    id: 'categories/unsplash:KHXRtL69hcY',
    displayName: 'Sustainability',
  },
  {
    id: 'categories/unsplash:bo8jQKTaE0Y',
    displayName: 'Wallpapers',
  },
  {
    id: 'categories/unsplash:c7USHrQ0Ljw',
    displayName: 'COVID-19',
  },
  {
    id: 'categories/unsplash:Fzo3zuOHN6w',
    displayName: 'Travel',
  },
  {
    id: 'categories/unsplash:6sMVjTLSkeQ',
    displayName: 'Nature',
  },
  {
    id: 'categories/unsplash:iUIsnVtjB0Y',
    displayName: 'Textures & Patterns',
  },
  {
    id: 'categories/unsplash:BJJMtteDJA4',
    displayName: 'Current Events',
  },
  {
    id: 'categories/unsplash:towJZFskpGg',
    displayName: 'People',
  },
  {
    id: 'categories/unsplash:aeu6rL-j6ew',
    displayName: 'Business & Work',
  },
  {
    id: 'categories/unsplash:J9yrPaHXRQY',
    displayName: 'Technology',
  },
  {
    id: 'categories/unsplash:Jpg6Kidl-Hk',
    displayName: 'Animals',
  },
  {
    id: 'categories/unsplash:R_Fyn-Gwtlw',
    displayName: 'Interiors',
  },
  {
    id: 'categories/unsplash:rnSKDHwwYUk',
    displayName: 'Architecture',
  },
  {
    id: 'categories/unsplash:xjPR4hlkBGA',
    displayName: 'Food & Drink',
  },
  {
    id: 'categories/unsplash:Bn-DjrcBrwo',
    displayName: 'Athletics',
  },
  {
    id: 'categories/unsplash:_8zFHuhRhyo',
    displayName: 'Spirituality',
  },
  {
    id: 'categories/unsplash:_hb-dl4Q-4U',
    displayName: 'Health & Wellness',
  },
  {
    id: 'categories/unsplash:hmenvQhUmxM',
    displayName: 'Film',
  },
  {
    id: 'categories/unsplash:S4MKLAsBB74',
    displayName: 'Fashion',
  },
  {
    id: 'categories/unsplash:qPYsDzvJOYc',
    displayName: 'Experimental',
  },
];

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

  function mockListCategories() {
    /* eslint-disable-next-line jasmine/no-unsafe-spy */
    spyOn(apiFetcher, 'listCategories').and.callFake(() => {
      return {
        categories: categories,
      };
    });
  }

  async function expectMediaElements(expectedCount) {
    let mediaElements;
    await waitFor(() => {
      mediaElements = media3pPane.querySelectorAll(
        '[data-testid=mediaElement]'
      );
      if (!mediaElements || mediaElements.length !== expectedCount) {
        throw new Error(
          `Not ready: ${mediaElements?.length} != ${expectedCount}`
        );
      }
    });
    expect(mediaElements.length).toBe(expectedCount);
  }

  it('should render initial content with media3p tab', async () => {
    await fixture.snapshot();
  });

  it('should render no results message', async () => {
    spyOn(apiFetcher, 'listMedia').and.callFake(() => ({ media: [] }));
    await fixture.events.click(media3pTab);

    await waitFor(() => {
      expect(
        fixture.screen.getByText(new RegExp('^No media found$'))
      ).toBeTruthy();
    });

    await fixture.snapshot();
  });

  it('should fetch media resources', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);
    await expectMediaElements(MEDIA_PER_PAGE);
  });

  it('should render categories and media resources', async () => {
    mockListMedia();
    mockListCategories();
    await fixture.events.click(media3pTab);
    await fixture.snapshot();
  });

  it('should fetch 2nd page', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    const mediaGallery = media3pPane.querySelector(
      '[data-testid="media-gallery-container"]'
    );
    await expectMediaElements(MEDIA_PER_PAGE);

    mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );
    await expectMediaElements(MEDIA_PER_PAGE * 2);
  });

  it('should handle pressing right when focused', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(0));

    await fixture.events.keyboard.press('ArrowRight');

    expect(document.activeElement).toBe(mediaElements.item(1));
  });

  it('should handle pressing right when at the end of a row', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(1));

    await fixture.events.keyboard.press('ArrowRight');

    expect(document.activeElement).toBe(mediaElements.item(2));
  });

  it('should handle pressing right when the last element is focused', async () => {
    // Only mock 1 page.
    spyOn(apiFetcher, 'listMedia').and.callFake(({ pageToken }) => {
      if (!pageToken) {
        return { media: mediaPage2, nextPageToken: undefined };
      }
      throw new Error(`Unexpected pageToken: ${pageToken}`);
    });

    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(mediaElements.length - 1));

    await fixture.events.keyboard.press('ArrowRight');

    expect(document.activeElement).toBe(
      mediaElements.item(mediaElements.length - 1)
    );
  });

  it('should handle pressing left when focused', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(1));

    await fixture.events.keyboard.press('ArrowLeft');

    expect(document.activeElement).toBe(mediaElements.item(0));
  });

  it('should handle pressing left at the beginning of a row', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(2));

    await fixture.events.keyboard.press('ArrowLeft');

    expect(document.activeElement).toBe(mediaElements.item(1));
  });

  it('should handle pressing left when the first element is focused', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(0));

    await fixture.events.keyboard.press('ArrowLeft');

    expect(document.activeElement).toBe(mediaElements.item(0));
  });

  it('should handle pressing down', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(1));

    await fixture.events.keyboard.press('ArrowDown');

    expect(document.activeElement).toBe(mediaElements.item(3));
  });

  it('should handle pressing up', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(3));

    await fixture.events.keyboard.press('ArrowUp');

    expect(document.activeElement).toBe(mediaElements.item(1));
  });

  it('should handle pressing Home', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(6));

    await fixture.events.keyboard.press('Home');

    expect(document.activeElement).toBe(mediaElements.item(0));
  });

  it('should handle pressing End', async () => {
    mockListMedia();
    await fixture.events.click(media3pTab);

    await expectMediaElements(MEDIA_PER_PAGE);

    let mediaElements = media3pPane.querySelectorAll(
      '[data-testid=mediaElement]'
    );

    await fixture.events.focus(mediaElements.item(6));

    await fixture.events.keyboard.press('End');

    expect(document.activeElement).toBe(
      mediaElements.item(mediaElements.length - 1)
    );
  });
});
