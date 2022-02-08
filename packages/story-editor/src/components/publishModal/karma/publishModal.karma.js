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

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';

describe('Publish Story Modal', () => {
  let fixture;
  let publishModal;

  async function openPublishModal() {
    const { publish } = fixture.editor.titleBar;
    await fixture.events.click(publish);
  }

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableUpdatedPublishStoryModal: true });
    await fixture.render();

    await openPublishModal();
    publishModal = await fixture.screen.findByRole('dialog', {
      name: /^Story details$/,
    });
  });

  afterEach(() => {
    fixture.restore();
  });

  function getPublishModalElement(role, name) {
    const { getByRole } = within(publishModal);

    return getByRole(role, {
      name,
    });
  }

  describe('Basic structure', () => {
    it('should have no aXe accessibility violations', async () => {
      await expectAsync(publishModal).toHaveNoViolations();
    });
  });

  describe('Functionality', () => {
    it('should only allow publish of a Story when both title and description are not empty', async () => {
      let publishButton = await getPublishModalElement('button', 'Publish');
      expect(typeof publishButton.getAttribute('disabled')).toBe('string');

      const storyTitle = await getPublishModalElement('textbox', 'Story Title');
      await fixture.events.focus(storyTitle);
      await fixture.events.keyboard.type('my test story');
      const storyDescription = await getPublishModalElement(
        'textbox',
        'Story Description'
      );
      await fixture.events.focus(storyDescription);
      await fixture.events.keyboard.type('my test description for my story');

      publishButton = await getPublishModalElement('button', 'Publish');
      expect(publishButton.getAttribute('disabled')).toBeNull();
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate modal by keyboard', async () => {
      expect(publishModal).toHaveFocus();

      await fixture.events.keyboard.press('tab');

      const closeButton = await getPublishModalElement('button', 'Close');
      expect(closeButton).toHaveFocus();

      await fixture.events.keyboard.press('tab');

      const storyTitle = await getPublishModalElement('textbox', 'Story Title');
      expect(storyTitle).toHaveFocus();

      await fixture.events.keyboard.press('tab');

      const storyDescription = await getPublishModalElement(
        'textbox',
        'Story Description'
      );
      expect(storyDescription).toHaveFocus();
    });
  });
});
