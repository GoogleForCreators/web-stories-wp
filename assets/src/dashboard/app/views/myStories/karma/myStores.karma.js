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
import { within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Fixture from '../../../../karma/fixture';
import formattedStoriesArray from '../../../../storybookUtils/formattedStoriesArray';
import formattedUsersObject from '../../../../storybookUtils/formattedUsersObject';
import { getFormattedDisplayDate } from '../../../../utils';
import {
  TEMPLATES_GALLERY_VIEWING_LABELS,
  TEMPLATES_GALLERY_STATUS,
  primaryPaths,
  STORY_STATUS,
  STORY_STATUSES,
  STORY_VIEWING_LABELS,
  STORY_SORT_MENU_ITEMS,
  VIEW_STYLE_LABELS,
  VIEW_STYLE,
} from '../../../../constants';

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
    const exploreTemplatesMenuItem = fixture.screen.queryByRole('link', {
      name: new RegExp('^' + primaryPaths[2].label + '$'),
    });

    await fixture.events.click(exploreTemplatesMenuItem);

    const viewTemplates = fixture.screen.queryByText(
      TEMPLATES_GALLERY_VIEWING_LABELS[TEMPLATES_GALLERY_STATUS.ALL]
    );

    expect(viewTemplates).toBeTruthy();
  });

  it('should switch to the Drafts Tab', async () => {
    const numDrafts = formattedStoriesArray.filter(
      ({ status }) => status === STORY_STATUS.DRAFT
    ).length;

    expect(numDrafts).toBeGreaterThan(0);

    const draftsTabButton = fixture.screen.getByRole('button', {
      name: new RegExp('^' + STORY_STATUSES[1].label),
    });

    await fixture.events.click(draftsTabButton);

    const viewDraftsText = fixture.screen.getByText(
      new RegExp('^' + STORY_VIEWING_LABELS[STORY_STATUS.DRAFT] + '$')
    );

    expect(viewDraftsText).toBeTruthy();

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    expect(stories.length).toEqual(numDrafts);
  });

  it('should switch to the Published Tab', async () => {
    const numPublished = formattedStoriesArray.filter(
      ({ status }) => status === STORY_STATUS.PUBLISHED
    ).length;

    expect(numPublished).toBeGreaterThan(0);

    const publishedTabButton = fixture.screen.getByRole('button', {
      name: new RegExp('^' + STORY_STATUSES[2].label),
    });

    expect(publishedTabButton).toBeTruthy();

    await fixture.events.click(publishedTabButton);

    const viewPublishedText = fixture.screen.getByText(
      new RegExp('^' + STORY_VIEWING_LABELS[STORY_STATUS.PUBLISHED] + '$')
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

    const dateCreated = fixture.screen.getByText(
      new RegExp(`^${STORY_SORT_MENU_ITEMS[1].label}$`)
    );

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

  it('should sort by Last Modified', () => {
    // last modified desc is the default sort
    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    const renderedStoriesById = stories.map(
      ({ dataset }) => dataset['testid'].split('-').slice(-1)[0]
    );
    let copy = [...formattedStoriesArray];

    const storyIdsSortedByLastModified = copy
      .sort((a, b) => b.modified.diff(a.modified)) // initial sort is desc by modified
      .map(({ id }) => String(id));

    expect(renderedStoriesById).toEqual(storyIdsSortedByLastModified);
  });

  it('should sort by Name', async () => {
    const sortDropdown = fixture.screen.getByLabelText(
      'Choose sort option for display'
    );

    expect(sortDropdown).toBeTruthy();

    await fixture.events.click(sortDropdown);

    const name = fixture.screen.getByText(
      new RegExp(`^${STORY_SORT_MENU_ITEMS[0].label}$`)
    );

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

    const createdBy = fixture.screen.getByText(
      new RegExp(`^${STORY_SORT_MENU_ITEMS[3].label}$`)
    );

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
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);

    const listViewTable = fixture.screen.getByTestId('story-list-view');

    expect(listViewTable).toBeTruthy();
  });

  it('should switch to List View and back to Grid View', async () => {
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);

    const listViewTable = fixture.screen.getByTestId('story-list-view');

    expect(listViewTable).toBeTruthy();

    const gridViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.LIST]}$`)
    );

    await fixture.events.click(gridViewButton);

    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    expect(stories.length).toEqual(formattedStoriesArray.length);
  });

  it('should sort by Title in List View', async () => {
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    await fixture.events.click(listViewButton);

    // There is a second hidden span with the same text
    const titleHeader = fixture.screen.getAllByText(/^Title/)[0];

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
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    await fixture.events.click(listViewButton);

    const authorHeader = fixture.screen.getByText(/^Author/);

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
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    await fixture.events.click(listViewButton);

    const dateCreatedHeader = fixture.screen.getByText(/^Date Created/);

    await fixture.events.click(dateCreatedHeader);

    // drop the header row using slice
    let rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    const storieDateCreatedSortedByDateCreated = [...formattedStoriesArray]
      .sort(
        (a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
      )
      .map(({ created }) => getFormattedDisplayDate(created))
      .reverse(); // Default sort order in List View is Desc

    let rowDateCreatedValues = rows.map((row) => row.children[3].innerText);

    expect(rowDateCreatedValues).toEqual(storieDateCreatedSortedByDateCreated);

    // sort by ascending
    await fixture.events.click(dateCreatedHeader);

    rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    // author is the fourth column
    rowDateCreatedValues = rows.map((row) => row.children[3].innerText);

    expect(rowDateCreatedValues).toEqual(
      storieDateCreatedSortedByDateCreated.reverse()
    );
  });

  it('should sort by Last Modified in List View', async () => {
    // last modified desc is the default sort
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    await fixture.events.click(listViewButton);

    // drop the header row using slice
    let rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(formattedStoriesArray.length);

    const storieModifiedSortedByModified = [...formattedStoriesArray]
      .sort((a, b) => b.modified.diff(a.modified)) //initial sort is desc by modified
      .map(({ modified }) => getFormattedDisplayDate(modified));

    // Last Modified is the fifth column
    let rowModifiedValues = rows.map((row) => row.children[4].innerText);

    expect(rowModifiedValues).toEqual(storieModifiedSortedByModified);

    // sort ascending
    const lastModifiedHeader = fixture.screen.getByText(/^Last Modified/);

    await fixture.events.click(lastModifiedHeader);

    rows = fixture.screen.getAllByRole('row').slice(1);

    rowModifiedValues = rows.map((row) => row.children[4].innerText);

    expect(rowModifiedValues).toEqual(storieModifiedSortedByModified.reverse());
  });

  it('should Rename a story', async () => {
    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    const firstStory = stories[0];

    await fixture.events.hover(firstStory);

    const { getByRole, getByText } = within(firstStory);

    const moreOptionsButton = getByRole('button', { name: /^More Options/ });

    await fixture.events.click(moreOptionsButton);

    const rename = getByText(/^Rename/);

    await fixture.events.click(rename);

    const input = getByRole('textbox');
    const inputLength = input.value.length;

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevet overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('Backspace');
    }

    await fixture.events.keyboard.type('A New Title');

    await fixture.events.keyboard.press('Enter');

    expect(getByText(/A New Title/)).toBeTruthy();
  });

  it('should Duplicate a story', async () => {
    let stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    let firstStory = stories[0];

    await fixture.events.hover(firstStory);

    let utils = within(firstStory);

    const moreOptionsButton = utils.getByRole('button', {
      name: /^More Options/,
    });

    await fixture.events.click(moreOptionsButton);

    const duplicate = utils.getByText(/^Duplicate/);

    await fixture.events.click(duplicate);

    stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    firstStory = stories[0];

    utils = within(firstStory);

    expect(utils.getByText(/Copy/)).toBeTruthy();
  });

  it('should Delete a story', async () => {
    let stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    const initialNumStories = stories.length;
    let firstStory = stories[0];

    await fixture.events.hover(firstStory);

    let utils = within(firstStory);

    const moreOptionsButton = utils.getByRole('button', {
      name: /^More Options/,
    });

    await fixture.events.click(moreOptionsButton);

    const deleteStory = utils.getByText(/^Delete/);

    await fixture.events.click(deleteStory);

    const confirmDeleteButton = fixture.screen.getByRole('button', {
      name: /^Delete$/,
    });

    await fixture.events.click(confirmDeleteButton);

    stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    expect(stories.length).toEqual(initialNumStories - 1);
  });

  it('should not Delete a story if Cancel is clicked in the confirmation modal', async () => {
    let stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    const initialNumStories = stories.length;
    let firstStory = stories[0];

    await fixture.events.hover(firstStory);

    let utils = within(firstStory);

    const moreOptionsButton = utils.getByRole('button', {
      name: /^More Options/,
    });

    await fixture.events.click(moreOptionsButton);

    const deleteStory = utils.getByText(/^Delete/);

    await fixture.events.click(deleteStory);

    const cancel = fixture.screen.getByRole('button', {
      name: /^Cancel$/,
    });

    await fixture.events.click(cancel);

    stories = fixture.screen.getAllByTestId(/^story-grid-item/);

    expect(stories.length).toEqual(initialNumStories);
  });

  it('should Rename a story in List View', async () => {
    const storiesSortedByModified = [...formattedStoriesArray].sort((a, b) =>
      b.modified.diff(a.modified)
    );
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);

    // drop the header row using slice
    const rows = fixture.screen.getAllByRole('row').slice(1);

    const utils = within(rows[0]);

    const titleCell = utils.getByRole('cell', {
      name: storiesSortedByModified[0].title,
    });

    await fixture.events.hover(titleCell);

    const moreOptionsButton = utils.getByRole('button', {
      name: /^More Options/,
    });

    await fixture.events.click(moreOptionsButton);

    const rename = utils.getByText(/^Rename/);

    await fixture.events.click(rename);

    const input = utils.getByRole('textbox');
    const inputLength = input.value.length;

    for (let iter = 0; iter < inputLength; iter++) {
      // disable eslint to prevet overlapping .act calls
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('Backspace');
    }

    await fixture.events.keyboard.type('A New Title');

    await fixture.events.keyboard.press('Enter');

    expect(utils.getByText(/A New Title/)).toBeTruthy();
  });

  it('should Duplicate a story in List View', async () => {
    const storiesSortedByModified = [...formattedStoriesArray].sort((a, b) =>
      b.modified.diff(a.modified)
    );
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);

    // drop the header row using slice
    let rows = fixture.screen.getAllByRole('row').slice(1);

    let utils = within(rows[0]);

    const titleCell = utils.getByRole('cell', {
      name: storiesSortedByModified[0].title,
    });

    await fixture.events.hover(titleCell);

    const moreOptionsButton = utils.getByRole('button', {
      name: /^More Options/,
    });

    await fixture.events.click(moreOptionsButton);

    const duplicate = utils.getByText(/^Duplicate/);

    await fixture.events.click(duplicate);

    // requery rows
    rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(storiesSortedByModified.length + 1);

    utils = within(rows[0]);

    expect(utils.getByText(/Copy/)).toBeTruthy();
  });

  it('should Delete a story in List View', async () => {
    const storiesSortedByModified = [...formattedStoriesArray].sort((a, b) =>
      b.modified.diff(a.modified)
    );
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);

    // drop the header row using slice
    let rows = fixture.screen.getAllByRole('row').slice(1);

    let utils = within(rows[0]);

    const titleCell = utils.getByRole('cell', {
      name: storiesSortedByModified[0].title,
    });

    await fixture.events.hover(titleCell);

    const moreOptionsButton = utils.getByRole('button', {
      name: /^More Options/,
    });

    await fixture.events.click(moreOptionsButton);

    const deleteButton = utils.getByText(/^Delete/);

    await fixture.events.click(deleteButton);

    const confirmDeleteButton = fixture.screen.getByRole('button', {
      name: /^Delete$/,
    });

    await fixture.events.click(confirmDeleteButton);

    // requery rows
    rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(storiesSortedByModified.length - 1);
  });

  it('should not Delete a story if Cancel is clicked in the confirmation modal List View', async () => {
    const storiesSortedByModified = [...formattedStoriesArray].sort((a, b) =>
      b.modified.diff(a.modified)
    );
    const listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );

    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);

    // drop the header row using slice
    let rows = fixture.screen.getAllByRole('row').slice(1);

    let utils = within(rows[0]);

    const titleCell = utils.getByRole('cell', {
      name: storiesSortedByModified[0].title,
    });

    await fixture.events.hover(titleCell);

    const moreOptionsButton = utils.getByRole('button', {
      name: /^More Options/,
    });

    await fixture.events.click(moreOptionsButton);

    const deleteButton = utils.getByText(/^Delete/);

    await fixture.events.click(deleteButton);

    const cancel = fixture.screen.getByRole('button', {
      name: /^Cancel$/,
    });

    await fixture.events.click(cancel);

    // requery rows
    rows = fixture.screen.getAllByRole('row').slice(1);

    expect(rows.length).toEqual(storiesSortedByModified.length);
  });
});
