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

describe('Checklist Tab integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enablePrePublishVideoOptimization: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Auto video optimization', () => {
    it("clicking on the toggle should set the user's settings", async () => {
      const { checklistTab } = fixture.editor.inspector;

      // Click checklist tab
      await fixture.events.click(checklistTab);
      await waitFor(() => fixture.editor.inspector.checklistPanel);

      // Open the recommended dropdown
      await fixture.events.click(
        fixture.editor.inspector.checklistPanel.recommended
      );
      await waitFor(
        () =>
          fixture.editor.inspector.checklistPanel.autoVideoOptimizationToggle
      );

      // Click toggle
    });
  });
});
