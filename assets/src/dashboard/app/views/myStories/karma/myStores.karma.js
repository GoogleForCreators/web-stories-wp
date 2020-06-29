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
import Fixture from '../../../../karma/fixture';

/**
 * Internal dependencies
 */
import formattedStoriesArray from '../../../../storybookUtils/formattedStoriesArray';

describe('My Stories View integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  describe('when the page intially loads', () => {
    it('should render', () => {
      const exploreTemplatesMenuItem = fixture.screen.queryByText(
        'Explore Templates'
      );

      expect(exploreTemplatesMenuItem).toBeTruthy();

      waitFor(() => {
        const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
        expect(stories.length).toEqual(formattedStoriesArray.length);
      });
    });

    it('should navigate to Explore Templates', async () => {
      const screen = fixture.screen;

      const exploreTemplatesMenuItem = screen.queryByText('Explore Templates');

      await fixture.events.click(exploreTemplatesMenuItem);

      const viewTemplates = screen.queryByText('Viewing all templates');

      expect(viewTemplates).toBeTruthy();
    });
  });
});
