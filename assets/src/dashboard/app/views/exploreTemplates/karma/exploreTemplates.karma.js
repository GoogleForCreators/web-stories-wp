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

  async function focusOnFirstTemplate() {
    const { templatesOrderById } = await getTemplatesState();
    const firstTemplate = getTemplateElementById(templatesOrderById[0]);
    const seenElements = new Set([document.activeElement]);
    let found = firstTemplate.contains(document.activeElement);

    while (!firstTemplate.contains(document.activeElement) && !found) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('tab');

      found = firstTemplate.contains(document.activeElement);

      if (found || seenElements.has(document.activeElement)) {
        break;
      }
      seenElements.add(document.activeElement);
    }

    if (!found) {
      throw new Error('could not focus on first element');
    }
  }

  async function focusOnTemplateById(id) {
    const { templatesOrderById } = await getTemplatesState();
    const index = templatesOrderById.indexOf(id);
    const firstTemplate = getTemplateElementById(templatesOrderById[0]);

    if (index === -1) {
      throw new Error('template not found with id of: ' + id);
    }

    if (!firstTemplate.contains(document.activeElement)) {
      await focusOnFirstTemplate();
    }

    if (index === 0) {
      return;
    }

    await fixture.events.keyboard.seq(({ press }) =>
      Array.from(new Array(index), () => [
        press('tab'),
        press('tab'),
        press('tab'),
      ]).reduce((acc, curr) => acc.concat(curr), [])
    );
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

      const useTemplate = utils.getByRole('button', { name: /^Use template$/ });

      expect(useTemplate).toBeTruthy();
    });

    it('should change focus as the user presses tab', async () => {
      const { templatesOrderById } = await getTemplatesState();
      const firstTemplate = getTemplateElementById(templatesOrderById[0]);

      // focus on first template
      await focusOnFirstTemplate();
      expect(firstTemplate.contains(document.activeElement)).toBeTrue();

      // focus on last template
      const lastTemplateId = templatesOrderById[templatesOrderById.length - 1];
      const lastTemplate = await getTemplateElementById(lastTemplateId);
      await focusOnTemplateById(lastTemplateId);
      expect(lastTemplate.contains(document.activeElement)).toBeTrue();
    });
  });

  describe('Action: See template preview from explore templates', () => {
    beforeEach(async () => {
      fixture.setFlags({ enableTemplatePreviews: true });

      await fixture.render();
    });

    it('should trigger template preview when user clicks a card', async () => {
      const { templatesOrderById } = await getTemplatesState();

      const currentCard = await getTemplateElementById(templatesOrderById[1]);
      const utils = within(currentCard);

      const activeCard = utils.getByTestId('card-action-container');
      expect(activeCard).toBeTruthy();

      const { x, y } = activeCard.getBoundingClientRect();

      // We need to click slightly above the center of the card to avoid clicking 'View'
      await fixture.events.mouse.click(x - 20, y);

      const viewPreviewStory = await fixture.screen.queryByTestId(
        'preview-iframe'
      );

      expect(viewPreviewStory).toBeTruthy();
    });

    it('should trigger template preview when user presses Enter while focused on a card', async () => {
      const { templatesOrderById } = await getTemplatesState();

      const currentCard = await getTemplateElementById(templatesOrderById[1]);
      const utils = within(currentCard);
      const activeCard = utils.getByTestId('card-action-container');
      expect(activeCard).toBeTruthy();

      await fixture.events.focus(activeCard);
      await fixture.events.keyboard.press('Enter');

      const viewPreviewStory = await fixture.screen.queryByTestId(
        'preview-iframe'
      );

      expect(viewPreviewStory).toBeTruthy();
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

      const closeBtn = fixture.screen.getByRole('link', { name: /^Close$/ });

      expect(closeBtn).toBeTruthy();
    });
  });
});
