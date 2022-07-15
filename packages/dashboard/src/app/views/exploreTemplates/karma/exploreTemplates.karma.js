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
import { TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS } from '../../../../constants';
import useApi from '../../../api/useApi';

describe('Grid view', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    await navigateToExploreTemplates();
  });

  afterEach(() => {
    fixture.restore();
  });

  function navigateToExploreTemplates() {
    const navigation = fixture.screen.queryByRole('navigation');
    const utils = within(navigation);

    const exploreTemplatesMenuItem = utils.getByText(/^Explore Templates/);

    return fixture.events.click(exploreTemplatesMenuItem);
  }

  function getTemplateElementById(id) {
    const template = fixture.screen.getByTestId(`template-grid-item-${id}`);

    return template;
  }

  async function getTemplatesState() {
    const {
      state: { templates },
    } = await fixture.renderHook(() => useApi());
    return templates;
  }

  async function focusOnGridByKeyboard() {
    let limit = 0;
    const gridContainer = fixture.screen.getByTestId('dashboard-grid-list');

    while (!gridContainer.contains(document.activeElement) && limit < 8) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('tab');
      limit++;
    }

    return gridContainer.contains(document.activeElement)
      ? Promise.resolve()
      : Promise.reject(new Error('could not focus on grid'));
  }

  it('should pass accessibility tests', async () => {
    const viewTemplates = fixture.screen.queryByText('Viewing all templates');
    expect(viewTemplates).toBeTruthy();
    await expectAsync(viewTemplates).toHaveNoViolations();
  });

  it('should navigate to Dashboard', async () => {
    const DashboardMenuItem = fixture.screen.queryByRole('link', {
      name: /^Dashboard$/,
    });

    await fixture.events.click(DashboardMenuItem);

    const viewStories = fixture.screen.queryByText('Viewing all stories');

    expect(viewStories).toBeTruthy();
  });

  describe('CUJ: Creator can browse templates in grid view: Browse all templates', () => {
    it('should display "See Details" and "Use Template" controls when hovering over a template', async () => {
      const { templatesOrderById } = await getTemplatesState();
      const firstTemplate = getTemplateElementById(templatesOrderById[0]);

      const utils = within(firstTemplate);

      await fixture.events.hover(firstTemplate);

      const seeDetailsButton = utils.getByText(
        new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
      );

      expect(seeDetailsButton).toBeTruthy();

      const useTemplate = utils.getByText(/^Use template$/);

      expect(useTemplate).toBeTruthy();
    });

    it('should change focus as the user presses tab', async () => {
      const { templatesOrderById } = await getTemplatesState();
      // focus on first template
      await focusOnGridByKeyboard();

      await fixture.events.keyboard.press('right');

      const firstTemplate = getTemplateElementById(templatesOrderById[0]);
      expect(firstTemplate.contains(document.activeElement)).toBeTrue();

      await fixture.events.keyboard.press('right');

      const secondTemplate = getTemplateElementById(templatesOrderById[1]);
      expect(secondTemplate.contains(document.activeElement)).toBeTrue();

      await fixture.events.keyboard.press('right');

      await fixture.events.keyboard.press('right');

      const fourthTemplate = getTemplateElementById(templatesOrderById[3]);
      expect(fourthTemplate.contains(document.activeElement)).toBeTrue();

      await fixture.events.keyboard.press('left');

      const thirdTemplate = getTemplateElementById(templatesOrderById[2]);
      expect(thirdTemplate.contains(document.activeElement)).toBeTrue();
    });
  });

  describe('CUJ: Creator can browse templates in grid view: See template details modal', () => {
    it('should open modal to view individual template details', async () => {
      const { templatesOrderById } = await getTemplatesState();
      const firstTemplate = getTemplateElementById(templatesOrderById[0]);

      const utils = within(firstTemplate);

      await fixture.events.hover(firstTemplate);

      const seeDetailsButton = utils.getByText(
        new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
      );

      await fixture.events.click(seeDetailsButton);

      const closeBtn = fixture.screen.getByRole('button', {
        name: /^Close$/,
      });

      expect(closeBtn).toBeTruthy();
    });
  });

  describe('Creator can search explore templates by meta data', () => {
    async function getTemplateIdByTitle(title) {
      const { templates } = await getTemplatesState();
      return Object.values(templates).find(
        (template) => template.title === title
      )?.id;
    }

    it('should filter templates using the search input', async () => {
      // Get original 8 templates
      const originalTemplates =
        fixture.screen.getAllByTestId(/^template-grid-item-/);
      expect(originalTemplates.length).toBe(8);

      // Get the template Search component
      const searchInput =
        fixture.screen.getByPlaceholderText('Search Templates');
      expect(searchInput).toBeTruthy();

      // Template Data formatted to have meta data:
      // {
      //   [metaDataType]: `Test ${metaDataType}`
      //   title: `Filterable By ${metaDataType}`
      //   ...
      // }

      // Filter by Tag
      await fixture.events.focus(searchInput);
      await fixture.events.keyboard.type('Test Tag');
      // Wait for the debounce
      await fixture.events.sleep(500);
      // See that grid updates
      const testTagGridItems =
        fixture.screen.getAllByTestId(/^template-grid-item-/);
      expect(testTagGridItems.length).toBe(1);
      // See that we have the right grid item
      const filterableTagTemplateId = await getTemplateIdByTitle(
        'Filterable By Tag'
      );
      const filterableTagTemplate = fixture.screen.getByTestId(
        new RegExp(`^template-grid-item-${filterableTagTemplateId}$`)
      );
      expect(filterableTagTemplate).toBeDefined();

      // Clear input
      const clearInput = fixture.screen.getByLabelText('Clear Search');
      await fixture.events.click(clearInput);

      // Filter by Color
      await fixture.events.focus(searchInput);
      await fixture.events.keyboard.type('Test Color');
      // Wait for the debounce
      await fixture.events.sleep(500);
      // See that grid updates
      const testColorGridItems =
        fixture.screen.getAllByTestId(/^template-grid-item-/);
      expect(testColorGridItems.length).toBe(1);
      // See that we have the right grid item
      const filterableColorTemplateId = await getTemplateIdByTitle(
        'Filterable By Color'
      );
      const filterableColorTemplate = fixture.screen.getByTestId(
        new RegExp(`^template-grid-item-${filterableColorTemplateId}$`)
      );
      expect(filterableColorTemplate).toBeDefined();

      // Clear input
      await fixture.events.click(clearInput);

      // Filter by Vertical
      await fixture.events.focus(searchInput);
      await fixture.events.keyboard.type('Test Vertical');
      // Wait for the debounce
      await fixture.events.sleep(500);
      // See that grid updates
      const testVerticalGridItems =
        fixture.screen.getAllByTestId(/^template-grid-item-/);
      expect(testVerticalGridItems.length).toBe(1);
      // See that we have the right grid item
      const filterableVerticalTemplateId = await getTemplateIdByTitle(
        'Filterable By Vertical'
      );
      const filterableVerticalTemplate = fixture.screen.getByTestId(
        new RegExp(`^template-grid-item-${filterableVerticalTemplateId}$`)
      );
      expect(filterableVerticalTemplate).toBeDefined();
    });
  });
});
