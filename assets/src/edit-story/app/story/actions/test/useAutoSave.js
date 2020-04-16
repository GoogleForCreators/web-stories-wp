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
import { fireEvent, render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import APIContext from '../../../api/context';
import ConfigContext from '../../../config/context';
import useAutoSave from '../useAutoSave';
import getStoryMarkup from '../../../../utils/getStoryMarkup';

jest.mock('../../../../utils/getStoryMarkup', () => jest.fn());

function setup(args) {
  let result = {};
  function TestButton() {
    result = Object.assign(result, useAutoSave(args));
    return (
      <button
        onClick={() => {
          result.autoSave();
        }}
      >
        {'AutoSave'}
      </button>
    );
  }
  const configValue = {
    metadata: 'meta',
  };
  const autoSaveById = jest.fn();
  const apiContextValue = {
    actions: { autoSaveById },
  };
  const { getByText } = render(
    <ConfigContext.Provider value={configValue}>
      <APIContext.Provider value={apiContextValue}>
        <TestButton />
      </APIContext.Provider>
    </ConfigContext.Provider>
  );
  return {
    autoSaveById,
    getByText,
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
      author: 1,
      slug: 'story',
      publisherLogo: 1,
      defaultPageDuration: 7,
      status: 'publish',
      date: '2020-04-10T07:06:26',
      modified: '',
      excerpt: '',
      featuredMedia: 0,
      password: '',
      stylePresets: '',
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
    const { autoSaveById, getByText } = setup({
      storyId: 1,
      story,
      pages,
    });

    autoSaveById.mockImplementation(() => ({
      finally(callback) {
        callback();
      },
    }));

    const button = getByText('AutoSave');
    fireEvent.click(button);
    expect(autoSaveById).toHaveBeenCalledTimes(1);

    const expected = {
      ...story,
      pages,
      content: 'Hello World!',
    };
    expect(autoSaveById).toHaveBeenCalledWith(expected);
  });
});
