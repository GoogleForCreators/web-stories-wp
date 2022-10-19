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
 * External dependencies
 */
import { screen } from '@testing-library/react';
import { useFeature } from 'flagged';
/**
 * Internal dependencies
 */
import VideoOptions from '../videoOptions';
import { renderPanel } from '../../../shared/test/_utils';
import { useLocalMedia } from '../../../../../app/media';

jest.mock('flagged');

jest.mock('../../../../../app/media');

jest.mock('../../../../../app/config', () => ({
  useConfig: jest.fn(() => ({
    capabilities: { hasUploadMediaAction: true },
  })),
}));
jest.mock('../../../../../app/currentUser', () => ({
  useCurrentUser: jest.fn(() => ({
    state: {
      currentUser: {
        mediaOptimization: true,
      },
    },
  })),
}));

describe('Panels/VideoOptions', () => {
  const defaultElement = {
    id: 123,
    type: 'video',
    volume: 1,
    resource: { posterId: 0, poster: '', alt: '', isMuted: false },
  };
  function arrange(...args) {
    return renderPanel(VideoOptions, ...args);
  }

  beforeAll(() => {
    useFeature.mockImplementation(() => true);
    localStorage.setItem(
      'web_stories_ui_panel_settings:videoOptions',
      JSON.stringify({ isCollapsed: false })
    );

    useLocalMedia.mockReturnValue({
      isElementTrimming: jest.fn(),
      isNewResourceMuting: jest.fn(),
      canTranscodeResource: jest.fn(),
    });
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render <VideoOptions /> panel', () => {
    arrange([defaultElement]);
    const panel = screen.getByText('Video Settings');
    expect(panel).toBeInTheDocument();
  });

  it('should render volume input', () => {
    arrange([defaultElement]);
    expect(screen.getByLabelText('Volume')).toBeInTheDocument();
  });

  it('should not render volume input if video is muted', () => {
    arrange([
      {
        type: 'video',
        volume: 1,
        resource: { posterId: 0, poster: '', alt: '', isMuted: true },
      },
    ]);
    expect(screen.queryByLabelText('Volume')).not.toBeInTheDocument();
  });
});
