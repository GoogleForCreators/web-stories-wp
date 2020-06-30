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
import formattedStoriesArray from '../../../../storybookUtils/formattedStoriesArray';

// Test coverage
// 1. Navigate to Explore Templates - Done
// 2. Switch to Drafts - Done
// 3. Switch to Published - Done
// 4. Search Stories Text Box
// 5. Sort By Date
// 6. Sort By Last Modified
// 7. Sort By Created By
// 8. Switch to List View
// 9. Sort By Title in List View
// 10. Sort By Author in List View
// 11. Sort By Date Created in List View
// 12. Sort By Last Modified In List View
// 13. Switch to List view and back to Grid View
// 14. Rename Story
// 15. Duplicate Story
// 16. Delete Story

describe('My Stories View integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render', async () => {
    await waitFor(() => {
      const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
      expect(stories.length).toEqual(formattedStoriesArray.length);
    });
  });

  it('should navigate to Explore Templates', async () => {
    const exploreTemplatesMenuItem = fixture.screen.queryByText(
      'Explore Templates'
    );

    await fixture.events.click(exploreTemplatesMenuItem);

    const viewTemplates = fixture.screen.queryByText('Viewing all templates');

    expect(viewTemplates).toBeTruthy();
  });

  it('should switch to the Drafts Tab', async () => {
    const numDrafts = formattedStoriesArray.filter(
      ({ status }) => status === 'draft'
    ).length;

    expect(numDrafts).toBeGreaterThan(0);

    let draftsTabButton;

    await waitFor(() => {
      draftsTabButton = fixture.screen.getByRole('button', { name: /^Drafts/ });

      expect(draftsTabButton).toBeTruthy();
    });

    await fixture.events.click(draftsTabButton);

    const viewDraftsText = fixture.screen.getByText(/Viewing drafts/);

    expect(viewDraftsText).toBeTruthy();

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    expect(stories.length).toEqual(numDrafts);
  });

  it('should switch to the Published Tab', async () => {
    const numPublished = formattedStoriesArray.filter(
      ({ status }) => status === 'publish'
    ).length;

    expect(numPublished).toBeGreaterThan(0);

    let publishedTabButton;

    await waitFor(() => {
      publishedTabButton = fixture.screen.getByRole('button', {
        name: /^Published/,
      });

      expect(publishedTabButton).toBeTruthy();
    });

    await fixture.events.click(publishedTabButton);

    const viewPublishedText = fixture.screen.getByText(
      /Viewing published stories/
    );

    expect(viewPublishedText).toBeTruthy();

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    expect(stories.length).toEqual(numPublished);
  });
});
