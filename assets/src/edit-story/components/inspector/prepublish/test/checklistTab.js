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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { noop } from '../../../../../design-system';
import { renderWithProviders } from '../../../../../design-system/testUtils/renderWithProviders';
import { ConfigProvider } from '../../../../app/config';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../../../../app/prepublish';
import ChecklistTab from '../components/checklistTab';
import { TEXT } from '../constants';
import { PPC_CHECKPOINT_STATE } from '../prepublishCheckpointState';

jest.mock('flagged', () => ({
  useFeature: () => true,
  useFeatures: () => ({
    enablePrePublishVideoOptimization: true,
  }),
}));

const GUIDANCE_ERROR = {
  type: PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
  elements: [],
  elementId: '123',
  storyId: '999',
  message: 'Test message',
  help: 'Test help',
};

const renderChecklistTab = ({
  areVideosAutoOptimized = false,
  hasUploadMediaAction = true,
  currentCheckpoint = PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED,
  isChecklistEmpty,
}) => {
  return renderWithProviders(
    <ConfigProvider
      config={{
        isRTL: false,
        capabilities: { hasUploadMediaAction },
      }}
    >
      <ChecklistTab
        areVideosAutoOptimized={areVideosAutoOptimized}
        checklist={[GUIDANCE_ERROR]}
        currentCheckpoint={currentCheckpoint}
        isChecklistEmpty={isChecklistEmpty}
        onAutoVideoOptimizationClick={noop}
      />
    </ConfigProvider>
  );
};
describe('<ChecklistTab />', () => {
  it("should render a toggle if the user's web_stories_media_optimization setting is initially false", () => {
    renderChecklistTab({ areVideosAutoOptimized: false });

    const toggle = screen.getByRole('checkbox', { hidden: true });

    expect(toggle).toBeInTheDocument();
  });

  it("should not render toggle if the user's web_stories_media_optimization setting is initially true", () => {
    renderChecklistTab({
      areVideosAutoOptimized: true,
    });

    const toggle = screen.queryByRole('checkbox', { hidden: true });

    expect(toggle).not.toBeInTheDocument();
  });

  it("should not render toggle if the user doesn't have proper permissions", () => {
    renderChecklistTab({
      areVideosAutoOptimized: true,
    });

    const toggle = screen.queryByRole('checkbox', { hidden: true });

    expect(toggle).not.toBeInTheDocument();
  });

  it(`should display starting empty message when checkpoint is "${PPC_CHECKPOINT_STATE.UNAVAILABLE}"`, () => {
    renderChecklistTab({
      currentCheckpoint: PPC_CHECKPOINT_STATE.UNAVAILABLE,
    });

    const message = screen.getByText(TEXT.UNAVAILABLE_BODY);

    expect(message).toBeInTheDocument();
  });

  it(`should display message about empty checklist when checkpoint is "${PPC_CHECKPOINT_STATE.NO_ISSUES}"`, () => {
    renderChecklistTab({
      currentCheckpoint: PPC_CHECKPOINT_STATE.NO_ISSUES,
      isChecklistEmpty: true,
    });

    const message = screen.getByText(TEXT.EMPTY_BODY);

    expect(message).toBeInTheDocument();
  });
});
