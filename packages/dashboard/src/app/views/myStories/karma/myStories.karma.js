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
import {
  STORY_STATUS,
  STORY_STATUSES,
  STORY_VIEWING_LABELS,
  STORY_SORT_MENU_ITEMS,
} from '../../../../constants';
import useApi from '../../../api/useApi';

describe('CUJ: Creator can view their stories in grid view', () => {
  let fixture;
  let dashboardGridItems = [];

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    dashboardGridItems = fixture.screen.getAllByTestId(/^story-grid-item/);
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

  async function focusOnGridByKeyboard() {
    let limit = 0;
    const gridContainer = fixture.screen.getByTestId('dashboard-grid-list');

    while (!gridContainer.contains(document.activeElement) && limit < 20) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('tab');
      limit++;
    }

    return gridContainer.contains(document.activeElement)
      ? Promise.resolve()
      : Promise.reject(new Error('could not focus on grid'));
  }

  async function getContextMenuItem(contextMenuText, storyIndex = 0) {
    const storyButtons = fixture.screen.getAllByTestId(/story-context-button-/);
    const selectedStory = storyButtons[storyIndex];
    await focusOnGridByKeyboard();

    for (let i = 0; i <= storyIndex; i++) {
      const expectedStory = storyButtons[i];
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('right');
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('tab');
      expect(expectedStory).toEqual(document.activeElement);
    }

    // we should have focused the indicated story in the grid
    expect(selectedStory).toEqual(document.activeElement);

    await fixture.events.keyboard.press('Enter');

    // now the focused item should be the first context menu item
    const contextMenuLists = fixture.screen.getAllByTestId(/context-menu-list/);
    const contextMenuList = contextMenuLists[storyIndex];

    // it is focused on the link within the list
    const contextMenuItem = within(contextMenuList).getByRole('menuitem', {
      name: contextMenuText,
    });

    let limit = 0;
    while (
      document.activeElement.textContent !== contextMenuText &&
      limit < 8
    ) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('down');
      limit++;
    }

    expect(contextMenuItem).toEqual(document.activeElement);
    return contextMenuItem;
  }

  describe('Creator should see dashboard and be able to navigate', () => {
    it('should render without aXe violations', async () => {
      const { storiesOrderById } = await getStoriesState();

      expect(dashboardGridItems.length).toEqual(storiesOrderById.length);
    });

    it('should navigate to Explore Templates', async () => {
      const exploreTemplatesMenuItem = fixture.screen.queryByRole('link', {
        name: /^Explore Templates/,
      });
      expect(exploreTemplatesMenuItem).toBeTruthy();

      await fixture.events.click(exploreTemplatesMenuItem);
      const templatesGridEl = await fixture.screen.findByText(
        'Viewing all templates'
      );
      expect(templatesGridEl).toBeTruthy();
    });
  });

  describe('Creator should be prevented from performing basic updates on locked stories from dashboard', () => {
    let utils;
    let moreOptionsButton;

    beforeEach(async () => {
      const lockedStory = dashboardGridItems[1];
      await fixture.events.hover(lockedStory);

      utils = within(lockedStory);
      moreOptionsButton = utils.getByRole('button', {
        name: /^Context menu for/,
      });

      await fixture.events.click(moreOptionsButton);
    });

    it('should not Rename a locked story', () => {
      const rename = utils.getByText(/^Rename/);
      expect(rename.hasAttribute('disabled')).toBe(true);
    });

    it('should not delete a locked story', () => {
      const deleteStory = utils.getByText(/^Delete/);
      expect(deleteStory.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Creator should be able to perform basic updates to stories from dashboard', () => {
    let utils;
    let moreOptionsButton;

    beforeEach(async () => {
      const firstStory = dashboardGridItems[0];
      await fixture.events.hover(firstStory);

      utils = within(firstStory);
      moreOptionsButton = utils.getByRole('button', {
        name: /^Context menu for/,
      });

      await fixture.events.click(moreOptionsButton);
    });

    it('should Rename a story', async () => {
      const rename = utils.getByText(/^Rename/);
      await fixture.events.click(rename);

      const input = fixture.screen.getByRole('textbox');
      const inputLength = input.value.length;

      for (let iter = 0; iter < inputLength; iter++) {
        // disable eslint to prevent overlapping .act calls
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('Backspace');
      }

      await fixture.events.keyboard.type('A New Title');

      await fixture.events.keyboard.press('Enter');

      expect(
        utils.getByRole('heading', { level: 3, name: 'A New Title' })
      ).toBeTruthy();
    });

    it('should Duplicate a story', async () => {
      const duplicate = utils.getByText(/^Duplicate/);
      await fixture.events.click(duplicate);

      const updatedStories = fixture.screen.getAllByTestId(/^story-grid-item/);
      const copiedStory = within(updatedStories[0]).getByRole('heading', {
        level: 3,
      });
      expect(copiedStory.innerText).toContain('(Copy)');
    });

    it('should Delete a story', async () => {
      const deleteStory = utils.getByText(/^Delete/);
      await fixture.events.click(deleteStory);

      const confirmDeleteButton = fixture.screen.getByRole('button', {
        name: /^Confirm deleting story/,
      });

      await fixture.events.click(confirmDeleteButton);

      expect(fixture.screen.getAllByTestId(/^story-grid-item/).length).toEqual(
        dashboardGridItems.length - 1
      );
    });

    it('should not Delete a story if Cancel is clicked in the confirmation modal', async () => {
      const deleteStory = utils.getByText(/^Delete/);
      await fixture.events.click(deleteStory);

      const cancel = fixture.screen.getByRole('button', {
        name: /^Cancel deleting story/,
      });

      await fixture.events.click(cancel);

      expect(fixture.screen.getAllByTestId(/^story-grid-item/).length).toEqual(
        dashboardGridItems.length
      );
    });
  });

  describe('Creator can filter their stories by status', () => {
    it('should switch to the Drafts Tab', async () => {
      const { stories } = await getStoriesState();
      const numDrafts = Object.values(stories).filter(
        ({ status }) => status === STORY_STATUS.DRAFT
      ).length;

      expect(numDrafts).toBeGreaterThan(0);

      const draftsTabButton = fixture.screen.getByRole('button', {
        name: new RegExp('^Filter stories by ' + STORY_STATUSES[1].label),
      });

      await fixture.events.click(draftsTabButton);

      const viewDraftsText = fixture.screen.getByText(
        (_, node) =>
          node.innerHTML === STORY_VIEWING_LABELS[STORY_STATUS.DRAFT](numDrafts)
      );

      expect(viewDraftsText).toBeTruthy();

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);
      expect(storyElements.length).toEqual(numDrafts);
    });

    it('should switch to the Published Tab', async () => {
      const { stories } = await getStoriesState();
      const numPublished = Object.values(stories).filter(
        ({ status }) => status === STORY_STATUS.PUBLISH
      ).length;

      expect(numPublished).toBeGreaterThan(0);

      const publishedTabButton = fixture.screen.getByRole('button', {
        name: new RegExp('^Filter stories by ' + STORY_STATUSES[3].label),
      });

      expect(publishedTabButton).toBeTruthy();

      await fixture.events.click(publishedTabButton);

      const viewPublishedText = fixture.screen.getByText(
        (_, node) =>
          node.innerHTML ===
          STORY_VIEWING_LABELS[STORY_STATUS.PUBLISH](numPublished)
      );
      expect(viewPublishedText).toBeTruthy();

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);
      expect(storyElements.length).toEqual(numPublished);
    });
  });

  describe('Creator can search dashboard stories by story names', () => {
    it('should filter stories using the search input', async () => {
      const { stories } = await getStoriesState();

      const firstStoryTitle = Object.values(stories)[0].title;

      const searchInput = fixture.screen.getByPlaceholderText('Search Stories');

      expect(searchInput).toBeTruthy();

      await fixture.events.focus(searchInput);

      await fixture.events.keyboard.type(firstStoryTitle);

      // Wait for the debounce
      await fixture.events.sleep(500);

      const storyElements = await fixture.screen.findAllByTestId(
        /^story-context-menu-/
      );

      expect(storyElements.length).toEqual(
        Object.values(stories).filter(({ title }) =>
          title.includes(firstStoryTitle)
        ).length
      );
    });

    it('should look at options in search menu and select one with keyboard', async () => {
      const { stories } = await getStoriesState();

      const firstStoryTitle = Object.values(stories)[0].title;

      const searchInput = fixture.screen.getByPlaceholderText('Search Stories');

      expect(searchInput).toBeTruthy();

      await fixture.events.focus(searchInput);

      await fixture.events.keyboard.type(firstStoryTitle.substring(0, 1)); // get first to characters of title so that other options come up too

      // Wait for the debounce
      await fixture.events.sleep(300);

      const searchOptions = fixture.screen.getByRole('listbox');
      expect(searchOptions).toBeTruthy();

      const activeListItems = within(searchOptions).queryAllByRole('option');

      await fixture.events.keyboard.press('down');

      expect(activeListItems[0]).toEqual(document.activeElement);

      // focus should move to the search input when keydown on 'up' from first list item
      await fixture.events.keyboard.press('up');

      expect(searchInput).toEqual(document.activeElement);
      await fixture.events.sleep(300);
      // key down to the bottom of the available search options
      // plus once more beyond available search options to make sure focus stays intact
      for (let iter = 0; iter < activeListItems.length + 1; iter++) {
        // disable eslint to prevet overlapping .act calls
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('down');
      }
      await fixture.events.sleep(300);
      expect(activeListItems[activeListItems.length - 1]).toBe(
        document.activeElement
      );

      await fixture.events.keyboard.press('Enter');

      const selectedStoryTitle =
        Object.values(stories)[activeListItems.length - 1].title;

      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);

      expect(storyElements.length).toEqual(
        Object.values(stories).filter(({ title }) =>
          title.includes(selectedStoryTitle)
        ).length
      );
    });
  });

  describe('Creator can sort their stories', () => {
    let sortDropdown;
    beforeEach(() => {
      sortDropdown = fixture.screen.getByLabelText(
        'Choose sort option for display'
      );
    });

    const getRenderedStoriesById = () => {
      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);
      const renderedStoriesById = storyElements.map(({ dataset }) =>
        Number(dataset['testid'].split('-').slice(-1)[0])
      );
      return renderedStoriesById;
    };

    const getStoriesOrderById = () => getStoriesState();

    it('should sort by Date Created', async () => {
      expect(sortDropdown).toBeTruthy();

      await fixture.events.click(sortDropdown);

      const dateCreated = fixture.screen.getByText(
        new RegExp(`^${STORY_SORT_MENU_ITEMS[1].label}$`)
      );

      expect(dateCreated).toBeTruthy();

      await fixture.events.click(dateCreated);

      const renderedStoriesById = getRenderedStoriesById();
      const { storiesOrderById } = await getStoriesOrderById();

      expect(renderedStoriesById).toEqual(storiesOrderById);
    });

    it('should sort by Last Modified by default', async () => {
      const { storiesOrderById } = await getStoriesOrderById();
      const renderedStoriesById = getRenderedStoriesById();

      expect(renderedStoriesById).toEqual(storiesOrderById);
    });

    it('should sort by Name', async () => {
      expect(sortDropdown).toBeTruthy();

      await fixture.events.click(sortDropdown);

      const name = fixture.screen.getByText(
        new RegExp(`^${STORY_SORT_MENU_ITEMS[0].label}$`)
      );

      expect(name).toBeTruthy();

      await fixture.events.click(name);

      const renderedStoriesById = getRenderedStoriesById();
      const { storiesOrderById } = await getStoriesOrderById();
      expect(renderedStoriesById).toEqual(storiesOrderById);
    });

    it('should sort by Created By', async () => {
      expect(sortDropdown).toBeTruthy();

      await fixture.events.click(sortDropdown);

      const createdBy = fixture.screen.getByText(
        new RegExp(`^${STORY_SORT_MENU_ITEMS[3].label}$`)
      );

      expect(createdBy).toBeTruthy();

      await fixture.events.click(createdBy);

      const renderedStoriesById = getRenderedStoriesById();
      const { storiesOrderById } = await getStoriesOrderById();
      expect(renderedStoriesById).toEqual(storiesOrderById);
    });

    it('should filter by author', async () => {
      const originalStoryAuthorsNames = fixture.screen
        .getAllByTestId(/^story-grid-item/)
        .map((storyThumb) => storyThumb.innerText);

      // click the author toggle
      const authorDropdown = fixture.screen.getByLabelText(
        'Filter stories by author'
      );
      expect(authorDropdown).toBeTruthy();
      await fixture.events.click(authorDropdown);

      // find all author filters
      const authorSelect = await fixture.screen.findByLabelText(
        new RegExp(`^Option List Selector$`)
      );
      expect(authorSelect).toBeTruthy();

      // click the first author
      const firstAuthor = within(authorSelect).getAllByRole('option')?.[0];
      expect(firstAuthor).toBeTruthy();
      const firstAuthorName = firstAuthor.innerText;
      await fixture.events.click(firstAuthor);

      // Check that not all the stories were from the first author originally
      expect(
        originalStoryAuthorsNames.some((name) => name !== firstAuthorName)
      ).toBeTruthy();

      // see that all rendered stories are by the clicked author
      const storyElements = fixture.screen.getAllByTestId(/^story-grid-item/);
      for (const storyThumb of storyElements) {
        const authorEl = within(storyThumb).getByText(firstAuthorName);
        expect(authorEl).toBeDefined();
      }
    });

    it('should filter by category', async () => {
      const { stories } = await getStoriesState();
      let renderedStoriesById = getRenderedStoriesById();
      // click the category dropdown
      const categoryDropdown =
        fixture.screen.getByLabelText('Filter by category');
      expect(categoryDropdown).toBeTruthy();
      await fixture.events.click(categoryDropdown);

      // find all category filters
      const categorySelect = await fixture.screen.findByLabelText(
        new RegExp(`^Option List Selector$`)
      );
      expect(categorySelect).toBeTruthy();

      // click the first category
      const firstCategory = within(categorySelect).getAllByRole('option')?.[0];
      expect(firstCategory).toBeTruthy();
      const firstCategoryName = firstCategory.innerText;
      await fixture.events.click(firstCategory);

      // Check that not all the stories have the first category originally
      const found = renderedStoriesById.map(
        (id) => !stories[id].categories.includes(firstCategoryName)
      );
      expect(found.length).toBeGreaterThan(0);

      // see that all rendered stories have the selected category
      renderedStoriesById = getRenderedStoriesById();
      renderedStoriesById.every((id) =>
        stories[id].categories.includes(firstCategoryName)
      );
    });
  });

  describe('Creator can navigate and use the Dashboard via keyboard', () => {
    let storyCards = [];

    beforeEach(async () => {
      storyCards = fixture.screen.getAllByTestId(/story-context-button-/);
      await focusOnGridByKeyboard();
    });

    it('should navigate the grid via keyboard', async () => {
      for (let i = 0; i < storyCards.length; i++) {
        const expectedStory = storyCards[i];
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('right');
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('tab');
        expect(expectedStory).toEqual(document.activeElement);
      }
    });

    it('should focus on context menu items via keyboard', async () => {
      const [selectedStory] = storyCards;
      await fixture.events.keyboard.press('right');
      await fixture.events.keyboard.press('tab');
      // we should have focused the first story menu in the grid
      expect(selectedStory).toEqual(document.activeElement);

      const [activeStoryContextMenu] =
        fixture.screen.getAllByTestId(/^story-context-menu-/);

      await fixture.events.keyboard.press('Enter');

      // now the focused item should be the first context menu item
      const [contextMenuList] = within(activeStoryContextMenu).getAllByTestId(
        /context-menu-list/
      );
      await expectAsync(contextMenuList).toHaveNoViolations();
      // it is focused on the link within the list
      const [firstContextMenuItem, secondContextMenuItem] =
        within(contextMenuList).getAllByRole('menuitem');

      expect(firstContextMenuItem.innerText).toEqual(
        document.activeElement.innerText
      );

      await fixture.events.keyboard.press('down');

      expect(secondContextMenuItem.innerText).toEqual(
        document.activeElement.innerText
      );
    });

    it('should rename a story via keyboard', async () => {
      await getContextMenuItem('Rename');
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.press('Backspace');
      await fixture.events.keyboard.type('A New Title');
      await fixture.events.keyboard.press('Enter');
      const firstStory = dashboardGridItems[0];
      const { getByRole } = within(firstStory);
      expect(
        getByRole('heading', { level: 3, name: 'A New Title' })
      ).toBeTruthy();
    });

    it('should delete a story via keyboard', async () => {
      let stories = fixture.screen.getAllByTestId(/^story-context-menu-/);
      // count the original number of stories
      const initialNumStories = stories.length;

      // focus the delete context menu item of the first story with the keyboard
      await getContextMenuItem('Delete Story');

      // delete the story and confirm deletion
      await fixture.events.keyboard.press('Enter');
      const confirmDeleteButton = fixture.screen.getByRole('button', {
        name: /^Confirm deleting story/,
      });
      let limit = 0;
      while (
        !confirmDeleteButton.contains(document.activeElement) &&
        limit < 3
      ) {
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('tab');
        limit++;
      }

      // confirm deletion
      await fixture.events.keyboard.press('Enter');

      // count the new number of stories
      stories = fixture.screen.getAllByTestId(/^story-context-menu-/);
      expect(stories.length).toEqual(initialNumStories - 1);
    });

    it('should duplicate a story via keyboard', async () => {
      // count the initial number of stories
      const initialNumStories = dashboardGridItems.length;

      //focus the duplicate item of the context menu of the first story
      await getContextMenuItem('Duplicate');

      expect(document.activeElement.innerText).toEqual('Duplicate');
      // confirm duplication
      await fixture.events.keyboard.press('Enter');

      // count the new number of stories
      const updatedStories = fixture.screen.getAllByTestId(/^story-grid-item/);
      expect(updatedStories.length).toEqual(initialNumStories + 1);

      // the copied story is now the first story and contains (Copy)
      const firstStory = updatedStories[0];
      const utils = within(firstStory);

      const copiedStory = utils.getByRole('heading', { level: 3 });
      expect(copiedStory.innerText).toContain('(Copy)');
    });

    it('should retain focus on menu close', async () => {
      const allItemGridLinks = fixture.screen.getAllByTestId(
        /story-editor-grid-link/
      );

      const storyIndex = 0;
      const selectedStory = allItemGridLinks[storyIndex];
      // focus the delete context menu item of the first story with the keyboard
      // test cancelling deletion of the second story (not the default first story)
      // to make sure focus is retained
      await getContextMenuItem('Delete Story', storyIndex);

      // delete the story and confirm deletion
      await fixture.events.keyboard.press('Enter');
      const cancelDeleteButton = fixture.screen.getByRole('button', {
        name: /^Cancel/,
      });
      let limit = 0;
      while (
        !cancelDeleteButton.contains(document.activeElement) &&
        limit < 3
      ) {
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('tab');
        limit++;
      }

      // confirm deletion
      await fixture.events.keyboard.press('Enter');

      // focus should return to the second story
      expect(selectedStory).toEqual(document.activeElement);
    });

    it('should exit the grid and re-focus the first item', async () => {
      const allItemGridLinks = fixture.screen.getAllByTestId(
        /story-editor-grid-link/
      );

      const firstStory = allItemGridLinks[0];
      const lastStory = allItemGridLinks[allItemGridLinks.length - 1];

      for (let i = 0; i < allItemGridLinks.length; i++) {
        const expectedStory = allItemGridLinks[i];
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('right');
        expect(expectedStory).toEqual(document.activeElement);
      }
      expect(lastStory).toEqual(document.activeElement);

      const searchInput = fixture.screen.getByPlaceholderText('Search Stories');
      expect(searchInput).toBeTruthy();
      await fixture.events.focus(searchInput);

      await focusOnGridByKeyboard();
      await fixture.events.keyboard.press('right');
      expect(firstStory).toEqual(document.activeElement);
    });
  });
});
