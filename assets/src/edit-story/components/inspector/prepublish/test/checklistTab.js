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
import { noop } from '../../../../../design-system';
import { renderWithProviders } from '../../../../../design-system/testUtils/renderWithProviders';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../../../../app/prepublish';
import ChecklistTab from '../checklistTab';

jest.mock('flagged', () => ({
  useFeature: () => true,
}));

const GUIDANCE_ERROR = {
  type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
  elements: [],
  elementId: '123',
  storyId: '999',
  message: 'Test message',
  help: 'Test help',
};

describe('<ChecklistTab />', () => {
  it("should render a toggle if the user's web_stories_media_optimization setting is initially false", () => {
    const { getByRole } = renderWithProviders(
      <ChecklistTab
        areVideosAutoOptimized={false}
        checklist={[GUIDANCE_ERROR]}
        onAutoVideoOptimizationClick={noop}
      />
    );

    const toggle = getByRole('checkbox', { hidden: true });

    expect(toggle).toBeInTheDocument();
  });

  it("should not render toggle if the user's web_stories_media_optimization setting is initially true", () => {
    const { queryByRole } = renderWithProviders(
      <ChecklistTab
        areVideosAutoOptimized
        checklist={[GUIDANCE_ERROR]}
        onAutoVideoOptimizationClick={noop}
      />
    );

    const toggle = queryByRole('checkbox', { hidden: true });

    expect(toggle).not.toBeInTheDocument();
  });
});
