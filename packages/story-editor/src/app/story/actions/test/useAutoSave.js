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
import { renderHook, act } from '@testing-library/react-hooks';
import { getStoryMarkup } from '@googleforcreators/output';

/**
 * Internal dependencies
 */
import APIContext from '../../../api/context';
import ConfigContext from '../../../config/context';
import useAutoSave from '../useAutoSave';

jest.mock('@googleforcreators/output', () => ({
  getStoryMarkup: jest.fn(),
}));

function setup(args) {
  const configValue = {
    metadata: 'meta',
  };
  const autoSaveById = jest.fn();
  const apiContextValue = {
    actions: { autoSaveById },
  };
  const wrapper = ({ children }) => (
    <ConfigContext.Provider value={configValue}>
      <APIContext.Provider value={apiContextValue}>
        {children}
      </APIContext.Provider>
    </ConfigContext.Provider>
  );
  const { result } = renderHook(() => useAutoSave(args), { wrapper });
  return {
    autoSave: result.current.autoSave,
    autoSaveById,
  };
}

describe('useAutoSave', () => {
  it('should properly call autoSaveById when using autoSave', () => {
    getStoryMarkup.mockImplementation(() => {
      return 'Hello World!';
    });
    const story = {
      storyId: 1,
      title: 'Story!',
      author: { id: 1, name: 'John Doe' },
      slug: 'story',
      publisherLogo: {
        id: 1,
        url: 'https://example.com/logo.png',
        height: 0,
        width: 0,
      },
      defaultPageDuration: 7,
      status: 'publish',
      date: '2020-04-10T07:06:26',
      modified: '',
      excerpt: '',
      featuredMedia: {
        id: 0,
        url: 'https://example.com/image.png',
        isExternal: false,
        height: 100,
        width: 100,
      },
      password: '',
      globalStoryStyles: '',
      taxonomies: [],
    };
    const pages = [
      {
        type: 'page',
        id: '2',
        elements: [
          {
            id: '2',
            type: 'text',
            x: 0,
            y: 0,
          },
        ],
      },
    ];
    const { autoSave, autoSaveById } = setup({
      storyId: 1,
      story,
      pages,
    });

    autoSaveById.mockImplementation(() => ({
      finally(callback) {
        callback();
      },
    }));

    act(() => {
      autoSave();
    });
    expect(autoSaveById).toHaveBeenCalledTimes(1);

    const expected = {
      ...story,
      pages,
      content: 'Hello World!',
      meta: {
        web_stories_poster: undefined,
        web_stories_publisher_logo: 1,
        web_stories_products: [],
      },
    };
    delete expected.publisherLogo;
    delete expected.taxonomies;
    expect(autoSaveById).toHaveBeenCalledWith(expected);
  });

  it('should properly call autoSaveById when using autoSave with custom poster', () => {
    getStoryMarkup.mockImplementation(() => {
      return 'Hello World!';
    });
    const story = {
      storyId: 1,
      title: 'Story!',
      author: { id: 1, name: 'John Doe' },
      slug: 'story',
      publisherLogo: {
        id: 1,
        url: 'https://example.com/logo.png',
        height: 0,
        width: 0,
      },
      defaultPageDuration: 7,
      status: 'publish',
      date: '2020-04-10T07:06:26',
      modified: '',
      excerpt: '',
      featuredMedia: {
        id: 0,
        url: 'https://example.com/image.png',
        isExternal: true,
        height: 100,
        width: 100,
      },
      password: '',
      globalStoryStyles: '',
      taxonomies: [],
    };
    const pages = [
      {
        type: 'page',
        id: '2',
        elements: [
          {
            id: '2',
            type: 'text',
            x: 0,
            y: 0,
          },
        ],
      },
    ];
    const { autoSave, autoSaveById } = setup({
      storyId: 1,
      story,
      pages,
    });

    autoSaveById.mockImplementation(() => ({
      finally(callback) {
        callback();
      },
    }));

    act(() => {
      autoSave();
    });
    expect(autoSaveById).toHaveBeenCalledTimes(1);

    const expected = {
      ...story,
      pages,
      content: 'Hello World!',
      meta: {
        web_stories_poster: {
          height: 100,
          url: 'https://example.com/image.png',
          width: 100,
        },
        web_stories_publisher_logo: 1,
        web_stories_products: [],
      },
    };
    delete expected.publisherLogo;
    delete expected.taxonomies;
    expect(autoSaveById).toHaveBeenCalledWith(expected);
  });
});
