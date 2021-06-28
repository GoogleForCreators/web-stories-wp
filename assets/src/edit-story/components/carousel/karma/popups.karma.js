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
import { Fixture } from '../../../karma';

describe('Popup Menus - Help Center and Checklist', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ enableChecklistCompanion: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should start with both popups closed', () => {
    const { helpCenterToggle, checklistToggle } = fixture.editor.carousel;

    expect(helpCenterToggle).toBeDefined();
    expect(checklistToggle).toBeDefined();
  });

  it('should collapse helpCenter when checklist is expanded', async () => {
    const { helpCenterToggle, checklistToggle } = fixture.editor.carousel;
    await fixture.events.click(helpCenterToggle);

    const { quickTips } = await fixture.editor.helpCenter;
    expect(quickTips).toBeDefined();

    await fixture.events.click(checklistToggle);
    const checklistHeader = await fixture.screen.getByRole('dialog', {
      name: /^Checklist/,
    });
    await fixture.events.sleep(500);

    expect(checklistHeader).toBeDefined();
    expect(fixture.editor.helpCenter.quickTips).toBeNull();
  });

  it('should collapse checklist when helpCenter is expanded', async () => {
    const { helpCenterToggle, checklistToggle } = fixture.editor.carousel;

    await fixture.events.click(checklistToggle);

    const checklistHeader = await fixture.screen.getByRole('dialog', {
      name: /^Checklist/,
    });

    expect(checklistHeader).toBeDefined();
    expect(fixture.editor.helpCenter.quickTips).toBeNull();

    await fixture.events.click(helpCenterToggle);

    const { quickTips } = await fixture.editor.helpCenter;

    await fixture.events.sleep(500);

    expect(quickTips).toBeDefined();
    expect(
      fixture.screen.queryAllByRole('dialog', {
        name: /^Checklist/,
      })
    ).toEqual([]);
  });
});
