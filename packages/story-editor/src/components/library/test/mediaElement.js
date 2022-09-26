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
import { axe } from 'jest-axe';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import MediaElement from '../panes/media/common/mediaElement';
import CanvasContext from '../../../app/canvas/context';
import StoryContext from '../../../app/story/context';
import { useLocalMedia } from '../../../app/media';
jest.mock('../../../app/media');

const IMAGE_RESOURCE = {
  id: 789,
  src: 'http://image-url.com',
  type: 'image',
  mimeType: 'image/png',
  width: 100,
  height: 100,
  alt: 'image :)',
};

const VIDEO_RESOURCE = {
  id: 456,
  src: 'http://video-url.com',
  type: 'video',
  mimeType: 'video/mp4',
  width: 100,
  height: 100,
  alt: 'video :)',
};

const GIF_RESOURCE = {
  id: 789,
  src: 'http://gif-url.com',
  type: 'gif',
  mimeType: 'image/gif',
  width: 100,
  height: 100,
  alt: 'gif :)',
  output: {
    src: 'http://gif-url.com',
  },
};

const renderMediaElement = (resource, providerType, canEditMedia = true) => {
  const canvasContext = {
    state: {
      pageSize: {
        width: 200,
        height: 200,
      },
      designSpaceGuideline: document.body,
      canvasContainer: document.body,
      pageContainer: document.body,
      nodesById: [],
    },
    actions: {},
  };
  const storyContext = {
    state: {
      currentPage: {
        elements: [],
      },
    },
    actions: {
      addElement: jest.fn(),
      combineElements: jest.fn(),
    },
  };
  return renderWithTheme(
    <StoryContext.Provider value={storyContext}>
      <CanvasContext.Provider value={canvasContext}>
        <MediaElement
          index={0}
          resource={resource}
          onInsert={() => {}}
          providerType={providerType}
          width={150}
          height={150}
          canEditMedia={canEditMedia}
        />
      </CanvasContext.Provider>
    </StoryContext.Provider>
  );
};

const mockedReturnValue = {
  isCurrentResourceTrimming: jest.fn(),
  isCurrentResourceMuting: jest.fn(),
  isCurrentResourceTranscoding: jest.fn(),
  isNewResourceProcessing: jest.fn(),
  canTranscodeResource: jest.fn(),
  isCurrentResourceProcessing: jest.fn(),
  isCurrentResourceUploading: jest.fn(),
};

describe('MediaElement', () => {
  beforeEach(() => {
    useLocalMedia.mockReturnValue(mockedReturnValue);
  });
  it.each`
    type       | resource
    ${'image'} | ${IMAGE_RESOURCE}
    ${'video'} | ${VIDEO_RESOURCE}
    ${'gif'}   | ${GIF_RESOURCE}
  `(
    'should render MediaElement for a resource of type=`$type` without accessibility violations',
    async ({ resource }) => {
      useLocalMedia.mockReturnValue({
        ...mockedReturnValue,
        canTranscodeResource: () => true,
      });
      const { container } = renderMediaElement(resource, 'local');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    }
  );

  it("should render dropdown menu's more icon for uploaded image", () => {
    useLocalMedia.mockReturnValue({
      ...mockedReturnValue,
      canTranscodeResource: () => true,
    });
    const { getByAriaLabel } = renderMediaElement(
      {
        ...IMAGE_RESOURCE,
      },
      'local'
    );
    expect(getByAriaLabel('More')).toBeInTheDocument();
  });

  it("should render dropdown menu's more icon for uploaded video", () => {
    useLocalMedia.mockReturnValue({
      ...mockedReturnValue,
      canTranscodeResource: () => true,
    });
    const { getByAriaLabel } = renderMediaElement(
      {
        ...VIDEO_RESOURCE,
      },
      'local'
    );
    expect(getByAriaLabel('More')).toBeInTheDocument();
  });

  it("should render dropdown menu's more icon for uploaded gif", () => {
    useLocalMedia.mockReturnValue({
      ...mockedReturnValue,
      canTranscodeResource: () => true,
    });
    const { getByAriaLabel } = renderMediaElement(
      {
        ...GIF_RESOURCE,
      },
      'local'
    );
    expect(getByAriaLabel('More')).toBeInTheDocument();
  });
});
