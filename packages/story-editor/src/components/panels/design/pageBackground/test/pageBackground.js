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
import { fireEvent, screen } from '@testing-library/react';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import PageBackgroundPanel from '../pageBackground';
import { renderPanel } from '../../../shared/test/_utils';
import ConfigContext from '../../../../../app/config/context';
import { StoryContext } from '../../../../../app/story';
import useFFmpeg from '../../../../../app/media/utils/useFFmpeg';

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: jest.fn(() => ({ showSnackbar: jest.fn() })),
}));
jest.mock('../../../../../app/media/utils/useFFmpeg');

const mockUseFFmpeg = useFFmpeg;

function MediaUpload({ render, onSelect }) {
  const open = () => {
    const image = { type: 'image', src: 'media1' };
    onSelect(image);
  };

  return render(open);
}

function arrange(selectedElements) {
  const configValue = {
    allowedMimeTypes: {
      audio: ['audio/mpeg', 'audio/aac', 'audio/wav', 'audio/ogg'],
      image: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
      ],
      caption: ['text/vtt'],
      vector: [],
      video: ['video/mp4', 'video/webm'],
    },
    capabilities: {
      hasUploadMediaAction: true,
    },
    allowedTranscodableMimeTypes: [],
    MediaUpload,
  };

  const combineElements = jest.fn();
  const storyValue = {
    state: {
      currentPage: {
        backgroundColor: {},
      },
    },
    actions: {
      clearBackgroundElement: jest.fn(),
      combineElements,
      updateCurrentPageProperties: jest.fn(),
    },
  };

  const wrapper = ({ children }) => (
    <ConfigContext.Provider value={configValue}>
      <StoryContext.Provider value={storyValue}>
        {children}
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );

  return {
    ...renderPanel(PageBackgroundPanel, selectedElements, wrapper),
    combineElements,
  };
}

describe('Panels/PageBackground', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
    localStorage.setItem(
      'web_stories_ui_panel_settings:pageBackground',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should simulate a click on the replace button', () => {
    mockUseFFmpeg.mockReturnValue({ isTranscodingEnabled: false });
    const backgroundImage = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      id: '123',
      isBackground: true,
      type: 'image',
      rotationAngle: 0,
      resource: {
        id: 'resource/123',
        src: 'media.jpg',
        alt: 'Media',
      },
    };
    const { combineElements } = arrange([backgroundImage]);
    const replaceButton = screen.getByRole('button', { name: 'Replace' });
    fireEvent.click(replaceButton);
    expect(combineElements).toHaveBeenCalledTimes(1);
    expect(combineElements).toHaveBeenCalledWith({
      firstElement: expect.any(Object),
      secondId: '123',
    });
  });
});
