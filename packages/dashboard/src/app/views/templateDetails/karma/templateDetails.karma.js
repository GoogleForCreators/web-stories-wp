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

describe('CUJ: Creator can browse templates in grid view: See pre-built template details page', () => {
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
    const exploreTemplatesMenuItem = fixture.screen.queryByRole('link', {
      name: /^Explore Templates/,
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

  describe('Action: See pre-built template details page', () => {
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

      await fixture.events.keyboard.press('Enter');

      const activePreviewPage = fixture.screen.getByLabelText(
        'Active Page Preview - Page 4'
      );

      expect(activePreviewPage).toBeTruthy();
    });
  });
});
