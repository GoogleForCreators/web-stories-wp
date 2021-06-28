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

  const openChecklist = async () => {
    const { toggleButton } = fixture.editor.checklist;
    expect(fixture.editor.checklist.issues).toBeNull();
    await fixture.events.click(toggleButton);
    // wait for animation
    await fixture.events.sleep(500);
  };

  describe('open and close', () => {
    it('should toggle the checklist', async () => {
      const { toggleButton } = fixture.editor.checklist;
      expect(fixture.editor.checklist.issues).toBeNull();

      await fixture.events.click(toggleButton);
      // wait for animation
      await fixture.events.sleep(500);
      expect(fixture.editor.checklist.issues).toBeDefined();

      await fixture.events.click(toggleButton);
      // wait for animation
      await fixture.events.sleep(500);
      expect(fixture.editor.checklist.issues).toBeNull();
    });

    it('should close the checklist when the "close" button is clicked', async () => {
      await openChecklist();

      await fixture.events.click(fixture.editor.checklist.closeButton);
      await fixture.events.sleep(500);
      expect(fixture.editor.checklist.issues).toBeNull();
    });
  });

  describe('Checklist cursor interaction', () => {
    it('should open the high priority section', async () => {
      await openChecklist();

      await fixture.events.click(fixture.editor.checklist.priorityTab);
      expect(fixture.editor.checklist.priorityPanel).toBeDefined();
    });

    it('should open the design section', async () => {
      await openChecklist();

      await fixture.events.click(fixture.editor.checklist.designTab);
      expect(fixture.editor.checklist.designPanel).toBeDefined();
    });

    it('should open the accessibility section', async () => {
      await openChecklist();

      await fixture.events.click(fixture.editor.checklist.accessibilityTab);
      expect(fixture.editor.checklist.accessibilityPanel).toBeDefined();
    });
  });
});
