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
import { useStory } from '../../../app/story';

describe('Publish Story Modal', () => {
  let fixture;
  let publishModal;

  async function openPublishModal() {
    const { publish } = fixture.editor.titleBar;
    await fixture.events.click(publish);
  }

  beforeEach(async () => {
    fixture = new Fixture();
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
    const { findByRole } = within(publishModal);

    return findByRole(role, {
      name,
    });
  }

  describe('Basic structure', () => {
    it('should have no aXe accessibility violations', async () => {
      await expectAsync(publishModal).toHaveNoViolations();
    });
  });

  describe('Functionality', () => {
    it('should close the publish modal and focus the publish button', async () => {
      const closeButton = await getPublishModalElement('button', /Close/);
      await fixture.events.click(closeButton);

      publishModal = await fixture.screen.findByRole('dialog', {
        name: /^Story details$/,
      });

      expect(document.activeElement).toBe(fixture.editor.titleBar.publish);
    });

    it('should close the publish modal and open (and focus) the checklist when checklist button is clicked', async () => {
      const checklistButton = await getPublishModalElement(
        'button',
        'Checklist'
      );
      await fixture.events.click(checklistButton);

      const updatedPublishModal = await fixture.screen.queryByRole('dialog', {
        name: /^Story details$/,
      });

      expect(updatedPublishModal).toBeNull();
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('true');

      // Checklist should be focused
      expect(document.activeElement).toBe(fixture.editor.checklist.closeButton);
    });

    it('should not update story permalink when title is updated if permalink already exists', async () => {
      // Give story initial title
      const storyTitle = await getPublishModalElement('textbox', 'Story Title');
      await fixture.events.focus(storyTitle);
      await fixture.events.keyboard.type('Stews for long journeys');
      await fixture.events.keyboard.press('tab');

      const storySlug = await getPublishModalElement('textbox', 'URL slug');
      // that initial title should give us an initial slug
      expect(storySlug.getAttribute('value')).toBe('stews-for-long-journeys');

      await fixture.events.focus(storySlug);
      await fixture.events.keyboard.type(
        "bilbo's favorite 30 minute rabbit stew"
      );
      await fixture.events.keyboard.press('tab');
      // now we've updated the slug independent of title
      expect(storySlug.getAttribute('value')).toBe(
        'bilbos-favorite-30-minute-rabbit-stew'
      );

      // Update the title
      await fixture.events.focus(storyTitle);
      await fixture.events.keyboard.type('Travel Stews With Bilbo');
      await fixture.events.keyboard.press('tab');

      // slug should remain as it was
      expect(storySlug.getAttribute('value')).toBe(
        'bilbos-favorite-30-minute-rabbit-stew'
      );
    });

    it('should toggle from auto page advancement by default to manual', async () => {
      const manualInput = await getPublishModalElement('radio', 'Manual');
      const autoInput = await getPublishModalElement('radio', 'Auto');

      await fixture.events.click(manualInput.closest('label'));

      expect(typeof autoInput.getAttribute('checked')).toBe('string');
      expect(manualInput.getAttribute('checked')).toBeNull();
    });

    it('should update the featured media', async () => {
      const originalPoster = fixture.renderHook(() =>
        useStory(({ state }) => state.story.featuredMedia)
      );

      const posterImageButton = await getPublishModalElement(
        'button',
        'Poster image'
      );

      await fixture.events.click(posterImageButton);

      const newPoster = fixture.renderHook(() =>
        useStory(({ state }) => state.story.featuredMedia)
      );

      expect(originalPoster).not.toEqual(newPoster);
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate modal by keyboard', async () => {
      expect(publishModal).toHaveFocus();

      await fixture.events.keyboard.press('tab');

      const closeButton = await getPublishModalElement('button', 'Close');
      expect(closeButton).toHaveFocus();

      await fixture.events.keyboard.press('tab');

      const publishButton = await getPublishModalElement('button', 'Publish');
      expect(publishButton).toHaveFocus();

      await fixture.events.keyboard.press('tab');

      const updatePosterImageButton = await getPublishModalElement(
        'button',
        'Poster image'
      );
      expect(updatePosterImageButton).toHaveFocus();

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
