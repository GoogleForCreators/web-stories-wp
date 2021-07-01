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
import { waitFor } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';

describe('Checklist integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableChecklistCompanion: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  const addPages = async (count) => {
    let clickCount = 1;
    while (clickCount <= count) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.events.click(fixture.editor.canvas.framesLayer.addPage);
      // eslint-disable-next-line no-await-in-loop, no-loop-func
      await waitFor(() => {
        expect(fixture.editor.carousel.pages.length).toBe(clickCount + 1);
      });
      clickCount++;
    }
  };

  const openChecklist = async () => {
    const { toggleButton } = fixture.editor.checklist;
    expect(
      fixture.editor.checklist.issues.getAttribute('data-isexpanded')
    ).toBe('false');
    await fixture.events.click(toggleButton);
    // wait for animation
    await fixture.events.sleep(500);
  };

  const openChecklistWithKeyboard = async () => {
    const { toggleButton } = fixture.editor.checklist;
    expect(
      fixture.editor.checklist.issues.getAttribute('data-isexpanded')
    ).toBe('false');
    await fixture.events.focus(toggleButton);
    await fixture.events.keyboard.press('Enter');
    // wait for animation
    await fixture.events.sleep(500);
  };

  describe('open and close', () => {
    it('should toggle the checklist', async () => {
      const { toggleButton } = fixture.editor.checklist;
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('false');

      await fixture.events.click(toggleButton);
      // wait for animation
      await fixture.events.sleep(500);
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('true');

      await fixture.events.click(toggleButton);
      // wait for animation
      await fixture.events.sleep(500);
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('false');
    });

    it('should close the checklist when the "close" button is clicked', async () => {
      await openChecklist();

      await fixture.events.click(fixture.editor.checklist.closeButton);
      await fixture.events.sleep(500);
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('false');
    });
  });

  describe('Checklist cursor interaction', () => {
    it('should open the high priority section by default when 4 pages are added to the story', async () => {
      // need to add some pages, the add page button is under the checklist so do this before expanding
      await addPages(4);
      await openChecklist();
      expect(fixture.editor.checklist.priorityPanel).toBeDefined();
    });

    it('should open the design section when clicked', async () => {
      // need to add some pages, the add page button is under the checklist so do this before expanding
      await addPages(4);
      await openChecklist();
      await fixture.events.click(fixture.editor.checklist.designTab);
      expect(fixture.editor.checklist.designPanel).toBeDefined();
    });

    it('should open the design section by default when 2 pages are added to the story', async () => {
      // need to add some pages, the add page button is under the checklist so do this before expanding
      await addPages(2);
      await openChecklist();

      expect(fixture.editor.checklist.designPanel).toBeDefined();
    });
    // TODO #8085 - a11y section not available in blank page state, no issues present.
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should open the accessibility section', async () => {
      // need to add some pages, the add page button is under the checklist so do this before expanding
      await addPages(2);

      await fixture.events.click(fixture.editor.checklist.accessibilityTab);
      expect(fixture.editor.checklist.accessibilityPanel).toBeDefined();
    });
  });

  describe('Checklist keyboard interaction', () => {
    it('should toggle the Checklist with keyboard', async () => {
      await fixture.events.focus(fixture.editor.checklist.toggleButton);
      await fixture.events.keyboard.press('Enter');
      // wait for animation
      await fixture.events.sleep(500);
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('true');

      await fixture.events.keyboard.press('Enter');
      // wait for animation
      await fixture.events.sleep(500);
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('false');
    });

    it('should close the Checklist when pressing enter on the "close" button', async () => {
      await openChecklistWithKeyboard();

      // will already be focused on the close button
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('true');
      expect(fixture.editor.checklist.closeButton).toEqual(
        document.activeElement
      );

      await fixture.events.keyboard.press('Enter');
      await fixture.events.sleep(500);
      expect(
        fixture.editor.checklist.issues.getAttribute('data-isexpanded')
      ).toBe('false');
    });

    it('should open the tab panels with tab and enter', async () => {
      // need to add some pages, the add page button is under the checklist so do this before expanding
      await addPages(4);

      await openChecklistWithKeyboard();

      // tab to priority section
      while (fixture.editor.checklist.priorityTab !== document.activeElement) {
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('tab');
      }

      await fixture.events.keyboard.press('Enter');
      expect(fixture.editor.checklist.priorityPanel).toBeDefined();
      expect(fixture.editor.checklist.designPanel).toBeNull();
      expect(fixture.editor.checklist.accessibilityPanel).toBeNull();

      // tab to design section
      while (fixture.editor.checklist.designTab !== document.activeElement) {
        // eslint-disable-next-line no-await-in-loop
        await fixture.events.keyboard.press('tab');
      }

      await fixture.events.keyboard.press('Enter');
      expect(fixture.editor.checklist.priorityPanel).toBeNull();
      expect(fixture.editor.checklist.designPanel).toBeDefined();
      expect(fixture.editor.checklist.accessibilityPanel).toBeNull();

      // TODO #8085 - a11y section not available in blank page state, no issues present
      // tab to accessibility section
      // while (
      //   fixture.editor.checklist.accessibilityTab !== document.activeElement
      // ) {
      //   // eslint-disable-next-line no-await-in-loop
      //   await fixture.events.keyboard.press('tab');
      // }

      // await fixture.events.keyboard.press('Enter');
      // expect(fixture.editor.checklist.priorityPanel).toBeNull();
      // expect(fixture.editor.checklist.designPanel).toBeNull();
      // expect(fixture.editor.checklist.accessibilityPanel).toBeDefined();
    });
  });
});
