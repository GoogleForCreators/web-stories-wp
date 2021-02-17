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
import localStore, {
  LOCAL_STORAGE_PREFIX,
} from '../../../../../../utils/localStore';

const RESOURCE_BUILDERS = {
  unsplash: (name) => ({
    name,
    provider: 'UNSPLASH',
    imageUrls: [
      {
        imageName: 'full',
        url: 'http://localhost:9876/__static__/blue-marble.jpg',
        width: 600,
        height: 600,
        mimeType: 'image/png',
      },
      {
        imageName: 'large',
        url: 'http://localhost:9876/__static__/blue-marble.jpg',
        width: 300,
        height: 300,
        mimeType: 'image/png',
      },
      {
        imageName: 'web_stories_thumbnail',
        url: 'http://localhost:9876/__static__/blue-marble.jpg',
        width: 200,
        height: 200,
        mimeType: 'image/png',
      },
    ],
    description: 'A cat',
    type: 'IMAGE',
    createTime: '1234',
    updateTime: '5678',
  }),
  coverr: (name) => ({
    name,
    provider: 'COVERR',
    videoUrls: [
      {
        url: 'http://localhost:9876/__static__/beach.mp4',
        width: 1920,
        height: 1080,
        mimeType: 'image/mp4',
      },
      {
        url: 'http://localhost:9876/__static__/beach.mp4',
        width: 640,
        height: 360,
        mimeType: 'image/jpg',
      },
    ],
    imageUrls: [
      {
        url: 'http://localhost:9876/__static__/beach.jpg',
        width: 1920,
        height: 1080,
        mimeType: 'image/jpg',
      },
      {
        url: 'http://localhost:9876/__static__/beach.jpg',
        width: 640,
        height: 360,
        mimeType: 'image/jpg',
      },
    ],
    description: 'A beach',
    type: 'VIDEO',
    videoMetadata: {
      duration: '12.34s',
    },
    createTime: '1234',
    updateTime: '5678',
  }),
};

// page is index 0.
const mediaPage = (page, provider) =>
  [...new Array(MEDIA_PER_PAGE).keys()].map((n) => {
    const mediaName = `media/${provider}:${n + page * MEDIA_PER_PAGE + 1}`;
    return RESOURCE_BUILDERS[provider](mediaName);
  });

const categories = [
  {
    name: 'categories/unsplash:KHXRtL69hcY',
    label: 'Sustainability',
  },
  {
    name: 'categories/unsplash:bo8jQKTaE0Y',
    label: 'Wallpapers',
  },
  {
    name: 'categories/unsplash:c7USHrQ0Ljw',
    label: 'COVID-19',
  },
  {
    name: 'categories/unsplash:Fzo3zuOHN6w',
    label: 'Travel',
  },
  {
    name: 'categories/unsplash:6sMVjTLSkeQ',
    label: 'Nature',
  },
  {
    name: 'categories/unsplash:iUIsnVtjB0Y',
    label: 'Textures & Patterns',
  },
  {
    name: 'categories/unsplash:BJJMtteDJA4',
    label: 'Current Events',
  },
  {
    name: 'categories/unsplash:towJZFskpGg',
    label: 'People',
  },
  {
    name: 'categories/unsplash:aeu6rL-j6ew',
    label: 'Business & Work',
  },
  {
    name: 'categories/unsplash:J9yrPaHXRQY',
    label: 'Technology',
  },
  {
    name: 'categories/unsplash:Jpg6Kidl-Hk',
    label: 'Animals',
  },
  {
    name: 'categories/unsplash:R_Fyn-Gwtlw',
    label: 'Interiors',
  },
  {
    name: 'categories/unsplash:rnSKDHwwYUk',
    label: 'Architecture',
  },
  {
    name: 'categories/unsplash:xjPR4hlkBGA',
    label: 'Food & Drink',
  },
  {
    name: 'categories/unsplash:Bn-DjrcBrwo',
    label: 'Athletics',
  },
  {
    name: 'categories/unsplash:_8zFHuhRhyo',
    label: 'Spirituality',
  },
  {
    name: 'categories/unsplash:_hb-dl4Q-4U',
    label: 'Health & Wellness',
  },
  {
    name: 'categories/unsplash:hmenvQhUmxM',
    label: 'Film',
  },
  {
    name: 'categories/unsplash:S4MKLAsBB74',
    label: 'Fashion',
  },
  {
    name: 'categories/unsplash:qPYsDzvJOYc',
    label: 'Experimental',
  },
];

// Disable reason: flakey tests.
// See https://github.com/google/web-stories-wp/pull/6162
// eslint-disable-next-line jasmine/no-disabled-tests
xdescribe('Media3pPane fetching', () => {
  let fixture;
  let unsplashSection;
  let coverrSection;
  let media3pPane;

  beforeEach(async () => {
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P}`, true);

    fixture = new Fixture();

    jasmine.clock().install();

    await fixture.render();

    unsplashSection = fixture.querySelector(
      '#provider-bottom-wrapper-unsplash'
    );
    coverrSection = fixture.querySelector('#provider-bottom-wrapper-coverr');
    media3pPane = fixture.querySelector('#library-pane-media3p');
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.restore();
  });

  function mockListMedia() {
    /* eslint-disable-next-line jasmine/no-unsafe-spy */
    spyOn(apiFetcher, 'listMedia').and.callFake(({ pageToken, filter }) => {
      let provider;
      if (filter.includes('unsplash')) {
        provider = 'unsplash';
      } else if (filter.includes('coverr')) {
        provider = 'coverr';
      } else {
        throw Error('Invalid provider in filter: ' + filter);
      }
      switch (pageToken) {
        case undefined:
          return { media: mediaPage(0, provider), nextPageToken: 'page2' };
        case 'page2':
          return { media: mediaPage(1, provider), nextPageToken: undefined };
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

  async function expectMediaElements(section, expectedCount) {
    let mediaElements;
    await waitFor(
      () => {
        mediaElements = section.querySelectorAll('[data-testid^=mediaElement]');
        if (!mediaElements || mediaElements.length !== expectedCount) {
          throw new Error(
            `Not ready: ${mediaElements?.length} != ${expectedCount}`
          );
        }
        jasmine.clock().tick(10);
      },
      { timeout: 5000 }
    );
    expect(mediaElements?.length).toBe(expectedCount);
  }

  it('should render initial page with media3p tab button at top', async () => {
    await fixture.snapshot();
  });

  it('should render no results message', async () => {
    spyOn(apiFetcher, 'listMedia').and.callFake(() => ({ media: [] }));
    await fixture.events.click(fixture.editor.library.media3pTab);

    await waitFor(() => {
      expect(
        fixture.screen.getByText(new RegExp('^No media found$'))
      ).toBeTruthy();
    });

    await fixture.snapshot();
  });

  it('should fetch media resources', async () => {
    mockListMedia();
    await fixture.events.click(fixture.editor.library.media3pTab);
    await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);
  });

  it('should render categories and media resources', async () => {
    mockListMedia();
    mockListCategories();

    await fixture.events.click(fixture.editor.library.media3pTab);

    await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

    await fixture.snapshot();
  });

  it('should arrow navigate between category pills', async () => {
    mockListMedia();
    mockListCategories();
    await fixture.events.click(fixture.editor.library.media3pTab);

    await fixture.events.focus(
      fixture.querySelectorAll('[data-testid="pill"]')[0]
    );
    expect(document.activeElement.textContent).toBe('Sustainability');

    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.textContent).toBe('Wallpapers');

    await fixture.events.keyboard.press('tab');
    expect(document.activeElement).toBe(
      fixture.screen.getByRole('button', { name: 'Expand' })
    );
  });

  it('should expand category section on arrow down', async () => {
    mockListMedia();
    mockListCategories();
    await fixture.events.click(fixture.editor.library.media3pTab);

    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('tab');
    expect(document.activeElement.textContent).toBe('Sustainability');

    await fixture.events.keyboard.press('ArrowDown');
    const expandButton = fixture.screen.getByRole('button', { name: 'Expand' });
    expect(expandButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('should fetch 2nd page', async () => {
    mockListMedia();
    await fixture.events.click(fixture.editor.library.media3pTab);

    const mediaGallery = unsplashSection.querySelector(
      '[data-testid="media-gallery-container"]'
    );
    await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

    mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );
    jasmine.clock().tick(500);
    await expectMediaElements(unsplashSection, MEDIA_PER_PAGE * 2);
  });

  // The scroll position was being reset because the resize event in <Gallery>
  // would render no images when the media pane was hidden (width->0).
  // This was fixed by re-rendering <Gallery> whenever MediaPane/Media3pPane is
  // re-rendered, which causes the resize event to be suppressed at exactly the
  // right time.
  // A more robust fix to the scroll position reset issue can be found here:
  // https://github.com/neptunian/react-photo-gallery/pull/184
  // If that PR be released, another option is to patch it using:
  // https://www.npmjs.com/package/patch-package
  it('should retain scroll position on tab change', async () => {
    mockListMedia();
    await fixture.events.click(fixture.editor.library.media3pTab);

    const mediaGallery = unsplashSection.querySelector(
      '[data-testid="media-gallery-container"]'
    );
    await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);
    mediaGallery.scrollTo(0, 10);
    await waitFor(() => {
      if (mediaGallery.scrollTop != 10) {
        throw new Error('media scroll position must be initially');
      }
    });

    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.media3pTab);
    await waitFor(() => {
      if (mediaGallery.scrollTop != 10) {
        throw new Error('media scroll position must be retained');
      }
    });
  });

  it('should render the second provider', async () => {
    mockListMedia();
    await fixture.events.click(fixture.editor.library.media3pTab);

    const coverrTab = fixture.querySelector('#provider-tab-coverr');

    await fixture.events.click(coverrTab);
    await expectMediaElements(coverrSection, MEDIA_PER_PAGE);
  });

  it('should scroll to the top when a category is selected', async () => {
    mockListMedia();
    mockListCategories();

    await fixture.events.click(fixture.editor.library.media3pTab);

    const mediaGallery = unsplashSection.querySelector(
      '[data-testid="media-gallery-container"]'
    );
    await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

    mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );
    jasmine.clock().tick(500);
    await expectMediaElements(unsplashSection, MEDIA_PER_PAGE * 2);

    const mediaCategories = unsplashSection.querySelectorAll(
      '[data-testid="pill"]'
    );
    await fixture.events.click(mediaCategories[0]);

    await waitFor(() => {
      expect(mediaGallery.scrollTop).toBe(0);
    });
  });

  it('should have a delay before autoplaying videos', async () => {
    mockListMedia();
    await fixture.events.click(fixture.editor.library.media3pTab);

    const coverrTab = fixture.querySelector('#provider-tab-coverr');

    await fixture.events.click(coverrTab);
    await expectMediaElements(coverrSection, MEDIA_PER_PAGE);

    const mediaElements = coverrSection.querySelectorAll(
      '[data-testid^=mediaElement]'
    );

    const firstMediaElement = mediaElements.item(0);
    await fixture.events.focus(firstMediaElement);
    const video = firstMediaElement.querySelector('video');

    expect(video.paused).toBe(true);

    jasmine.clock().tick(700);

    expect(video.paused).toBe(false);
  });

  describe('Gallery navigation', () => {
    it('should handle pressing right when focused', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(0));

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(mediaElements.item(1));
    });

    it('should handle pressing right when at the end of a row', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(1));

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(mediaElements.item(2));
    });

    it('should handle pressing right when the last element is focused', async () => {
      // Only mock 1 page.
      spyOn(apiFetcher, 'listMedia').and.callFake(({ pageToken }) => {
        if (!pageToken) {
          return { media: mediaPage(1, 'unsplash'), nextPageToken: undefined };
        }
        throw new Error(`Unexpected pageToken: ${pageToken}`);
      });

      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(mediaElements.length - 1));

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(
        mediaElements.item(mediaElements.length - 1)
      );
    });

    it('should handle pressing left when focused', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(1));

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(mediaElements.item(0));
    });

    it('should handle pressing left at the beginning of a row', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(2));

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(mediaElements.item(1));
    });

    it('should handle pressing left when the first element is focused', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(0));

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(mediaElements.item(0));
    });

    it('should handle pressing down', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(1));

      await fixture.events.keyboard.press('ArrowDown');

      expect(document.activeElement).toBe(mediaElements.item(3));
    });

    it('should handle pressing up', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(3));

      await fixture.events.keyboard.press('ArrowUp');

      expect(document.activeElement).toBe(mediaElements.item(1));
    });

    it('should handle pressing Home', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(6));

      await fixture.events.keyboard.press('Home');

      expect(document.activeElement).toBe(mediaElements.item(0));
    });

    it('should handle pressing End', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const mediaElements = unsplashSection.querySelectorAll(
        '[data-testid^=mediaElement]'
      );

      await fixture.events.focus(mediaElements.item(6));

      await fixture.events.keyboard.press('End');

      expect(document.activeElement).toBe(
        mediaElements.item(mediaElements.length - 1)
      );
    });
  });

  describe('Provider navigation', () => {
    it('should handle pressing Right', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const providerTabs = media3pPane.querySelectorAll(
        '[data-testid=providerTab]'
      );

      await fixture.events.focus(providerTabs.item(0));

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(providerTabs.item(1));
      await expectMediaElements(coverrSection, MEDIA_PER_PAGE);
    });

    it('should handle pressing Right when no more providers', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const providerTabs = media3pPane.querySelectorAll(
        '[data-testid=providerTab]'
      );

      await fixture.events.focus(providerTabs.item(providerTabs.length - 1));

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(
        providerTabs.item(providerTabs.length - 1)
      );
    });

    it('should handle pressing Left', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const providerTabs = media3pPane.querySelectorAll(
        '[data-testid=providerTab]'
      );

      await fixture.events.focus(providerTabs.item(providerTabs.length - 1));

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(
        providerTabs.item(providerTabs.length - 2)
      );
    });

    it('should handle pressing Left when at the beginning', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      const providerTabs = media3pPane.querySelectorAll(
        '[data-testid=providerTab]'
      );

      await fixture.events.focus(providerTabs.item(0));

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(providerTabs.item(0));
    });
  });
});
