/*
 * Copyright 2021 Google LLC
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
import { getRelativeDisplayDate } from '@googleforcreators/date';

/**
 * Internal dependencies
 */
import Fixture from '../../../../karma/fixture';
import { VIEW_STYLE_LABELS, VIEW_STYLE } from '../../../../constants';
import useApi from '../../../api/useApi';

describe('CUJ: Creator can view their stories in list view: ', () => {
  let fixture;
  let listViewButton;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    listViewButton = fixture.screen.getByLabelText(
      new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.GRID]}$`)
    );
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

  function isElementVisible(element) {
    return Boolean(
      element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
    );
  }

  const clickListView = async () => {
    expect(listViewButton).toBeTruthy();

    await fixture.events.click(listViewButton);
  };

  const enterListView = async () => {
    expect(listViewButton).toBeTruthy();
    await fixture.events.focus(listViewButton);
    await fixture.events.keyboard.press('Enter');
  };

  describe('Creator can see stories in list view', () => {
    it('should switch to List View', async () => {
      await clickListView();

      const listViewTable = fixture.screen.getByTestId('story-list-view');

      await expectAsync(listViewTable).toHaveNoViolations();

      expect(listViewTable).toBeTruthy();

      await fixture.snapshot('List View');
    });

    it('should switch to List View and back to Grid View', async () => {
      await clickListView();

      const initialGridViewItems =
        fixture.screen.queryAllByTestId(/^story-grid-item/);
      expect(initialGridViewItems.length).toBe(0);

      const listViewTable = fixture.screen.getByTestId('story-list-view');

      expect(listViewTable).toBeTruthy();
      const gridViewButton = fixture.screen.getByLabelText(
        new RegExp(`^${VIEW_STYLE_LABELS[VIEW_STYLE.LIST]}$`)
      );

      await fixture.events.click(gridViewButton);

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);

      const { storiesOrderById } = await getStoriesState();

      expect(storyElements.length).toEqual(storiesOrderById.length);

      await fixture.snapshot('Grid View');
    });

    it('should Rename a story', async () => {
      const { stories, storiesOrderById } = await getStoriesState();

      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

      await clickListView();

      // drop the header row using slice
      const rows = fixture.screen.getAllByRole('row').slice(1);

      const utils = within(rows[0]);

      const titleCell = utils.getByRole('heading', {
        name: storiesSortedByModified[0].title,
      });

      await fixture.events.hover(titleCell);

      const moreOptionsButton = utils.getByRole('button', {
        name: /^Context menu for/,
      });

      await fixture.events.click(moreOptionsButton);

      const rename = utils.getByText(/^Rename/);

      await fixture.events.click(rename);

      const input = await utils.getByRole('textbox');

      const inputLength = input.value.length;

      for (let iter = 0; iter < inputLength; iter++) {
        // disable eslint to prevent overlapping .act calls
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('Backspace');
      }

      await fixture.events.keyboard.type('A New Title');

      await fixture.events.keyboard.press('Enter');

      await fixture.snapshot('Rename story');

      expect(utils.getByText(/^A New Title$/)).toBeTruthy();
    });

    it('should Duplicate a story', async () => {
      const { stories, storiesOrderById } = await getStoriesState();

      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

      const gridContainer = fixture.screen.getByTestId('dashboard-grid-list');

      await fixture.events.focus(gridContainer);

      await clickListView();

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      let utils = within(rows[0]);

      const titleCell = utils.getByRole('cell', {
        name: storiesSortedByModified[0].title,
      });

      await fixture.events.hover(titleCell);

      const moreOptionsButton = utils.getByRole('button', {
        name: /^Context menu for/,
      });

      await fixture.events.click(moreOptionsButton);

      const duplicate = utils.getByText(/^Duplicate/);

      await fixture.events.click(duplicate);

      await fixture.snapshot('Duplicate story');

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

      await clickListView();

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const utils = within(rows[0]);

      const titleCell = utils.getByRole('cell', {
        name: storiesSortedByModified[0].title,
      });

      await fixture.events.hover(titleCell);

      const moreOptionsButton = utils.getByRole('button', {
        name: /^Context menu for/,
      });

      await fixture.events.click(moreOptionsButton);

      const deleteButton = utils.getByText(/^Delete/);

      await fixture.events.click(deleteButton);

      const confirmDeleteButton = fixture.screen.getByRole('button', {
        name: /^Confirm deleting/,
      });

      await fixture.snapshot('Delete story');

      await fixture.events.click(confirmDeleteButton);

      // requery rows
      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesSortedByModified.length - 1);
    });

    it('should not Delete a story if Cancel is clicked in the confirmation modal', async () => {
      const { stories, storiesOrderById } = await getStoriesState();
      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

      await clickListView();

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const utils = within(rows[0]);

      const titleCell = utils.getByRole('cell', {
        name: storiesSortedByModified[0].title,
      });

      await fixture.events.hover(titleCell);

      const moreOptionsButton = utils.getByRole('button', {
        name: /^Context menu for/,
      });

      await fixture.events.click(moreOptionsButton);

      const deleteButton = utils.getByText(/^Delete/);

      await fixture.events.click(deleteButton);

      const cancel = fixture.screen.getByRole('button', {
        name: /^Cancel deleting story/,
      });

      await fixture.events.click(cancel);

      // requery rows
      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesSortedByModified.length);
    });
  });

  describe('Creator should be prevented from performing basic updates on locked stories from dashboard list view', () => {
    it('should not Rename a locked story', async () => {
      const { stories, storiesOrderById } = await getStoriesState();

      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

      await clickListView();

      // drop the header row using slice
      const rows = fixture.screen.getAllByRole('row').slice(1);

      const utils = within(rows[1]);

      const titleCell = utils.getByRole('heading', {
        name: new RegExp(`^${storiesSortedByModified[1].title}`),
      });

      await fixture.events.hover(titleCell);

      const moreOptionsButton = utils.getByRole('button', {
        name: /^Context menu for/,
      });

      await fixture.events.click(moreOptionsButton);

      const rename = utils.getByText(/^Rename/);
      expect(rename.hasAttribute('disabled')).toBe(true);
    });

    it('should not Delete a locked story', async () => {
      const { stories, storiesOrderById } = await getStoriesState();
      const storiesSortedByModified = storiesOrderById.map((id) => stories[id]);

      await clickListView();

      // drop the header row using slice
      const rows = fixture.screen.getAllByRole('row').slice(1);

      const utils = within(rows[1]);
      const titleCell = utils.getByRole('heading', {
        name: new RegExp(`^${storiesSortedByModified[1].title}`),
      });

      await fixture.events.hover(titleCell);

      const moreOptionsButton = utils.getByRole('button', {
        name: /^Context menu for/,
      });

      await fixture.events.click(moreOptionsButton);

      const deleteButton = utils.getByText(/^Delete/);
      expect(deleteButton.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Creator can sort their stories (last modified / date created / author / title)', () => {
    beforeEach(async () => {
      await enterListView();
    });

    it('should sort by Title in List View', async () => {
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
      const authorHeader = fixture.screen.getByText(/^Author/);

      await fixture.events.click(authorHeader);

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storiesAuthorsSortedByAuthor = storiesOrderById.map(
        (id) => stories[id].author.name
      );

      // author is the third column
      let rowAuthors = rows.map((row) => row.children[2].innerText);

      expect(rowAuthors).toEqual(storiesAuthorsSortedByAuthor);

      // sort by descending
      await fixture.events.click(authorHeader);

      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesOrderById.length);

      // author is the third column
      rowAuthors = rows.map((row) => row.children[2].innerText);

      expect(rowAuthors).toEqual(storiesAuthorsSortedByAuthor.reverse());
    });

    it('should sort by Date Created in List View', async () => {
      const dateCreatedHeader = fixture.screen.getByText(/^Date Created/);

      await fixture.events.click(dateCreatedHeader);

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storiesDateCreatedSortedByDateCreated = storiesOrderById.map((id) =>
        getRelativeDisplayDate(stories[id].createdGmt)
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
      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storieModifiedSortedByModified = storiesOrderById.map((id) =>
        getRelativeDisplayDate(stories[id].modifiedGmt)
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
      const authorHeader = fixture.screen.getByText(/^Author/);

      await fixture.events.focus(authorHeader);
      await fixture.events.keyboard.press('Enter');

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storiesAuthorsSortedByAuthor = storiesOrderById.map(
        (id) => stories[id].author.name
      );

      // author is the third column
      let rowAuthors = rows.map((row) => row.children[2].innerText);

      expect(rowAuthors).toEqual(storiesAuthorsSortedByAuthor);

      // sort by descending
      await fixture.events.keyboard.press('Enter');

      rows = fixture.screen.getAllByRole('row').slice(1);

      expect(rows.length).toEqual(storiesOrderById.length);

      // author is the third column
      rowAuthors = rows.map((row) => row.children[2].innerText);

      expect(rowAuthors).toEqual(storiesAuthorsSortedByAuthor.reverse());
    });

    it('should sort by Date Created in List View with keyboard', async () => {
      const dateCreatedHeader = fixture.screen.getByText(/^Date Created/);

      await fixture.events.focus(dateCreatedHeader);
      await fixture.events.keyboard.press('Enter');

      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storiesDateCreatedSortedByDateCreated = storiesOrderById.map((id) =>
        getRelativeDisplayDate(stories[id].createdGmt)
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

    it('should show default sort by Last Modified in List View with keyboard', async () => {
      // drop the header row using slice
      let rows = fixture.screen.getAllByRole('row').slice(1);

      const { stories, storiesOrderById } = await getStoriesState();

      expect(rows.length).toEqual(storiesOrderById.length);

      const storieModifiedSortedByModified = storiesOrderById.map((id) =>
        getRelativeDisplayDate(stories[id].modifiedGmt)
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

  describe('Creator can navigate list view using keyboard: Tab through each story in the list', () => {
    let storiesSortedByModified = [];

    beforeEach(async () => {
      const { stories, storiesOrderById } = await getStoriesState();
      storiesSortedByModified = storiesOrderById.map((id) => stories[id]);
      // switch to list view
      await clickListView();

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
