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
import Media3pApiProvider from '../../../../../../app/media/media3p/api/media3pApiProvider';
import Media3pApiProviderFixture from '../../../../../../app/media/media3p/api/karma/media3pApiProviderFixture';

const media = [
  {
    id: 1,
    type: 'image',
    local: false,
    alt: 'image alt',
    mimeType: 'image/jpeg',
    width: 18,
    height: 12,
    src:
      'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/how_to_brush_dogs_teeth_slideshow/1800x1200_how_to_brush_dogs_teeth_slideshow.jpg',
  },
  {
    id: 1,
    type: 'image',
    local: false,
    alt: 'image alt',
    mimeType: 'image/jpeg',
    width: 128,
    height: 72,
    src:
      'https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/dogs_1280p_0.jpg?itok=cnRk0HYq',
  },
];

describe('Media3pPane fetching', () => {
  let fixture;
  let media3pApiFixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ media3pTab: true });

    media3pApiFixture = new Media3pApiProviderFixture();
    fixture
      .stubComponent(Media3pApiProvider)
      .callFake(media3pApiFixture.Component);

    media3pApiFixture.listMedia.and.callFake(() => ({ media }));

    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
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
