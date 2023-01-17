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
import { waitFor, within } from '@testing-library/preact';

/**
 * Internal dependencies
 */

import { Fixture, LOCAL_MEDIA_PER_PAGE } from '../../../../../../karma/fixture';
import { ROOT_MARGIN } from '../mediaPane';

describe('MediaPane fetching', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
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

    const initialElementsLength =
      fixture.screen.queryAllByTestId(/^mediaElement-/).length;

    // ensure fixture.screen has loaded before calling expect to prevent immediate failure
    // Wait for the debounce
    await fixture.events.sleep(1000);
    await waitFor(() => {
      if (initialElementsLength !== LOCAL_MEDIA_PER_PAGE) {
        throw new Error(
          `wait for initial fetch ${initialElementsLength} != ${LOCAL_MEDIA_PER_PAGE}`
        );
      }
      expect(initialElementsLength).toEqual(LOCAL_MEDIA_PER_PAGE);
    });

    // Scroll all the way down.
    await mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );

    // ensure fixture.screen has loaded before calling expect to prevent immediate failure
    await waitFor(() => {
      if (
        fixture.screen.queryAllByTestId(/^mediaElement-/).length <
        initialElementsLength + LOCAL_MEDIA_PER_PAGE
      ) {
        throw new Error('Not loaded yet');
      }

      expect(
        fixture.screen.queryAllByTestId(/^mediaElement-/).length
      ).toBeGreaterThanOrEqual(initialElementsLength + LOCAL_MEDIA_PER_PAGE);
    });
  });
});
