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
// 4. Search Stories Text Box - Done
// 5. Sort By Date - Done
// 6. Sort By Last Modified - Done
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

  it('should should search/filter using the Search Stories search input', async () => {
    const firstStoryTitle = formattedStoriesArray[0].title;

    const searchInput = fixture.screen.getByPlaceholderText('Search Stories');

    expect(searchInput).toBeTruthy();

    await fixture.events.focus(searchInput);

    await fixture.events.keyboard.type(firstStoryTitle);

    await waitFor(() => {
      const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
      expect(stories.length).toEqual(
        formattedStoriesArray.filter(({ title }) =>
          title.includes(firstStoryTitle)
        ).length
      );
    });
  });

  it('should sort by Date Created', async () => {
    const sortDropdown = fixture.screen.getByLabelText(
      'Choose sort option for display'
    );

    expect(sortDropdown).toBeTruthy();

    await fixture.events.click(sortDropdown);

    const dateCreated = fixture.screen.getByText(/Date created/);

    expect(dateCreated).toBeTruthy();

    await fixture.events.click(dateCreated);

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    const renderedStoriesById = stories.map(
      ({ dataset }) => dataset['testid'].split('-').slice(-1)[0]
    );

    const storyIdsSortedByCreated = formattedStoriesArray
      .sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      )
      .map(({ id }) => String(id));

    expect(renderedStoriesById).toEqual(storyIdsSortedByCreated);
  });

  it('should sort by Last Modified', async () => {
    const sortDropdown = fixture.screen.getByLabelText(
      'Choose sort option for display'
    );

    expect(sortDropdown).toBeTruthy();

    await fixture.events.click(sortDropdown);

    // last modified is the default sort and will be present in the dom twice
    const lastModified = fixture.screen.getAllByText(/Last modified/);

    expect(lastModified).toBeTruthy();

    expect(lastModified.length).toEqual(2);

    // Click the item in the dropdown
    await fixture.events.click(lastModified[1]);

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    const renderedStoriesById = stories.map(
      ({ dataset }) => dataset['testid'].split('-').slice(-1)[0]
    );

    const storyIdsSortedByLastModified = formattedStoriesArray
      .sort((a, b) => a.modified.diff(b.modified))
      .map(({ id }) => String(id));

    expect(renderedStoriesById).toEqual(storyIdsSortedByLastModified);
  });
});
