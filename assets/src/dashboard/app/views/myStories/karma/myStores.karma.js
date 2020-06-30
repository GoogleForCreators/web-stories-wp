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
 * Internal dependencies
 */
import Fixture from '../../../../karma/fixture';
import formattedStoriesArray from '../../../../storybookUtils/formattedStoriesArray';
import formattedUsersObject from '../../../../storybookUtils/formattedUsersObject';

// Test coverage
// - Navigate to Explore Templates - Done
// - Switch to Drafts - Done
// - Switch to Published - Done
// - Search Stories Text Box - Done
// - Sort By Date - Done
// - Sort By Last Modified - Done
// - Sort By Name - Done
// - Sort By Created By - Done
// - Switch to List View - Done
// - Switch to List view and back to Grid View - Done
// - Sort By Title in List View - Done
// - Sort By Author in List View - Done
// - Sort By Date Created in List View - Done
// - Sort By Last Modified In List View
// - Rename Story
// - Duplicate Story
// - Delete Story

describe('My Stories View integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render', () => {
    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    expect(stories.length).toEqual(formattedStoriesArray.length);
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

    const draftsTabButton = fixture.screen.getByRole('button', {
      name: /^Drafts/,
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

    const publishedTabButton = fixture.screen.getByRole('button', {
      name: /^Published/,
    });

    expect(publishedTabButton).toBeTruthy();

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

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    expect(stories.length).toEqual(
      formattedStoriesArray.filter(({ title }) =>
        title.includes(firstStoryTitle)
      ).length
    );
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

  it('should sort by Name', async () => {
    const sortDropdown = fixture.screen.getByLabelText(
      'Choose sort option for display'
    );

    expect(sortDropdown).toBeTruthy();

    await fixture.events.click(sortDropdown);

    const name = fixture.screen.getByText(/Name/);

    expect(name).toBeTruthy();

    await fixture.events.click(name);

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    const renderedStoriesById = stories.map(
      ({ dataset }) => dataset['testid'].split('-').slice(-1)[0]
    );

    const storyIdsSortedByTitle = formattedStoriesArray
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(({ id }) => String(id));

    expect(renderedStoriesById).toEqual(storyIdsSortedByTitle);
  });

  it('should sort by Created By', async () => {
    const sortDropdown = fixture.screen.getByLabelText(
      'Choose sort option for display'
    );

    expect(sortDropdown).toBeTruthy();

    await fixture.events.click(sortDropdown);

    const createdBy = fixture.screen.getByText(/Created by/);

    expect(createdBy).toBeTruthy();

    await fixture.events.click(createdBy);

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    const renderedStoriesById = stories.map(
      ({ dataset }) => dataset['testid'].split('-').slice(-1)[0]
    );

    const storyIdsSortedByTitle = formattedStoriesArray
      .sort((a, b) =>
        formattedUsersObject[a.author].name.localeCompare(
          formattedUsersObject[b.author].name
        )
      )
      .map(({ id }) => String(id));

    expect(renderedStoriesById).toEqual(storyIdsSortedByTitle);
  });

  it('should switch to List View', async () => {
    const listViewButton = fixture.screen.getByLabelText(/Switch to List View/);

    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);

    const listViewTable = fixture.screen.getByTestId('story-list-view');

    expect(listViewTable).toBeTruthy();
  });

  it('should switch to List View and back to Grid View', async () => {
    let listViewButton = fixture.screen.getByLabelText(/Switch to List View/);

    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);

    const listViewTable = fixture.screen.getByTestId('story-list-view');

    expect(listViewTable).toBeTruthy();

    const gridViewButton = fixture.screen.getByLabelText(/Switch to Grid View/);

    await fixture.events.click(gridViewButton);

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    expect(stories.length).toEqual(formattedStoriesArray.length);
  });

  it('should sort by Title in List View', async () => {
    let listViewButton = fixture.screen.getByLabelText(/Switch to List View/);

    await fixture.events.click(listViewButton);

    const titleHeader = fixture.screen.getByRole('columnheader', {
      name: /Title/,
    });

    await fixture.events.click(titleHeader);

    // drop the header row using slice
    let rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    const storieTitlesSortedByTitle = [...formattedStoriesArray]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(({ title }) => title);

    // title is the second column
    let rowTitles = rows.map((row) => row.children[1].innerText);

    expect(rowTitles).toEqual(storieTitlesSortedByTitle);

    // sort by descending
    await fixture.events.click(titleHeader);

    rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    // title is the second column
    rowTitles = rows.map((row) => row.children[1].innerText);

    expect(rowTitles).toEqual(storieTitlesSortedByTitle.reverse());
  });

  it('should sort by Author in List View', async () => {
    let listViewButton = fixture.screen.getByLabelText(/Switch to List View/);

    await fixture.events.click(listViewButton);

    const authorHeader = fixture.screen.getByRole('columnheader', {
      name: /Author/,
    });

    await fixture.events.click(authorHeader);

    // drop the header row using slice
    let rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    const storieAuthorsSortedByAuthor = [...formattedStoriesArray]
      .sort((a, b) =>
        formattedUsersObject[a.author].name.localeCompare(
          formattedUsersObject[b.author].name
        )
      )
      .map(({ author }) => formattedUsersObject[author].name);

    // author is the third column
    let rowAuthors = rows.map((row) => row.children[2].innerText);

    expect(rowAuthors).toEqual(storieAuthorsSortedByAuthor);

    // sort by descending
    await fixture.events.click(authorHeader);

    rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    // author is the third column
    rowAuthors = rows.map((row) => row.children[2].innerText);

    expect(rowAuthors).toEqual(storieAuthorsSortedByAuthor.reverse());
  });

  it('should sort by Date Created in List View', async () => {
    let listViewButton = fixture.screen.getByLabelText(/Switch to List View/);

    await fixture.events.click(listViewButton);

    const dateCreatedHeader = fixture.screen.getByRole('columnheader', {
      name: /Date Created/,
    });

    await fixture.events.click(dateCreatedHeader);

    // drop the header row using slice
    let rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    const storieDateCreatedSortedByDateCreated = [...formattedStoriesArray]
      .sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      )
      .map(({ created }) => created.split('T')[0]); // TODO use moment to format/look up formatting in component

    // author is the fourth column
    let rowDateCreatedValues = rows.map((row) => row.children[3].innerText);

    expect(rowDateCreatedValues).toEqual(storieDateCreatedSortedByDateCreated);

    // sort by descending
    await fixture.events.click(dateCreatedHeader);

    rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    // author is the fourth column
    rowDateCreatedValues = rows.map((row) => row.children[3].innerText);

    expect(rowDateCreatedValues).toEqual(
      storieDateCreatedSortedByDateCreated.reverse()
    );
  });
});
