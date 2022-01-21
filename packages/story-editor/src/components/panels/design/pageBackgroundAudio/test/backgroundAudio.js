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
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import ConfigContext from '../../../../../app/config/context';
import StoryContext from '../../../../../app/story/context';
import { renderWithTheme } from '../../../../../testUtils';
import BackgroundAudioPanel from '../backgroundAudio';

function MediaUpload({ render }) {
  const open = jest.fn();
  return render(open);
}

function arrange({
  backgroundAudio,
  tracks,
  hasUploadMediaAction = true,
  enhancedPageBackgroundAudio = false,
} = {}) {
  const updateStory = jest.fn();

  const configValue = {
    capabilities: {
      hasUploadMediaAction,
    },
    allowedAudioMimeTypes: [
      'audio/mpeg',
      'audio/aac',
      'audio/wav',
      'audio/ogg',
    ],
    allowedAudioFileTypes: ['mp3', 'aac', 'wav', 'ogg'],
    MediaUpload,
  };

  const storyContextValue = {
    state: {
      currentPage: {
        backgroundAudio,
        tracks,
      },
    },
    actions: { updateStory },
  };

  return renderWithTheme(
    <FlagsProvider
      features={{
        enhancedPageBackgroundAudio,
      }}
    >
      <ConfigContext.Provider value={configValue}>
        <StoryContext.Provider value={storyContextValue}>
          <BackgroundAudioPanel />
        </StoryContext.Provider>
      </ConfigContext.Provider>
    </FlagsProvider>
  );
}

describe('BackgroundAudioPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:backgroundAudio',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render nothing if lacking upload capabilities', () => {
    arrange({ hasUploadMediaAction: false });
    expect(
      screen.queryByRole('button', {
        name: 'Upload an audio file',
      })
    ).not.toBeInTheDocument();
  });

  it('should render button to upload audio', () => {
    arrange();
    expect(
      screen.getByRole('button', {
        name: 'Upload an audio file',
      })
    ).toBeInTheDocument();
  });

  it('should render button to play and delete audio', () => {
    arrange({
      backgroundAudio: {
        src: 'https://example.com/audio.mp3',
        id: 123,
        mimeType: 'audio/mpeg',
      },
    });
    expect(
      screen.getByRole('button', {
        name: 'Remove file',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Play',
      })
    ).toBeInTheDocument();
  });

  it('should render existing captions', () => {
    arrange({
      backgroundAudio: {
        src: 'https://example.com/audio.mp3',
        id: 123,
        mimeType: 'audio/mpeg',
      },
      enhancedPageBackgroundAudio: true,
      tracks: [{ id: 123, trackName: 'test' }],
    });
    const input = screen.getByRole('textbox', { name: 'Filename' });
    expect(input).toHaveValue('test');
  });

  it('should render upload button for captions', () => {
    arrange({
      backgroundAudio: {
        src: 'https://example.com/audio.mp3',
        id: 123,
        mimeType: 'audio/mpeg',
      },
      enhancedPageBackgroundAudio: true,
      tracks: [],
    });
    expect(
      screen.getByRole('button', { name: 'Upload audio captions' })
    ).toBeInTheDocument();
  });

  it('should not render upload button for captions without hasUploadMediaAction', () => {
    arrange({
      backgroundAudio: {
        src: 'https://example.com/audio.mp3',
        id: 123,
        mimeType: 'audio/mpeg',
      },
      enhancedPageBackgroundAudio: true,
      hasUploadMediaAction: false,
      tracks: [],
    });
    expect(
      screen.queryByRole('button', { name: 'Upload audio captions' })
    ).not.toBeInTheDocument();
  });

  it('should render existing captions without hasUploadMediaAction', () => {
    arrange({
      backgroundAudio: {
        src: 'https://example.com/audio.mp3',
        id: 123,
        mimeType: 'audio/mpeg',
      },
      enhancedPageBackgroundAudio: true,
      hasUploadMediaAction: false,
      tracks: [{ id: 123, trackName: 'test' }],
    });
    const input = screen.getByRole('textbox', { name: 'Filename' });
    expect(input).toHaveValue('test');
  });
});
