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
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import MediaContext from '../../../../app/media/context';
import PreviewButton from '../preview';

function arrange({
  props: extraButtonProps,
  story: extraStoryProps,
  storyState: extraStoryStateProps,
  meta: extraMetaProps,
  media: extraMediaProps,
} = {}) {
  const saveStory = jest.fn();
  const autoSave = jest.fn();

  const storyContextValue = {
    state: {
      capabilities: {
        publish: true,
      },
      meta: { isSaving: false, isFreshlyPublished: false, ...extraMetaProps },
      story: {
        status: 'draft',
        storyId: 123,
        date: null,
        editLink: 'http://localhost/wp-admin/post.php?post=123&action=edit',
        embedPostLink:
          'https://example.com/wp-admin/post-new.php?from-web-story=123',
        previewLink:
          'http://localhost?preview_id=1679&preview_nonce=b5ea827939&preview=true',
        ...extraStoryProps,
      },
      ...extraStoryStateProps,
    },
    actions: { saveStory, autoSave },
  };
  const mediaContextValue = {
    local: {
      state: { ...extraMediaProps },
    },
  };

  renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <MediaContext.Provider value={mediaContextValue}>
        <PreviewButton {...extraButtonProps} />
      </MediaContext.Provider>
    </StoryContext.Provider>
  );
  return {
    saveStory,
    autoSave,
  };
}

describe('PreviewButton', () => {
  let previewPopup;

  beforeEach(() => {
    previewPopup = {
      document: {
        write: jest.fn(),
      },
      location: {
        href: 'about:blank',
        replace: jest.fn(),
      },
    };
  });

  it('should open draft preview when clicking on Preview via about:blank', () => {
    const { saveStory } = arrange({
      story: {
        previewLink: 'http://localhost/?preview=true',
      },
    });
    const previewButton = screen.getByRole('button', { name: 'Preview' });

    expect(previewButton).toBeInTheDocument();

    saveStory.mockImplementation(() => ({
      then(callback) {
        callback();
        return {
          catch: () => {},
        };
      },
    }));

    const mockedOpen = jest.fn(() => previewPopup);
    const windowSpy = jest.spyOn(window, 'open').mockImplementation(mockedOpen);

    fireEvent.click(previewButton);

    expect(saveStory).toHaveBeenCalledWith();
    expect(mockedOpen).toHaveBeenCalledWith('about:blank', 'story-preview');
    expect(previewPopup.location.replace).toHaveBeenCalledWith(
      'http://localhost/?preview=true#development=1'
    );

    windowSpy.mockRestore();
  });

  it('should open preview for a published story when clicking on Preview via about:blank', () => {
    const { autoSave } = arrange({
      story: {
        link: 'http://localhost',
        status: 'publish',
      },
    });
    const previewButton = screen.getByRole('button', { name: 'Preview' });
    autoSave.mockImplementation(() => ({
      then(callback) {
        callback();
        return {
          catch: () => {},
        };
      },
    }));

    const mockedOpen = jest.fn(() => previewPopup);
    const windowSpy = jest.spyOn(window, 'open').mockImplementation(mockedOpen);

    fireEvent.click(previewButton);

    expect(autoSave).toHaveBeenCalledWith();
    expect(previewPopup.location.replace).toHaveBeenCalledWith(
      'http://localhost/?preview_id=1679&preview_nonce=b5ea827939&preview=true#development=1'
    );

    windowSpy.mockRestore();
  });
});
