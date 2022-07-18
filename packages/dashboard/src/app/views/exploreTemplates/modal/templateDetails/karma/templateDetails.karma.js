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
import { within, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Fixture from '../../../../../../karma/fixture';
import { TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS } from '../../../../../../constants';
import useApi from '../../../../../api/useApi';

describe('See template details modal', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();

    await navigateToFirstTemplate();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function navigateToFirstTemplate() {
    const navigation = fixture.screen.queryByRole('navigation');
    let utils = within(navigation);

    const exploreTemplatesMenuItem = utils.getByText(/^Explore Templates/);

    await fixture.events.click(exploreTemplatesMenuItem);

    const { templatesOrderById } = await getTemplatesState();

    const firstTemplate = getTemplateElementById(templatesOrderById[0]);

    utils = within(firstTemplate);

    await fixture.events.hover(firstTemplate);

    const seeDetailsButton = utils.getByText(
      new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
    );

    await fixture.events.click(seeDetailsButton);
  }

  function getTemplateElementById(id) {
    return fixture.screen.getByTestId(`template-grid-item-${id}`);
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

  async function getTemplateTitle(index) {
    const { templates, templatesOrderById } = await getTemplatesState();
    return templates[templatesOrderById[index]].title;
  }

  async function expectModalClose() {
    const { templatesOrderById } = await getTemplatesState();
    const firstTemplate = getTemplateElementById(templatesOrderById[0]);
    const utils = within(firstTemplate);

    const seeDetailsButton = await utils.findByText(
      new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
    );
    await expect(seeDetailsButton).toEqual(document.activeElement);
  }

  describe('Action: Navigate template details modal', () => {
    it('should pass accessibility tests', async () => {
      const templateDetails = fixture.screen.queryByRole('dialog');
      expect(templateDetails).toBeTruthy();
      await expectAsync(templateDetails).toHaveNoViolations();
    });

    it('should update current template', async () => {
      const firstTemplateTitle = await getTemplateTitle(0);
      const templateTitle = fixture.screen.getByTestId(
        `template-details-title`
      );

      await expect(templateTitle).toHaveTextContent(firstTemplateTitle);

      const previousArrow = fixture.screen.getByRole('button', {
        name: /View previous template/,
      });
      const nextArrow = fixture.screen.getByRole('button', {
        name: /View next template/,
      });

      await nextArrow.click();
      await expect(templateTitle).toHaveTextContent(await getTemplateTitle(1));
      await expect(templateTitle).not.toHaveTextContent(firstTemplateTitle);

      await previousArrow.click();
      await expect(templateTitle).toHaveTextContent(firstTemplateTitle);
      await expect(templateTitle).not.toHaveTextContent(
        await getTemplateTitle(1)
      );
    });

    it('should update url param for template id', async () => {
      const { templatesOrderById } = await getTemplatesState();

      const firstTemplateId = templatesOrderById[0];
      // Parse the current template id from the id query param
      let urlHashParams = window.location.hash;
      expect(urlHashParams).toBe(
        `#/templates-gallery?id=${firstTemplateId}&isLocal=false`
      );

      // Click the view next button to cycle to the next template
      const viewNextBtn = fixture.screen.getByRole('button', {
        name: /View next template/,
      });
      await fixture.events.click(viewNextBtn);

      const nextTemplateId = templatesOrderById[1];
      // Re-parse the current template id from the id query param and assert it's different
      urlHashParams = window.location.hash;
      await expect(urlHashParams).toBe(
        `#/templates-gallery?id=${nextTemplateId}&isLocal=false`
      );
    });

    it('should update current template via keyboard', async () => {
      //close button should be in focus
      await fixture.events.keyboard.press('tab');
      const closeBtn = fixture.screen.getByRole('button', {
        name: /^Close$/,
      });
      expect(closeBtn).toEqual(document.activeElement);

      // enter should close modal
      await waitFor(async () => {
        await fixture.events.keyboard.press('Enter');
        // let modal close
        await fixture.events.sleep(500);
        await expectModalClose();
      });

      // open first template in modal
      await fixture.events.keyboard.press('Enter');

      // escape should close modal
      await waitFor(async () => {
        await fixture.events.keyboard.press('Escape');
        // let modal close
        await fixture.events.sleep(500);
        await expectModalClose();
      });

      // open first template in modal
      await fixture.events.keyboard.press('Enter');
      // navigate to 'Use Template' button
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      const useTemplateBtn = fixture.screen.getByRole('button', {
        name: /to create new story/,
      });
      expect(useTemplateBtn).toEqual(document.activeElement);

      // navigate to gallery thumbnail
      await fixture.events.keyboard.press('tab');
      const page1 = fixture.screen.getByRole('button', { name: /Page 1/ });
      expect(page1).toEqual(document.activeElement);

      // Check current template
      const firstTemplateTitle = await getTemplateTitle(0);
      await expect(
        fixture.screen.getByTestId(`template-details-title`)
      ).toHaveTextContent(firstTemplateTitle);

      //navigate to next template arrow
      await fixture.events.keyboard.press('tab');
      const nextArrow = fixture.screen.getByRole('button', {
        name: /View next template/,
      });
      expect(nextArrow).toEqual(document.activeElement);

      // navigate to next template
      await fixture.events.keyboard.press('Enter');
      await expect(
        fixture.screen.getByTestId(`template-details-title`)
      ).not.toHaveTextContent(firstTemplateTitle);
      await expect(
        fixture.screen.getByTestId(`template-details-title`)
      ).toHaveTextContent(await getTemplateTitle(1));

      //navigate back to previous template
      await fixture.events.keyboard.shortcut('shift+tab');
      await fixture.events.keyboard.shortcut('shift+tab');
      const previousArrow = fixture.screen.getByRole('button', {
        name: /View previous template/,
      });
      expect(previousArrow).toEqual(document.activeElement);
      await fixture.events.keyboard.press('Enter');
      await expect(
        fixture.screen.getByTestId(`template-details-title`)
      ).toHaveTextContent(firstTemplateTitle);
      await expect(
        fixture.screen.getByTestId(`template-details-title`)
      ).not.toHaveTextContent(await getTemplateTitle(1));
    });
  });

  describe('Action: See template details modal', () => {
    it('should update the "Active Preview Page" when clicking on a "Thumbnail Preview Page"', async () => {
      const firstPage = fixture.screen.getByRole('button', { name: /Page 1/ });

      expect(firstPage).toBeTruthy();

      const activePage = fixture.screen.getByRole('img', {
        name: 'Active Page Preview - Page 1',
      });

      expect(activePage).toBeTruthy();

      const secondPage = fixture.screen.getByRole('button', { name: /Page 2/ });

      expect(secondPage).toBeTruthy();

      await fixture.events.click(secondPage);

      fixture.screen.getByRole('img', {
        name: 'Active Page Preview - Page 2',
      });

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

      await fixture.events.keyboard.press('Enter');

      const activePreviewPage = fixture.screen.getByRole('img', {
        name: 'Active Page Preview - Page 4',
      });

      expect(activePreviewPage).toBeTruthy();
    });
  });
});
