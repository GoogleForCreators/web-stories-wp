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
import { fireEvent, screen, within } from '@testing-library/react';
import MockDate from 'mockdate';
import { setAppElement } from '@googleforcreators/design-system';
import {
  StoryContext,
  CheckpointContext,
  ChecklistCountProvider,
  ConfigContext,
} from '@googleforcreators/story-editor';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import MetaBoxesContext from '../../../metaBoxes/context';
import Buttons from '..';

const newPoster = {
  id: 'new-poster',
  src: 'new-poster-url',
  height: '36px',
  width: '100000px',
};

function arrange({
  story: extraStoryProps,
  storyState: extraStoryStateProps,
  meta: extraMetaProps,
  metaBoxes: extraMetaBoxesProps,
  config: extraConfigProps,
} = {}) {
  const saveStory = jest.fn();
  const autoSave = jest.fn();
  const focusChecklistTab = jest.fn();

  const storyContextValue = {
    state: {
      capabilities: {
        publish: true,
      },
      meta: { isSaving: false, isFreshlyPublished: false, ...extraMetaProps },
      story: {
        status: 'draft',
        title: '',
        excerpt: '',
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
  const metaBoxesValue = {
    state: {
      hasMetaBoxes: false,
      isSavingMetaBoxes: false,
      ...extraMetaBoxesProps,
    },
  };
  const configValue = {
    allowedMimeTypes: {},
    capabilities: {},
    metadata: {
      publisher: 'publisher title',
    },
    MediaUpload: ({ onSelect }) => (
      <button
        data-testid="media-upload-button"
        onClick={() => onSelect(newPoster)}
      >
        {'Media Upload Button!'}
      </button>
    ),
    ...extraConfigProps,
  };

  renderWithTheme(
    <MetaBoxesContext.Provider value={metaBoxesValue}>
      <ConfigContext.Provider value={configValue}>
        <StoryContext.Provider value={storyContextValue}>
          <ChecklistCountProvider>
            <CheckpointContext.Provider
              value={{
                actions: {
                  showPriorityIssues: () => {},
                },
                state: { hasHighPriorityIssues: false, checkpoint: 'all' },
              }}
            >
              <Buttons />
            </CheckpointContext.Provider>
          </ChecklistCountProvider>
        </StoryContext.Provider>
      </ConfigContext.Provider>
    </MetaBoxesContext.Provider>
  );
  return {
    autoSave,
    saveStory,
    focusChecklistTab,
  };
}

describe('Buttons', () => {
  const FUTURE_DATE = '2022-01-01T20:20:20Z';
  let modalWrapper;

  beforeAll(() => {
    modalWrapper = document.createElement('aside');
    document.documentElement.appendChild(modalWrapper);
    setAppElement(modalWrapper);
    MockDate.set('2020-07-15T12:00:00+00:00');
  });

  afterAll(() => {
    document.documentElement.removeChild(modalWrapper);
    MockDate.reset();
    jest.clearAllMocks();
  });

  it('should always display history and preview buttons', () => {
    arrange();
    expect(
      screen.getByRole('button', { name: 'Undo Changes' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Redo Changes' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument();
  });

  it('should display Publish button for draft stories', () => {
    arrange();
    expect(
      screen.getByRole('button', { name: 'Save draft' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument();
  });

  it('should display Update button for published stories', () => {
    arrange({
      story: { status: 'publish' },
    });
    expect(
      screen.getByRole('button', { name: 'Switch to Draft' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
  });

  it('should display Submit for Review button for draft stories if lacking capabilities', () => {
    arrange({
      storyState: { capabilities: { publish: false } },
    });
    expect(
      screen.getByRole('button', { name: 'Save draft' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Submit for review' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();
  });

  it('should display three buttons for pending stories', () => {
    arrange({
      story: { status: 'pending' },
    });
    expect(
      screen.getByRole('button', { name: 'Switch to Draft' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Save as pending' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument();
  });

  it('should display two buttons for pending stories if lacking capabilities', () => {
    arrange({
      story: { status: 'pending' },
      storyState: { capabilities: { publish: false } },
    });
    expect(
      screen.getByRole('button', { name: 'Switch to Draft' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Submit for review' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();
  });

  it('should display Switch to draft button when published', () => {
    const { saveStory } = arrange({
      story: { status: 'publish' },
    });
    const draftButton = screen.getByRole('button', { name: 'Switch to Draft' });

    fireEvent.click(draftButton);
    expect(saveStory).toHaveBeenCalledOnce();
  });

  it('should display Schedule button when future date is set', () => {
    const { saveStory } = arrange({
      story: {
        title: 'Some title',
        status: 'draft',
        date: FUTURE_DATE,
      },
    });
    const scheduleButton = screen.getByRole('button', { name: 'Schedule' });

    fireEvent.click(scheduleButton);
    expect(saveStory).not.toHaveBeenCalled();

    const publishModal = screen.getByRole('dialog');

    const publishModalButton = within(publishModal).getByRole('button', {
      name: 'Schedule',
    });

    fireEvent.click(publishModalButton);
    expect(saveStory).toHaveBeenCalledOnce();
  });

  it('should display Schedule button with future status', () => {
    arrange({
      story: {
        status: 'future',
        date: FUTURE_DATE,
      },
    });
    expect(
      screen.getByRole('button', { name: 'Schedule' })
    ).toBeInTheDocument();
  });

  it('should display loading indicator while the story is updating', () => {
    arrange({ meta: { isSaving: true } });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save draft' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Preview' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Publish' })).toBeDisabled();
  });
});
