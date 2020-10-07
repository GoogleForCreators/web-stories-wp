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
import { getRelativeDisplayDate } from '../../../../../date';
import {
  TEMPLATES_GALLERY_VIEWING_LABELS,
  TEMPLATES_GALLERY_STATUS,
  PRIMARY_PATHS,
  STORY_STATUS,
  STORY_STATUSES,
  STORY_VIEWING_LABELS,
  STORY_SORT_MENU_ITEMS,
  VIEW_STYLE_LABELS,
  VIEW_STYLE,
} from '../../../../constants';
import useApi from '../../../api/useApi';

describe('Grid view', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getStoriesState() {
    const {
      state: { stories },
    } = await fixture.renderHook(() => useApi());

    return stories;
  }

  function getGridElementById(id) {
    const gridElement = fixture.screen.getByTestId(`story-grid-item-${id}`);

    return gridElement;
  }

  it('should render', async () => {
    const { storiesOrderById } = await getStoriesState();
    const stories = fixture.screen.getAllByTestId(/^story-grid-item/);
    expect(stories.length).toEqual(storiesOrderById.length);
  });

  it('should navigate to Explore Templates', async () => {
    const exploreTemplatesMenuItem = fixture.screen.queryByRole('link', {
      name: new RegExp('^' + PRIMARY_PATHS[2].label + '$'),
    });

    await fixture.events.click(exploreTemplatesMenuItem);

    const viewTemplates = fixture.screen.queryByText(
      TEMPLATES_GALLERY_VIEWING_LABELS[TEMPLATES_GALLERY_STATUS.ALL]
    );

    expect(viewTemplates).toBeTruthy();
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

    const copiedStory = utils.queryAllByText(/Copy/)[0];

    expect(copiedStory.text.includes('(Copy)')).toBeTruthy();
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

  describe('CUJ: Creator can view their stories in grid view: Filter their stories by All stories and Drafts and Published', () => {
    it('should switch to the Drafts Tab', async () => {
      const { stories } = await getStoriesState();
      const numDrafts = Object.values(stories).filter(
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

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);
      expect(storyElements.length).toEqual(numDrafts);
    });

    it('should switch to the Published Tab', async () => {
      const { stories } = await getStoriesState();
      const numPublished = Object.values(stories).filter(
        ({ status }) =>
          status === STORY_STATUS.PUBLISH || status === STORY_STATUS.FUTURE
      ).length;

      expect(numPublished).toBeGreaterThan(0);

      const publishedTabButton = fixture.screen.getByRole('button', {
        name: new RegExp('^' + STORY_STATUSES[2].label),
      });

      expect(publishedTabButton).toBeTruthy();

      await fixture.events.click(publishedTabButton);

      const viewPublishedText = fixture.screen.getByText(
        new RegExp(
          '^' + STORY_VIEWING_LABELS[STORY_STATUS.PUBLISHED_AND_FUTURE] + '$'
        )
      );

      expect(viewPublishedText).toBeTruthy();

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);
      expect(storyElements.length).toEqual(numPublished);
    });
  });

  describe('CUJ: Creator can view their stories in grid view: Sort their stories (last modified / date created / author / title)', () => {
    it('should should search/filter using the Search Stories search input', async () => {
      const { stories } = await getStoriesState();

      const firstStoryTitle = Object.values(stories)[0].title;

      const searchInput = fixture.screen.getByPlaceholderText('Search Stories');

      expect(searchInput).toBeTruthy();

      await fixture.events.focus(searchInput);

      await fixture.events.keyboard.type(firstStoryTitle);

      // Wait for the debounce
      await fixture.events.sleep(300);

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);

      expect(storyElements.length).toEqual(
        Object.values(stories).filter(({ title }) =>
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

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);

      const renderedStoriesById = storyElements.map(({ dataset }) =>
        Number(dataset['testid'].split('-').slice(-1)[0])
      );

      const { storiesOrderById } = await getStoriesState();

      expect(renderedStoriesById).toEqual(storiesOrderById);
    });

    it('should sort by Last Modified', async () => {
      const { storiesOrderById } = await getStoriesState();
      // last modified desc is the default sort
      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);

      const renderedStoriesById = storyElements.map(({ dataset }) =>
        Number(dataset['testid'].split('-').slice(-1)[0])
      );

      expect(renderedStoriesById).toEqual(storiesOrderById);
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

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);

      const renderedStoriesById = storyElements.map(({ dataset }) =>
        Number(dataset['testid'].split('-').slice(-1)[0])
      );

      const { storiesOrderById } = await getStoriesState();

      expect(renderedStoriesById).toEqual(storiesOrderById);
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

      const { storiesOrderById } = await getStoriesState();

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);

      const renderedStoriesById = storyElements.map(({ dataset }) =>
        Number(dataset['testid'].split('-').slice(-1)[0])
      );

      expect(renderedStoriesById).toEqual(storiesOrderById);
    });
  });

  describe('Action: Creator can preview their story from grid view', () => {
    beforeEach(async () => {
      fixture.setFlags({ enableStoryPreviews: true });
      await fixture.render();
    });

    it('should trigger story preview when user presses Enter while focused on a card', async () => {
      const gridContainer = fixture.screen.getByTestId('dashboard-grid-list');

      await fixture.events.focus(gridContainer);

      await fixture.events.keyboard.press('right');

      await fixture.events.keyboard.press('tab');

      await fixture.events.keyboard.press('Enter');

      const viewPreviewStory = await fixture.screen.queryByTestId(
        'preview-iframe'
      );

      expect(viewPreviewStory).toBeTruthy();
    });

    it('should trigger template preview when user clicks the center button (view or preview)', async () => {
      const { storiesOrderById } = await getStoriesState();

      const currentCard = await getGridElementById(storiesOrderById[1]);
      const utils = within(currentCard);

      const centerActionButton = utils.getByTestId('card-center-action');
      expect(centerActionButton).toBeTruthy();

      // We need to click slightly above the center of the card to avoid clicking 'View'
      await fixture.events.click(centerActionButton);

      const viewPreviewStory = await fixture.screen.queryByTestId(
        'preview-iframe'
      );

      expect(viewPreviewStory).toBeTruthy();
    });

    it('should trigger template preview when user presses Enter while focused on the center button (view or preview)', async () => {
      const { storiesOrderById } = await getStoriesState();

      const currentCard = await getGridElementById(storiesOrderById[1]);
      const utils = within(currentCard);

      const centerActionButton = utils.getByTestId('card-center-action');
      expect(centerActionButton).toBeTruthy();

      await fixture.events.focus(centerActionButton);
      await fixture.events.keyboard.press('Enter');

      const viewPreviewStory = await fixture.screen.queryByTestId(
        'preview-iframe'
      );

      expect(viewPreviewStory).toBeTruthy();
    });
  });
});

describe('List view', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getStoriesState() {
    const {
      state: { stories },
    } = await fixture.renderHook(() => useApi());

    return stories;
  }

  async function getUsers() {
    const {
      state: { users },
    } = await fixture.renderHook(() => useApi());

    return users;
  }

  function isElementVisible(element) {
    return Boolean(
      element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
    );
  }

  describe('CUJ: Creator can view their stories in list view: See stories in list view', () => {
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

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);

      const { storiesOrderById } = await getStoriesState();

      expect(storyElements.length).toEqual(storiesOrderById.length);
    });

    it('should Rename a story', async () => {
      const { stories, storiesOrderById } = await getStoriesState();

      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

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

    it('should Duplicate a story', async () => {
      const { stories, storiesOrderById } = await getStoriesState();

      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

      const gridContainer = fixture.screen.getByTestId('dashboard-grid-list');

      await fixture.events.focus(gridContainer);

      const listViewButton = fixture.screen.getByLabelText(
        new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
      );

      expect(listViewButton).toBeTruthy();

      await fixture.events.hover(listViewButton);

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

      const copiedStory = utils.queryAllByText(/Copy/)[0];

      expect(copiedStory).toBeTruthy();
    });

    it('should Delete a story', async () => {
      const { stories, storiesOrderById } = await getStoriesState();
      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

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

    it('should not Delete a story if Cancel is clicked in the confirmation modal', async () => {
      const { stories, storiesOrderById } = await getStoriesState();
      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

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

  describe('CUJ: Creator can view their stories in list view: Sort their stories (last modified / date created / author / title)', () => {
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

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storieTitlesSortedByTitle = storiesOrderById.map(
        (id) => stories[id].title
      );

      // title is the second column
      let rowTitles = rows.map((row) => row.children[1].innerText);

      expect(rowTitles).toEqual(storieTitlesSortedByTitle);

      // sort by descending
      await fixture.events.click(titleHeader);

      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesOrderById.length);

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

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const users = await getUsers();

      const storieAuthorsSortedByAuthor = storiesOrderById.map(
        (id) => users[stories[id].author].name
      );

      // author is the third column
      let rowAuthors = rows.map((row) => row.children[2].innerText);

      expect(rowAuthors).toEqual(storieAuthorsSortedByAuthor);

      // sort by descending
      await fixture.events.click(authorHeader);

      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesOrderById.length);

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

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storiesDateCreatedSortedByDateCreated = storiesOrderById.map((id) =>
        getRelativeDisplayDate(stories[id].created)
      );

      let rowDateCreatedValues = rows.map((row) => row.children[3].innerText);

      expect(rowDateCreatedValues).toEqual(
        storiesDateCreatedSortedByDateCreated
      );

      // sort by ascending
      await fixture.events.click(dateCreatedHeader);

      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesOrderById.length);

      // author is the fourth column
      rowDateCreatedValues = rows.map((row) => row.children[3].innerText);

      expect(rowDateCreatedValues).toEqual(
        storiesDateCreatedSortedByDateCreated.reverse()
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

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storieModifiedSortedByModified = storiesOrderById.map((id) =>
        getRelativeDisplayDate(stories[id].modified)
      );

      // Last Modified is the fifth column
      let rowModifiedValues = rows.map((row) => row.children[4].innerText);

      expect(rowModifiedValues).toEqual(storieModifiedSortedByModified);

      // sort ascending
      const lastModifiedHeader = fixture.screen.getByText(/^Last Modified/);

      await fixture.events.click(lastModifiedHeader);

      rows = fixture.screen.getAllByRole('row').slice(1);

      rowModifiedValues = rows.map((row) => row.children[4].innerText);

      expect(rowModifiedValues).toEqual(
        storieModifiedSortedByModified.reverse()
      );
    });

    it('should sort by Title in List View with keyboard', async () => {
      const listViewButton = fixture.screen.getByLabelText(
        new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
      );

      await fixture.events.focus(listViewButton);
      await fixture.events.keyboard.press('Enter');

      // There is a second hidden span with the same text
      const titleHeader = fixture.screen.getAllByText(/^Title/)[0];

      await fixture.events.focus(titleHeader);
      await fixture.events.keyboard.press('Enter');
      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storieTitlesSortedByTitle = storiesOrderById.map(
        (id) => stories[id].title
      );

      // title is the second column
      let rowTitles = rows.map((row) => row.children[1].innerText);

      expect(rowTitles).toEqual(storieTitlesSortedByTitle);

      // sort by descending
      await fixture.events.keyboard.press('Enter');

      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesOrderById.length);

      // title is the second column
      rowTitles = rows.map((row) => row.children[1].innerText);

      expect(rowTitles).toEqual(storieTitlesSortedByTitle.reverse());
    });

    it('should sort by Author in List View with keyboard', async () => {
      const listViewButton = fixture.screen.getByLabelText(
        new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
      );

      await fixture.events.focus(listViewButton);
      await fixture.events.keyboard.press('Enter');

      const authorHeader = fixture.screen.getByText(/^Author/);

      await fixture.events.focus(authorHeader);
      await fixture.events.keyboard.press('Enter');

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const users = await getUsers();

      const storieAuthorsSortedByAuthor = storiesOrderById.map(
        (id) => users[stories[id].author].name
      );

      // author is the third column
      let rowAuthors = rows.map((row) => row.children[2].innerText);

      expect(rowAuthors).toEqual(storieAuthorsSortedByAuthor);

      // sort by descending
      await fixture.events.keyboard.press('Enter');

      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesOrderById.length);

      // author is the third column
      rowAuthors = rows.map((row) => row.children[2].innerText);

      expect(rowAuthors).toEqual(storieAuthorsSortedByAuthor.reverse());
    });

    it('should sort by Date Created in List View with keyboard', async () => {
      const listViewButton = fixture.screen.getByLabelText(
        new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
      );

      await fixture.events.focus(listViewButton);
      await fixture.events.keyboard.press('Enter');

      const dateCreatedHeader = fixture.screen.getByText(/^Date Created/);

      await fixture.events.focus(dateCreatedHeader);
      await fixture.events.keyboard.press('Enter');

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storiesDateCreatedSortedByDateCreated = storiesOrderById.map((id) =>
        getRelativeDisplayDate(stories[id].created)
      );

      let rowDateCreatedValues = rows.map((row) => row.children[3].innerText);

      expect(rowDateCreatedValues).toEqual(
        storiesDateCreatedSortedByDateCreated
      );

      // sort by ascending
      await fixture.events.keyboard.press('Enter');

      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesOrderById.length);

      // author is the fourth column
      rowDateCreatedValues = rows.map((row) => row.children[3].innerText);

      expect(rowDateCreatedValues).toEqual(
        storiesDateCreatedSortedByDateCreated.reverse()
      );
    });

    it('should sort by Last Modified in List View with keyboard', async () => {
      // last modified desc is the default sort
      const listViewButton = fixture.screen.getByLabelText(
        new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
      );

      await fixture.events.focus(listViewButton);
      await fixture.events.keyboard.press('Enter');

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storieModifiedSortedByModified = storiesOrderById.map((id) =>
        getRelativeDisplayDate(stories[id].modified)
      );

      // Last Modified is the fifth column
      let rowModifiedValues = rows.map((row) => row.children[4].innerText);

      expect(rowModifiedValues).toEqual(storieModifiedSortedByModified);

      // sort ascending
      const lastModifiedHeader = fixture.screen.getByText(/^Last Modified/);

      await fixture.events.focus(lastModifiedHeader);
      await fixture.events.keyboard.press('Enter');

      rows = fixture.screen.getAllByRole('row').slice(1);

      rowModifiedValues = rows.map((row) => row.children[4].innerText);

      expect(rowModifiedValues).toEqual(
        storieModifiedSortedByModified.reverse()
      );
    });
  });

  describe('CUJ: Creator can view their stories in list view: Go to WP list view to do any action', () => {
    it('should add a link to the classic WordPress list view', async () => {
      const listViewButton = fixture.screen.getByLabelText(
        new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
      );

      await fixture.events.click(listViewButton);

      const wpListViewLink = fixture.screen.getByRole('link', {
        name: /^See classic WP list view$/,
      });

      expect(wpListViewLink).toBeTruthy();
    });
  });

  describe('CUJ: Creator can navigate list view using keyboard: Tab through each story in the list', () => {
    let storiesSortedByModified = [];

    beforeEach(async () => {
      const { stories, storiesOrderById } = await getStoriesState();
      storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

      const listViewButton = fixture.screen.getByLabelText(
        new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
      );

      // switch to list view
      await fixture.events.click(listViewButton);

      // place focus on last modified header
      const lastModifiedHeader = fixture.screen.getByText(/^Last Modified/);
      await fixture.events.focus(lastModifiedHeader);
    });

    it('should be able to tab to story title', async () => {
      // tabbing from Last Modified should get us to title
      await fixture.events.keyboard.press('Tab');

      const title = await document.activeElement.innerText;
      expect(title).toContain(storiesSortedByModified[0].title);
    });

    it('should be able to tab to story menu control', async () => {
      // drop the header row using slice
      const rows = fixture.screen.getAllByRole('row').slice(1);
      const { getByText } = within(rows[0]);

      // Rename shouldn't be found until menu is open
      expect(isElementVisible(getByText(/^Rename/))).toBeFalse();

      // tabbing from Last Modified should get us to title
      await fixture.events.keyboard.press('Tab');

      // tabbing from title should move to menu control
      await fixture.events.keyboard.press('Tab');

      // hitting enter should open menu
      await fixture.events.keyboard.press('Enter');

      // Rename should be findable
      expect(isElementVisible(getByText(/^Rename/))).toBeTrue();
    });

    it('should be able to tab to another story title', async () => {
      // tabbing from Last Modified should get us to title
      await fixture.events.keyboard.press('Tab');

      // tabbing from title should move to menu control
      await fixture.events.keyboard.press('Tab');

      // tabbing from menu control should move to next story title
      await fixture.events.keyboard.press('Tab');

      const title = await document.activeElement.innerText;
      expect(title).toContain(storiesSortedByModified[1].title);
    });
  });
});
