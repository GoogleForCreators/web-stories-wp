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

import { Fixture, MEDIA_PER_PAGE } from '../../../../../../karma/fixture';
import { ROOT_MARGIN } from '../mediaPane';

// Disable reason: tests are out of date.
// TODO: https://github.com/google/web-stories-wp/issues/7606
// eslint-disable-next-line jasmine/no-disabled-tests
xdescribe('MediaPane fetching', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should fetch 2nd page', async () => {
    const localPane = await waitFor(() =>
      fixture.querySelector('#library-pane-media')
    );
    const mediaGallery = await within(localPane).getByTestId(
      'media-gallery-container'
    );

    const initialElements =
      within(mediaGallery).queryAllByTestId(/^mediaElement-/);
    expect(initialElements.length).toBe(MEDIA_PER_PAGE);

    await mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );

    await waitFor(() =>
      expect(
        fixture.screen.queryAllByTestId(/^mediaElement-/).length
      ).toBeGreaterThanOrEqual(MEDIA_PER_PAGE * 2)
    );
  });

  it('should not load results on resize if tab is hidden', async () => {
    const nonMediaTab = await waitFor(() =>
      fixture.querySelector('#library-tab-shapes')
    );

    await waitFor(() =>
      expect(fixture.screen.queryAllByTestId(/mediaElement/).length).toBe(
        MEDIA_PER_PAGE
      )
    );

    await fixture.events.click(nonMediaTab);

    // Simulate a browser window resize, and complete the event debounce cycle.
    window.dispatchEvent(new Event('resize'));
    await fixture.events.sleep(500);

    // Expect no additional results to be loaded.
    await waitFor(() =>
      expect(fixture.screen.queryAllByTestId(/mediaElement/).length).toBe(
        MEDIA_PER_PAGE
      )
    );
  });
});
