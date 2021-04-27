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
  let mockGetCurrentUser;
  let mockUpdateCurrentUser;

  beforeEach(async () => {
    mockGetCurrentUser = jasmine.createSpy('getCurrentUser').and.returnValue(
      Promise.resolve({
        id: 1,
        meta: {
          web_stories_tracking_optin: false,
          web_stories_onboarding: {},
          web_stories_media_optimization: false,
        },
      })
    );
    mockUpdateCurrentUser = jasmine
      .createSpy('updateCurrentUser')
      .and.returnValue(
        Promise.resolve({
          id: 1,
          meta: {
            web_stories_tracking_optin: false,
            web_stories_onboarding: {},
            web_stories_media_optimization: true,
          },
        })
      );

    fixture = new Fixture({
      mocks: {
        getCurrentUser: mockGetCurrentUser,
        updateCurrentUser: mockUpdateCurrentUser,
      },
    });
    fixture.setFlags({ enablePrePublishVideoOptimization: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it("clicking on the toggle should update the user's video optimization settings", async () => {
    const { checklistTab } = fixture.editor.inspector;

    // Click checklist tab
    await fixture.events.click(checklistTab);

    // Open the recommended checklist
    const addNewPageButton = fixture.screen.getByRole('button', {
      name: /Add New Page/,
    });
    await fixture.events.click(addNewPageButton, { clickCount: 1 });
    await fixture.events.sleep(500);

    const toggle =
      fixture.editor.inspector.checklistPanel.autoVideoOptimizationToggle;
    await waitFor(() => toggle);

    expect(toggle.checked).toBeFalse();

    // Click toggle
    await fixture.events.click(toggle);

    expect(mockUpdateCurrentUser).toHaveBeenCalledTimes(1);
    expect(toggle.checked).toBeTrue();

    await fixture.snapshot('auto video optimization toggle checked');
  });
});

describe('Checklist Tab integration - user video optimization setting enabled prior to viewing', () => {
  let fixture;
  let mockGetCurrentUser;

  beforeEach(async () => {
    mockGetCurrentUser = jasmine.createSpy('getCurrentUser').and.returnValue(
      Promise.resolve({
        id: 1,
        meta: {
          web_stories_tracking_optin: false,
          web_stories_onboarding: {},
          web_stories_media_optimization: true,
        },
      })
    );

    fixture = new Fixture({
      mocks: {
        getCurrentUser: mockGetCurrentUser,
      },
    });
    fixture.setFlags({ enablePrePublishVideoOptimization: true });
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render no toggle', async () => {
    const { checklistTab } = fixture.editor.inspector;

    // Click checklist tab
    await fixture.events.click(checklistTab);

    // Open the recommended checklist
    const addNewPageButton = fixture.screen.getByRole('button', {
      name: /Add New Page/,
    });
    await fixture.events.click(addNewPageButton, { clickCount: 1 });
    await fixture.events.sleep(500);

    expect(
      fixture.editor.inspector.checklistPanel.autoVideoOptimizationToggle
    ).toBeNull();
  });
});
