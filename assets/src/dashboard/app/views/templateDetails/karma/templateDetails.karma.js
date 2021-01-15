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
import qs from 'query-string';

/**
 * Internal dependencies
 */
import Fixture from '../../../../karma/fixture';
import {
  TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS,
  TEMPLATES_GALLERY_VIEWING_LABELS,
  TEMPLATES_GALLERY_STATUS,
} from '../../../../constants';
import useApi from '../../../api/useApi';

describe('CUJ: Creator can browse templates in grid view: See pre-built template details page', () => {
  let fixture;
  const enableTemplatePreviews = false;

  beforeEach(async () => {
    fixture = new Fixture();

    fixture.setFlags({ enableTemplatePreviews });

    await fixture.render();

    await navigateToFirstTemplate();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function navigateToFirstTemplate() {
    const exploreTemplatesMenuItem = fixture.screen.queryByRole('link', {
      name: /^Explore Templates$/,
    });

    await fixture.events.click(exploreTemplatesMenuItem);

    const { templatesOrderById } = await getTemplatesState();

    const firstTemplate = getTemplateElementById(templatesOrderById[0]);

    const utils = within(firstTemplate);

    await fixture.events.hover(firstTemplate);

    const view = utils.getByText(
      new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
    );

    await fixture.events.click(view);
  }

  function getTemplateElementById(id) {
    const template = fixture.screen.getByTestId(`template-grid-item-${id}`);

    return template;
  }

  async function focusOnCardGallery() {
    let limit = 0;
    const cardGallery = fixture.screen.getByTestId('mini-cards-container');

    while (!cardGallery.contains(document.activeElement) && limit < 5) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.keyboard.press('tab');
      limit++;
    }

    return cardGallery.contains(document.activeElement)
      ? Promise.resolve()
      : Promise.reject(new Error('could not focus on page list'));
  }

  async function getTemplatesState() {
    const {
      state: { templates },
    } = await fixture.renderHook(() => useApi());
    return templates;
  }

  function getQueryParams() {
    return qs.parse(
      qs.extract(
        qs.parseUrl(window.location.href, { parseFragmentIdentifier: true })
          .fragmentIdentifier ?? ''
      )
    );
  }

  describe('Action: See pre-built template details page', () => {
    it('should navigate to "Explore Templates" when "Go to Explore Templates" is clicked', async () => {
      const closeLink = fixture.screen.getByRole('link', {
        name: /^Go to Explore Templates$/,
      });

      await fixture.events.click(closeLink);

      const viewTemplates = fixture.screen.queryByText(
        TEMPLATES_GALLERY_VIEWING_LABELS[TEMPLATES_GALLERY_STATUS.ALL]
      );

      expect(viewTemplates).toBeTruthy();
    });

    it('should update the "Active Preview Page" when clicking on a "Thumbnail Preview Page"', async () => {
      const firstPage = fixture.screen.getByRole('button', { name: /Page 1/ });

      expect(firstPage).toBeTruthy();

      const activePage = fixture.screen.getByLabelText(
        'Active Page Preview - Page 1'
      );

      expect(activePage).toBeTruthy();

      const secondPage = fixture.screen.getByRole('button', { name: /Page 2/ });

      expect(secondPage).toBeTruthy();

      await fixture.events.click(secondPage);

      fixture.screen.getByLabelText('Active Page Preview - Page 2');

      expect(activePage).toBeTruthy();
    });

    it('should update the "Active Preview Page" when using keyboard to navigate gallery', async () => {
      await focusOnCardGallery();
      const page1 = fixture.screen.getByRole('button', { name: /Page 1/ });
      expect(page1).toEqual(document.activeElement);

      // go right by 1
      await fixture.events.keyboard.press('right');
      const page2 = fixture.screen.getByRole('button', { name: /Page 2/ });
      expect(page2).toEqual(document.activeElement);

      // go left 1
      await fixture.events.keyboard.press('left');
      expect(page1).toEqual(document.activeElement);

      // go left 1 (focus should remain on page 1)
      await fixture.events.keyboard.press('left');
      expect(page1).toEqual(document.activeElement);

      const page4 = fixture.screen.getByRole('button', { name: /Page 4/ });
      await fixture.events.keyboard.seq(({ press }) => [
        press('right'),
        press('right'),
        press('right'),
      ]);
      expect(page4).toEqual(document.activeElement);

      await fixture.events.keyboard.press('right');
      await fixture.events.keyboard.press('Enter');

      const activePreviewPage = fixture.screen.getByLabelText(
        'Active Page Preview - Page 5'
      );

      expect(activePreviewPage).toBeTruthy();
    });

    it('should load the next related template when clicking "View Next Template" button', async () => {
      const { templates } = await getTemplatesState();
      // Parse the current template id from the id query param
      const { id: initialTemplateId } = getQueryParams();
      expect(initialTemplateId).toBeTruthy();

      const initialTemplate = templates[initialTemplateId];

      const templateDetailsSection = fixture.screen.getByRole('region', {
        name: /Template Details/,
      });

      const utils = within(templateDetailsSection);

      // Assert that the rendered title matches the title from state
      const initialTemplateTitle = utils.getByRole('heading', {
        name: /Template Title/,
      });
      expect(initialTemplateTitle.innerText).toEqual(initialTemplate.title);

      // Click the view next button to cycle to the next related template
      const viewNextBtn = fixture.screen.getByRole('button', {
        name: /View next template/,
      });
      await fixture.events.click(viewNextBtn);

      // Reparse the current template id from the id query param and assert it's different
      const { id: nextTemplateId } = getQueryParams();
      expect(nextTemplateId).toBeTruthy();
      expect(nextTemplateId).not.toEqual(initialTemplateId);

      const nextTemplate = templates[nextTemplateId];

      // Assert that the rendered title matches the title from state
      const nextTemplateTitle = utils.getByRole('heading', {
        name: /Template Title/,
      });
      expect(nextTemplateTitle.innerText).toEqual(nextTemplate.title);
    });

    it('should navigate to the previous related template when clicking the "View Previous Template" button', async () => {
      const { templates } = await getTemplatesState();
      // Parse the current template id from the id query param
      const { id: initialTemplateId } = getQueryParams();

      const initialTemplate = templates[initialTemplateId];

      const templateDetailsSection = fixture.screen.getByRole('region', {
        name: /Template Details/,
      });

      const utils = within(templateDetailsSection);

      // Assert that the rendered title matches the title from state
      const initialTemplateTitle = utils.getByRole('heading', {
        name: /Template Title/,
      });
      expect(initialTemplateTitle.innerText).toEqual(initialTemplate.title);

      // Click the view next button to cycle to the next related template
      const viewNextBtn = fixture.screen.getByRole('button', {
        name: /View next template/,
      });
      await fixture.events.click(viewNextBtn);

      // Reparse the current template id from the id query param and assert it's different
      const { id: nextTemplateId } = getQueryParams();

      const nextTemplate = templates[nextTemplateId];

      // Assert that the rendered title matches the title from state
      const nextTemplateTitle = utils.getByRole('heading', {
        name: /Template Title/,
      });
      expect(nextTemplateTitle.innerText).toEqual(nextTemplate.title);

      // Click the previous template button and assert we went back to the initial template
      const viewPreviousBtn = fixture.screen.getByRole('button', {
        name: /View previous template/,
      });

      await fixture.events.click(viewPreviousBtn);

      const { id: currentTemplateId } = getQueryParams();

      expect(currentTemplateId).toEqual(initialTemplateId);

      const currentTemplateTitle = utils.getByRole('heading', {
        name: /Template Title/,
      });

      expect(currentTemplateTitle.innerText).toEqual(initialTemplate.title);
    });

    it('should navigate to a related templated when the view button is clicked', async () => {
      const { templates } = await getTemplatesState();
      // Parse the current template id from the id query param
      const { id: initialTemplateId } = getQueryParams();
      expect(initialTemplateId).toBeTruthy();

      const initialTemplate = templates[initialTemplateId];

      const templateDetailsSection = fixture.screen.getByRole('region', {
        name: /Template Details/,
      });

      const templateDetailsUtils = within(templateDetailsSection);

      // Assert that the rendered title matches the title from state
      const initialTemplateTitle = templateDetailsUtils.getByRole('heading', {
        name: /Template Title/,
      });
      expect(initialTemplateTitle.innerText).toEqual(initialTemplate.title);

      const relatedTemplatesSection = fixture.screen.getByRole('region', {
        name: /Related Templates/,
      });

      // Select the first related template (all related templates have the data-testid attribute)
      const firstRelatedTemplate = within(
        relatedTemplatesSection
      ).queryAllByTestId(/template-grid-item-/)[0];

      // Hover over the first related templated and click the View Button
      // const firstRelatedTemplateUtils = within(firstRelatedTemplate);
      await fixture.events.hover(firstRelatedTemplate);
      const utils = within(firstRelatedTemplate);
      const view = utils.getByText(
        new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
      );
      await fixture.events.click(view);

      // Assert that the active template has changed
      const { id: nextTemplateId } = getQueryParams();
      expect(nextTemplateId).not.toEqual(initialTemplateId);

      const nextTemplate = templates[nextTemplateId];

      const nextTemplateTitle = templateDetailsUtils.getByRole('heading', {
        name: /Template Title/,
      });
      expect(nextTemplateTitle.innerText).toEqual(nextTemplate.title);
    });
  });
});
