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
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@googleforcreators/design-system';
import {
  useConfig,
  useCurrentUser,
  useStory,
} from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import VideoOptimizationCheckbox from '..';

jest.mock('@googleforcreators/story-editor', () => ({
  ...jest.requireActual('@googleforcreators/story-editor'),
  useConfig: jest.fn(),
  useCurrentUser: jest.fn(),
  useStory: jest.fn(),
  useIsChecklistMounted: jest.fn(() => true),
}));

const mockUseConfig = useConfig;
const mockUseCurrentUser = useCurrentUser;
const mockUseStory = useStory;
const mockToggleWebStoriesMediaOptimization = jest.fn();
const mockUser = {
  meta: {
    web_stories_media_optimization: false,
  },
};

const mockStory = {
  state: {
    meta: {
      isSaving: false,
    },
  },
  actions: {
    saveStory: jest.fn(),
  },
};

const Wrapper = (props) => <ThemeProvider theme={theme} {...props} />;

describe('VideoOptimizationCheckbox', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue({
      capabilities: { hasUploadMediaAction: true },
      dashboardSettingsLink: '/',
    });
    mockUseCurrentUser.mockReturnValue({
      currentUser: mockUser,
      toggleWebStoriesMediaOptimization: mockToggleWebStoriesMediaOptimization,
    });
    mockUseStory.mockReturnValue(mockStory);
  });

  it('should render `null` if auto video optimization is enabled', () => {
    mockUseCurrentUser.mockReturnValue({
      currentUser: {
        ...mockUser,
        meta: { ...mockUser.meta, web_stories_media_optimization: true },
      },
      toggleWebStoriesMediaOptimization: mockToggleWebStoriesMediaOptimization,
    });
    render(<VideoOptimizationCheckbox />, { wrapper: Wrapper });

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('should render `null` if the user does not have the permission to upload media and auto video optimization is disabled', () => {
    mockUseConfig.mockReturnValue({
      capabilities: { hasUploadMediaAction: false },
      dashboardSettingsLink: '/',
    });
    mockUseCurrentUser.mockReturnValue({
      currentUser: {
        ...mockUser,
        meta: { ...mockUser.meta, web_stories_media_optimization: false },
      },
      toggleWebStoriesMediaOptimization: mockToggleWebStoriesMediaOptimization,
    });

    render(<VideoOptimizationCheckbox />, { wrapper: Wrapper });

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('should render the checkbox if auto video optimization is disabled and the user is able to upload media', () => {
    render(<VideoOptimizationCheckbox />, { wrapper: Wrapper });

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
