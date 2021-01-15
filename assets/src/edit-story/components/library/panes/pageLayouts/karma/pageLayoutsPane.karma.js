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
import { Fixture } from '../../../../../karma/fixture';

describe('CUJ: Creator can Apply a Page Layout', () => {
  let fixture;
  let originalTimeout;

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    fixture = new Fixture();
    fixture.setFlags({ showPageLayoutsTab: true });
    await fixture.render();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    fixture.restore();
  });

  it('should apply page layout to an empty page', async () => {
    await fixture.editor.library.pageLayoutsTab.click();

    //console.log('about to click');
    await waitFor(() =>
      expect(
        fixture.editor.library.pageLayoutsPane.pageLayouts.length
      ).toBeTruthy()
    );
    //console.log(fixture.editor.library.pageLayoutsPane);
    //console.log('about to click');
    await fixture.events.click(
      fixture.editor.library.pageLayoutsPane.pageLayout('Beauty Cover')
    );
    // await fixture.events.click(fixture.editor.library.text.preset('Heading 3'));
    // await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));

    // await fixture.snapshot('applied page layout');
  });
});
