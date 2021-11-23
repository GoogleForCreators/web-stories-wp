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

/**
 * Internal dependencies
 */

import { Fixture, LOCAL_MEDIA_PER_PAGE } from '../../../../../../karma/fixture';

describe('MediaPane fetching', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should fetch additional pages', async () => {
    const localPane = await waitFor(() =>
      fixture.querySelector('#library-pane-media')
    );
    const mediaGallery = await within(localPane).findByTestId(
      'media-gallery-container'
    );

    // ensure fixture.screen has loaded before calling expect to prevent immediate failure
    const initialElementsLength =
      fixture.screen.queryAllByTestId(/^mediaElement-/).length;

    expect(initialElementsLength).toBeGreaterThanOrEqual(LOCAL_MEDIA_PER_PAGE);

    // Scroll all the way down.
    await mediaGallery.scrollTo(0, 9999999999999999999);

    // ensure fixture.screen has loaded before calling expect to prevent immediate failure
    await waitFor(() => {
      const mediaElements = fixture.screen.queryAllByTestId(/^mediaElement-/);

      if (mediaElements.length < initialElementsLength + LOCAL_MEDIA_PER_PAGE) {
        throw new Error('Not loaded yet');
      }

      expect(mediaElements.length).toBeGreaterThanOrEqual(
        initialElementsLength + LOCAL_MEDIA_PER_PAGE
      );
    });
  });
});
