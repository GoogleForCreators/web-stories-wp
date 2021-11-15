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

describe('Popup Menus - Help Center, KeyboardShortcuts, and Checklist', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should start with help center open', () => {
    const { helpCenterToggle, checklistToggle, keyboardShortcutsToggle } =
      fixture.editor.footer;

    expect(helpCenterToggle).toBeDefined();
    expect(checklistToggle).toBeDefined();
    expect(keyboardShortcutsToggle).toBeDefined();
    expect(fixture.editor.helpCenter.quickTips).toBeDefined();
  });

  it('should collapse help center and keyboard shortcuts when checklist is expanded', async () => {
    const { checklistToggle } = fixture.editor.footer;

    await fixture.events.click(checklistToggle);
    await fixture.events.sleep(300); // allow transition to play out

    expect(
      fixture.editor.checklist.issues.getAttribute('data-isexpanded')
    ).toBe('true');
    expect(fixture.editor.helpCenter.quickTips).toBeNull();
    expect(fixture.editor.keyboardShortcuts.keyboardShortcutsMenu).toBeNull();
  });

  it('should collapse checklist when helpCenter is expanded', async () => {
    const { helpCenterToggle, checklistToggle } = fixture.editor.footer;

    await fixture.events.click(checklistToggle);
    await fixture.events.sleep(300);
    expect(
      fixture.editor.checklist.issues.getAttribute('data-isexpanded')
    ).toBe('true');
    expect(fixture.editor.helpCenter.quickTips).toBeNull();

    await fixture.events.click(helpCenterToggle);

    const { quickTips } = await fixture.editor.helpCenter;

    await fixture.events.sleep(300);

    expect(quickTips).toBeDefined();
  });

  it('should collapse checklist and help center when keyboard shortcuts menu is expanded', async () => {
    const { checklistToggle, keyboardShortcutsToggle } = fixture.editor.footer;

    await fixture.events.click(checklistToggle);
    await fixture.events.sleep(300);

    expect(
      fixture.editor.checklist.issues.getAttribute('data-isexpanded')
    ).toBe('true');
    expect(fixture.editor.helpCenter.quickTips).toBeNull();

    await fixture.events.click(keyboardShortcutsToggle);

    await fixture.events.sleep(300);

    const { keyboardShortcutsMenu } = await fixture.editor.keyboardShortcuts;

    expect(keyboardShortcutsMenu).toBeDefined();
  });
});
