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

import { Fixture, MEDIA_PER_PAGE } from '../../../../../../karma/fixture';
import { ROOT_MARGIN } from '../mediaPane';

describe('MediaPane fetching', () => {
  let fixture;
  let localPane;
  let nonMediaTab;

  beforeEach(async () => {
    jasmine.clock().install();

    fixture = new Fixture();
    await fixture.render();

    localPane = fixture.querySelector('#library-pane-media');
    nonMediaTab = fixture.querySelector('#library-tab-shapes');
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.restore();
  });

  async function expectMediaElements(expectedCount) {
    let mediaElements;
    await waitFor(() => {
      mediaElements = localPane.querySelectorAll('[data-testid^=mediaElement]');
      if (!mediaElements || mediaElements.length !== expectedCount) {
        throw new Error(
          `Not ready: ${mediaElements?.length} != ${expectedCount}`
        );
      }
      jasmine.clock().tick(10);
    });
    expect(mediaElements.length).toBe(expectedCount);
  }

  it('should fetch 2nd page', async () => {
    const mediaGallery = localPane.querySelector(
      '[data-testid="media-gallery-container"]'
    );

    await expectMediaElements(MEDIA_PER_PAGE);

    mediaGallery.scrollTo(
      0,
      mediaGallery.scrollHeight - mediaGallery.clientHeight - ROOT_MARGIN / 2
    );
    jasmine.clock().tick(500);

    await expectMediaElements(MEDIA_PER_PAGE * 2);
  });

  it('should not load results on resize if tab is hidden', async () => {
    localPane.querySelector('[data-testid="media-gallery-container"]');
    await expectMediaElements(MEDIA_PER_PAGE);

    await fixture.events.click(nonMediaTab);

    // Simulate a browser window resize, and complete the event debounce cycle.
    window.dispatchEvent(new Event('resize'));
    jasmine.clock().tick(500);

    // Expect no additional results to be loaded.
    await expectMediaElements(MEDIA_PER_PAGE);
  });
});
