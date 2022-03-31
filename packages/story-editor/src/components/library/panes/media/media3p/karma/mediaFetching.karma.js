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
import { waitFor, within } from '@testing-library/react';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import apiFetcher from '../../../../../../app/media/media3p/api/apiFetcher';
import { Fixture, MEDIA_PER_PAGE } from '../../../../../../karma/fixture';
import { ROOT_MARGIN } from '../../local/mediaPane';

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
    blurHash: 'L4CD_PIU00%MD%M{j[xu00%M~qM{',
  }),
  coverr: (name) => ({
    name,
    provider: 'COVERR',
    videoUrls: [
      {
        url: 'http://localhost:9876/__static__/beach.mp4',
        width: 1920,
        height: 1080,
        mimeType: 'video/mp4',
      },
      {
        url: 'http://localhost:9876/__static__/beach.mp4',
        width: 640,
        height: 360,
        mimeType: 'video/mp4',
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
    blurHash: 'D3DM_PIU00%MD%M{j[xu00%M~qM{',
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
    displayName: 'Sustainability',
  },
  {
    name: 'categories/unsplash:bo8jQKTaE0Y',
    displayName: 'Wallpapers',
  },
  {
    name: 'categories/unsplash:c7USHrQ0Ljw',
    displayName: 'COVID-19',
  },
  {
    name: 'categories/unsplash:Fzo3zuOHN6w',
    displayName: 'Travel',
  },
  {
    name: 'categories/unsplash:6sMVjTLSkeQ',
    displayName: 'Nature',
  },
  {
    name: 'categories/unsplash:iUIsnVtjB0Y',
    displayName: 'Textures & Patterns',
  },
  {
    name: 'categories/unsplash:BJJMtteDJA4',
    displayName: 'Current Events',
  },
  {
    name: 'categories/unsplash:towJZFskpGg',
    displayName: 'People',
  },
  {
    name: 'categories/unsplash:aeu6rL-j6ew',
    displayName: 'Business & Work',
  },
  {
    name: 'categories/unsplash:J9yrPaHXRQY',
    displayName: 'Technology',
  },
  {
    name: 'categories/unsplash:Jpg6Kidl-Hk',
    displayName: 'Animals',
  },
  {
    name: 'categories/unsplash:R_Fyn-Gwtlw',
    displayName: 'Interiors',
  },
  {
    name: 'categories/unsplash:rnSKDHwwYUk',
    displayName: 'Architecture',
  },
  {
    name: 'categories/unsplash:xjPR4hlkBGA',
    displayName: 'Food & Drink',
  },
  {
    name: 'categories/unsplash:Bn-DjrcBrwo',
    displayName: 'Athletics',
  },
  {
    name: 'categories/unsplash:_8zFHuhRhyo',
    displayName: 'Spirituality',
  },
  {
    name: 'categories/unsplash:_hb-dl4Q-4U',
    displayName: 'Health & Wellness',
  },
  {
    name: 'categories/unsplash:hmenvQhUmxM',
    displayName: 'Film',
  },
  {
    name: 'categories/unsplash:S4MKLAsBB74',
    displayName: 'Fashion',
  },
  {
    name: 'categories/unsplash:qPYsDzvJOYc',
    displayName: 'Experimental',
  },
];

describe('Media3pPane fetching', () => {
  let fixture;
  let listMediaSpy;
  let listCategoriesSpy;

  beforeEach(async () => {
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P}`, true);

    fixture = new Fixture();

    await fixture.render();
    await fixture.collapseHelpCenter();

    listMediaSpy = spyOn(apiFetcher, 'listMedia');
    listCategoriesSpy = spyOn(apiFetcher, 'listCategories');

    mockListMedia();
    mockListCategories();
  });

  afterEach(() => {
    fixture.restore();
  });

  function mockListMedia() {
    listMediaSpy.and.callFake(({ pageToken, filter }) => {
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
    listCategoriesSpy.and.callFake(() => {
      return {
        categories,
      };
    });
  }

  async function expectMediaElements(section, expectedCount) {
    let mediaElements;
    await waitFor(
      () => {
        mediaElements = within(section).queryAllByTestId(/^mediaElement/);

        // Continue waiting if number of elements does not match the expectedCount
        if (!mediaElements || mediaElements.length !== expectedCount) {
          throw new Error(
            `Not ready: ${mediaElements?.length} != ${expectedCount}`
          );
        }
      },
      { timeout: 5000 }
    );
    expect(mediaElements?.length).toBe(expectedCount);
  }

  async function waitForInitialMediaLoad() {
    const mediaElements = await within(
      fixture.editor.library.media3p.unsplashSection
    ).findAllByTestId(/^mediaElement/, { timeout: 5000 });
    expect(mediaElements).toBeTruthy();
  }

  it('should render no results message', async () => {
    listMediaSpy.and.callFake(() => ({ media: [] }));
    await fixture.events.click(fixture.editor.library.media3pTab);

    await expect(
      fixture.screen.findByText(new RegExp('^No media found.$'))
    ).toBeTruthy();

    await fixture.snapshot();
  });

  it('should render categories and media resources', async () => {
    await fixture.events.click(fixture.editor.library.media3pTab);

    // 3p media fetching can take extra time to load, waiting to prevent flakey tests
    await waitForInitialMediaLoad();

    expectMediaElements(
      fixture.editor.library.media3p.unsplashSection,
      MEDIA_PER_PAGE
    );
    await fixture.snapshot();
  });

  it('should arrow navigate between category pills', async () => {
    await fixture.events.click(fixture.editor.library.media3pTab);
    // 3p media fetching can take extra time to load, waiting to prevent flakey tests
    await waitForInitialMediaLoad();
    await fixture.events.focus(fixture.editor.library.media3p.filters[0]);
    expect(document.activeElement.textContent).toBe('Sustainability');

    await fixture.events.keyboard.press('ArrowRight');
    expect(document.activeElement.textContent).toBe('Wallpapers');

    await fixture.events.keyboard.press('tab');
    expect(document.activeElement).toBe(
      fixture.editor.library.media3p.expandFiltersButton
    );
  });

  it('should expand category section on arrow down', async () => {
    await fixture.events.click(fixture.editor.library.media3pTab);
    // 3p media fetching can take extra time to load, waiting to prevent flakey tests
    await waitForInitialMediaLoad();
    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('tab');
    await fixture.events.keyboard.press('tab');
    expect(document.activeElement.textContent).toBe('Sustainability');

    await fixture.events.keyboard.press('ArrowDown');
    expect(
      fixture.editor.library.media3p.expandFiltersButton.getAttribute(
        'aria-expanded'
      )
    ).toBe('true');
  });

  it('should fetch 2nd page', async () => {
    await fixture.events.click(fixture.editor.library.media3pTab);
    // 3p media fetching can take extra time to load, waiting to prevent flakey tests
    await waitForInitialMediaLoad();

    const mediaGallery = fixture.editor.library.media3p.mediaGallery;
    await expectMediaElements(
      fixture.editor.library.media3p.unsplashSection,
      MEDIA_PER_PAGE
    );

    mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );
    // Wait for debounce
    await expectMediaElements(
      fixture.editor.library.media3p.unsplashSection,
      MEDIA_PER_PAGE * 2
    );
  });

  it('should render the second media provider', async () => {
    await fixture.events.click(fixture.editor.library.media3pTab);
    // 3p media fetching can take extra time to load, waiting to prevent flakey tests
    await waitForInitialMediaLoad();
    await fixture.events.click(fixture.editor.library.media3p.coverrTab);

    const mediaGallery = fixture.editor.library.media3p.mediaGallery;
    mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );

    // Wait for the debounce
    await expectMediaElements(
      fixture.editor.library.media3p.coverrSection,
      // In 1600:1000 the coverr section will fetch again due to screen height
      // This may fail locally if the viewport is a different size.
      MEDIA_PER_PAGE * 2
    );
  });

  it('should scroll to the top when a category is selected', async () => {
    await fixture.events.click(fixture.editor.library.media3pTab);
    // 3p media fetching can take extra time to load, waiting to prevent flakey tests
    await waitForInitialMediaLoad();
    const mediaGallery = fixture.editor.library.media3p.mediaGallery;
    await expectMediaElements(
      fixture.editor.library.media3p.unsplashSection,
      MEDIA_PER_PAGE
    );

    mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );

    await expectMediaElements(
      fixture.editor.library.media3p.unsplashSection,
      MEDIA_PER_PAGE * 2
    );

    await fixture.events.click(fixture.editor.library.media3p.mediaElements[0]);

    await waitFor(() => {
      if (mediaGallery.scrollTop !== 0) {
        throw new Error('still scrolling');
      }
      expect(mediaGallery.scrollTop).toBe(0);
    });
  });
  // TODO: https://github.com/googleforcreators/web-stories-wp/issues/10144
  // eslint-disable-next-line jasmine/no-disabled-tests
  xit('should have a delay before autoplaying videos', async () => {
    await fixture.events.click(fixture.editor.library.media3pTab);
    // 3p media fetching can take extra time to load, waiting to prevent flakey tests
    await waitForInitialMediaLoad();
    await fixture.events.click(fixture.editor.library.media3p.coverrTab);
    //  Wait for the debounce
    await expectMediaElements(
      fixture.editor.library.media3p.coverrSection,
      // In 1600:1000 the coverr section will fetch again due to screen height
      // This may fail locally if the viewport is a different size.
      MEDIA_PER_PAGE * 2
    );

    const firstMediaElement = waitFor(
      () => fixture.editor.library.media3p.mediaElements[0]
    );

    expect(firstMediaElement.querySelector('video').paused).toBe(true);

    await fixture.events.focus(firstMediaElement);

    // shouldn't play yet
    expect(firstMediaElement.querySelector('video').paused).toBe(true);

    // wait for a little and check again
    await waitFor(() => {
      if (firstMediaElement.querySelector('video').paused) {
        throw new Error('wait');
      }

      expect(firstMediaElement.querySelector('video').paused).toBe(false);
    });
  });

  describe('Gallery navigation', () => {
    it('should handle pressing right and left when focused', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { unsplashSection } = fixture.editor.library.media3p;

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      await fixture.events.focus(
        fixture.editor.library.media3p.insertionBtnByIndex(0)
      );

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(1)
      );

      await fixture.events.keyboard.press('ArrowLeft');
      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(0)
      );
    });

    it('should handle pressing right when at the end of a row', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { unsplashSection } = fixture.editor.library.media3p;

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      await fixture.events.focus(
        fixture.editor.library.media3p.insertionBtnByIndex(1)
      );

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(2)
      );
    });

    it('should handle pressing right when the last element is focused', async () => {
      // Only mock 1 page.
      listMediaSpy.and.callFake(({ pageToken }) => {
        if (!pageToken) {
          return { media: mediaPage(1, 'unsplash'), nextPageToken: undefined };
        }
        throw new Error(`Unexpected pageToken: ${pageToken}`);
      });

      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { mediaElements, unsplashSection } = fixture.editor.library.media3p;

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      await fixture.events.focus(
        fixture.editor.library.media3p.insertionBtnByIndex(
          mediaElements.length - 1
        )
      );

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(
          mediaElements.length - 1
        )
      );
    });

    it('should handle pressing left at the beginning of a row', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { unsplashSection } = fixture.editor.library.media3p;

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      await fixture.events.focus(
        fixture.editor.library.media3p.insertionBtnByIndex(2)
      );

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(1)
      );
    });

    it('should handle pressing left when the first element is focused', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { unsplashSection } = fixture.editor.library.media3p;

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      await fixture.events.focus(
        fixture.editor.library.media3p.insertionBtnByIndex(0)
      );

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(0)
      );
    });

    it('should handle pressing down', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { unsplashSection } = fixture.editor.library.media3p;

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      await fixture.events.focus(
        fixture.editor.library.media3p.insertionBtnByIndex(1)
      );

      await fixture.events.keyboard.press('ArrowDown');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(3)
      );
    });

    it('should handle pressing up', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { unsplashSection } = fixture.editor.library.media3p;

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      await fixture.events.focus(
        fixture.editor.library.media3p.insertionBtnByIndex(3)
      );

      await fixture.events.keyboard.press('ArrowUp');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(1)
      );
    });

    it('should handle pressing End and Home', async () => {
      mockListMedia();
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { unsplashSection } = fixture.editor.library.media3p;

      await expectMediaElements(unsplashSection, MEDIA_PER_PAGE);

      await fixture.events.focus(
        fixture.editor.library.media3p.insertionBtnByIndex(0)
      );

      await fixture.events.keyboard.press('End');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex([MEDIA_PER_PAGE - 1])
      );

      await fixture.events.keyboard.press('Home');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.insertionBtnByIndex(0)
      );
    });
  });

  describe('Provider navigation', () => {
    it('should handle pressing Right', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      expect(fixture.editor.library.media3p.tabs.length).toBe(3);

      // unsplash section should be visible
      expect(
        () => fixture.editor.library.media3p.unsplashSection
      ).not.toThrow();

      await fixture.events.focus(fixture.editor.library.media3p.tabs[0]);

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.coverrTab
      );

      // unsplash section should still be showing
      expect(
        () => fixture.editor.library.media3p.unsplashSection
      ).not.toThrow();
      expect(() => fixture.editor.library.media3p.coverrSection).toThrow();
    });

    it('should handle pressing Right when no more providers', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { tabs } = fixture.editor.library.media3p;
      expect(tabs.length).toBe(3);

      // unsplash section should be visible
      expect(
        () => fixture.editor.library.media3p.unsplashSection
      ).not.toThrow();

      await fixture.events.focus(tabs[tabs.length - 1]);

      await fixture.events.keyboard.press('ArrowRight');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.unsplashTab
      );
    });

    it('should handle pressing Left', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { tabs } = fixture.editor.library.media3p;
      expect(tabs.length).toBe(3);

      // unsplash section should be visible
      expect(
        () => fixture.editor.library.media3p.unsplashSection
      ).not.toThrow();

      await fixture.events.focus(tabs[tabs.length - 1]);

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(tabs[tabs.length - 2]);
    });

    it('should handle pressing Left when at the beginning', async () => {
      await fixture.events.click(fixture.editor.library.media3pTab);
      // 3p media fetching can take extra time to load, waiting to prevent flakey tests
      await waitForInitialMediaLoad();
      const { tabs } = fixture.editor.library.media3p;
      expect(tabs.length).toBe(3);

      // unsplash section should be visible
      expect(
        () => fixture.editor.library.media3p.unsplashSection
      ).not.toThrow();

      await fixture.events.focus(tabs[0]);

      await fixture.events.keyboard.press('ArrowLeft');

      expect(document.activeElement).toBe(
        fixture.editor.library.media3p.tenorTab
      );
    });
  });
});
