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
    const exploreTemplatesMenuItem = fixture.screen.queryByRole('link', {
      name: /^Explore Templates$/,
    });

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

  it('should render', () => {
    const viewTemplates = fixture.screen.queryByText('Viewing all templates');

    expect(viewTemplates).toBeTruthy();
  });

  it('should navigate to My Stories', async () => {
    const myStoriesMenuItem = fixture.screen.queryByRole('link', {
      name: /^My Stories$/,
    });

    await fixture.events.click(myStoriesMenuItem);

    const viewStories = fixture.screen.queryByText('Viewing all stories');

    expect(viewStories).toBeTruthy();
  });

  describe('CUJ: Creator can browse templates in grid view: Browse all templates', () => {
    it('should display "View" and "Use Template" controls when hovering over a template', async () => {
      const { templatesOrderById } = await getTemplatesState();
      const firstTemplate = getTemplateElementById(templatesOrderById[0]);

      const utils = within(firstTemplate);

      await fixture.events.hover(firstTemplate);

      const view = utils.getByText(
        new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
      );

      expect(view).toBeTruthy();

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

  describe('CUJ: Creator can browse templates in grid view: See pre-built template details page', () => {
    it('should navigate to view an individual template', async () => {
      const { templatesOrderById } = await getTemplatesState();
      const firstTemplate = getTemplateElementById(templatesOrderById[0]);

      const utils = within(firstTemplate);

      await fixture.events.hover(firstTemplate);

      const view = utils.getByText(
        new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
      );

      await fixture.events.click(view);

      const closeBtn = fixture.screen.getByRole('link', {
        name: /^Go to Explore Templates$/,
      });

      expect(closeBtn).toBeTruthy();
    });
  });
});
