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
 * Internal dependencies
 */
import { Fixture } from '../../../karma/fixture';
import { useHistory } from '../';

describe('CUJ: Creator can View and Modify Document Settings: Navigating without changes', () => {
  let fixture;
  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should not have new history changes when switching tabs without changes', async () => {
    // Click on the shapes tab.
    await fixture.events.click(fixture.editor.library.shapesTab);
    // Click on the document tab.
    await fixture.events.click(fixture.editor.inspector.documentTab);
    // Wait to ensure any processes (in case of bugs) would be finished.
    await fixture.events.sleep(500);

    const {
      state: { hasNewChanges, canUndo, canRedo },
    } = await fixture.renderHook(() => useHistory());

    expect(hasNewChanges).toBeFalse();
    expect(canUndo).toBeFalse();
    expect(canRedo).toBeFalse();

    await fixture.snapshot('No new history changes');
  });
});
