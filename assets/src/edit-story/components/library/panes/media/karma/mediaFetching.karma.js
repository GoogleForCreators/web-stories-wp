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

import { Fixture, MEDIA_PER_PAGE } from '../../../../../karma/fixture';
import { ROOT_MARGIN } from '../mediaPane';

describe('MediaPane fetching', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should fetch 2nd page', async () => {
    const mediaLibrary = fixture.querySelector('[data-testid="mediaLibrary"]');
    let mediaElements = fixture.querySelectorAll('[data-testid=mediaElement]');

    expect(mediaElements.length).toBe(MEDIA_PER_PAGE);

    mediaLibrary.scrollTo(
      0,
      mediaLibrary.scrollHeight - mediaLibrary.clientHeight - ROOT_MARGIN
    );

    await waitFor(() => {
      mediaElements = fixture.querySelectorAll('[data-testid=mediaElement]');
      if (!(mediaElements.length === MEDIA_PER_PAGE * 2)) {
        throw new Error('2nd page not yet loaded');
      }
    });

    expect(mediaElements.length).toBe(MEDIA_PER_PAGE * 2);
  });
});
