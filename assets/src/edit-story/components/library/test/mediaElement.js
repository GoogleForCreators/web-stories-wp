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
/**
 * External dependencies
 */
import { Simulate } from 'react-dom/test-utils';
import MediaElement from '../panes/media/common/mediaElement';
import { renderWithTheme } from '../../../testUtils';
import CanvasContext from '../../../app/canvas/context';
import StoryContext from '../../../app/story/context';

const renderMediaElement = (resource, providerType) => {
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
  };
  const storyContext = {
    state: {
      currentPage: {
        elements: [],
      },
    },
    actions: {
      addElement: jest.fn(),
    },
  };
  return renderWithTheme(
    <StoryContext.Provider value={storyContext}>
      <CanvasContext.Provider value={canvasContext}>
        <MediaElement
          resource={resource}
          onInsert={() => {}}
          providerType={providerType}
        />
      </CanvasContext.Provider>
    </StoryContext.Provider>
  );
};

describe('MediaElement', () => {
  it("should render dropdown menu's more icon for uploaded image", () => {
    const resource = {
      id: 123,
      src: 'http://image-url.com',
      type: 'image',
      width: 100,
      height: 100,
      local: false, // Already uploaded
      alt: 'image :)',
    };

    const { getByAriaLabel, queryByAriaLabel } = renderMediaElement(
      resource,
      'local'
    );
    expect(queryByAriaLabel('More')).not.toBeInTheDocument();

    const element = getByAriaLabel('image :)');
    Simulate.focus(element);

    expect(getByAriaLabel('More')).toBeInTheDocument();
  });

  it("should render dropdown menu's more icon for uploaded video", () => {
    const resource = {
      id: 456,
      src: 'http://video-url.com',
      type: 'video',
      width: 100,
      height: 100,
      local: false, // Already uploaded
      alt: 'video :)',
    };

    const { getByAriaLabel, queryByAriaLabel } = renderMediaElement(
      resource,
      'local'
    );
    expect(queryByAriaLabel('More')).not.toBeInTheDocument();

    const element = getByAriaLabel('video :)');
    Simulate.focus(element);

    expect(getByAriaLabel('More')).toBeInTheDocument();
  });

  it("should not render dropdown menu's more icon for not uploaded image", () => {
    const resource = {
      id: 789,
      src: 'http://image-url.com',
      type: 'image',
      width: 100,
      height: 100,
      local: true, // Not yet uploaded
      alt: 'image :)',
    };

    const { getByAriaLabel, queryByAriaLabel } = renderMediaElement(
      resource,
      'local'
    );
    expect(queryByAriaLabel('More')).not.toBeInTheDocument();

    const element = getByAriaLabel('image :)');
    Simulate.focus(element);

    expect(queryByAriaLabel('More')).not.toBeInTheDocument();
  });

  it("should not render dropdown menu's more icon for not uploaded video", () => {
    const resource = {
      id: 987,
      src: 'http://video-url.com',
      type: 'video',
      width: 100,
      height: 100,
      local: true, // Not yet uploaded
      alt: 'video :)',
    };

    const { getByAriaLabel, queryByAriaLabel } = renderMediaElement(
      resource,
      'local'
    );
    expect(queryByAriaLabel('More')).not.toBeInTheDocument();

    const element = getByAriaLabel('video :)');
    Simulate.focus(element);

    expect(queryByAriaLabel('More')).not.toBeInTheDocument();
  });
});
