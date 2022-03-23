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
import MockDate from 'mockdate';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import MediaContext from '../../../../app/media/context';
import HistoryContext from '../../../../app/history/context';
import UpdateButton from '../update';

function arrange({
  props: extraButtonProps,
  story: extraStoryProps,
  storyState: extraStoryStateProps,
  meta: extraMetaProps,
  media: extraMediaProps,
  history: extraHistoryProps,
} = {}) {
  const saveStory = jest.fn();

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
    actions: { saveStory },
  };
  const mediaContextValue = {
    local: {
      state: { ...extraMediaProps },
    },
  };
  const historyContextValue = {
    state: { ...extraHistoryProps },
  };

  renderWithTheme(
    <HistoryContext.Provider value={historyContextValue}>
      <StoryContext.Provider value={storyContextValue}>
        <MediaContext.Provider value={mediaContextValue}>
          <UpdateButton {...extraButtonProps} />
        </MediaContext.Provider>
      </StoryContext.Provider>
    </HistoryContext.Provider>
  );
  return {
    saveStory,
  };
}

describe('UpdateButton', () => {
  const FUTURE_DATE = '2022-01-01T20:20:20Z';

  beforeAll(() => {
    MockDate.set('2020-07-15T12:00:00+00:00');
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should display Save button if status is not yet available', () => {
    arrange({
      story: { status: undefined },
    });

    expect(
      screen.getByRole('button', { name: 'Save draft' })
    ).toBeInTheDocument();
  });

  it('should not be able to save draft if there are no changes', () => {
    const { saveStory } = arrange();

    const updateButton = screen.getByRole('button', { name: 'Save draft' });
    expect(updateButton).toBeDisabled();
    fireEvent.click(updateButton);

    expect(saveStory).not.toHaveBeenCalled();
  });

  it('should be able to save draft if there are changes', () => {
    const { saveStory } = arrange({
      history: { hasNewChanges: true },
    });

    const updateButton = screen.getByRole('button', { name: 'Save draft' });
    expect(updateButton).toBeEnabled();
    fireEvent.click(updateButton);

    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should be able to save a published story if there are changes', () => {
    const { saveStory } = arrange({
      history: { hasNewChanges: true },
      story: { status: 'publish' },
    });

    const updateButton = screen.getByRole('button', { name: 'Update' });
    expect(updateButton).toBeEnabled();
    fireEvent.click(updateButton);

    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should not be able to save if there are no new changes', () => {
    arrange({
      history: { hasNewChanges: false },
      story: { status: 'publish' },
    });

    const updateButton = screen.getByRole('button', { name: 'Update' });
    expect(updateButton).toBeDisabled();
  });

  it('should allow forcing isSaving state', () => {
    arrange({
      history: { hasNewChanges: true },
      props: { forceIsSaving: true },
    });

    const updateButton = screen.getByRole('button', { name: 'Save draft' });
    expect(updateButton).toBeDisabled();
  });

  it('should allow forcing having updates', () => {
    arrange({
      history: { hasNewChanges: false },
      props: { hasUpdates: true },
    });

    const updateButton = screen.getByRole('button', { name: 'Save draft' });
    expect(updateButton).toBeEnabled();
  });

  it('should save pending story', () => {
    const { saveStory } = arrange({
      history: { hasNewChanges: true },
      story: { status: 'pending' },
    });

    const updateButton = screen.getByRole('button', {
      name: 'Save as pending',
    });
    expect(updateButton).toBeEnabled();

    fireEvent.click(updateButton);

    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should be able to save a post if has changes and already published', () => {
    const { saveStory } = arrange({
      history: { hasNewChanges: true },
      story: { status: 'publish' },
    });

    const updateButton = screen.getByRole('button', { name: 'Update' });
    expect(updateButton).toBeEnabled();
    fireEvent.click(updateButton);

    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should disable button while upload is in progress', () => {
    arrange({ media: { isUploading: true } });
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled();
  });

  it('should change label for published stories with future date', () => {
    const { saveStory } = arrange({
      story: {
        title: 'Some title',
        status: 'publish',
        date: FUTURE_DATE,
      },
      history: {
        hasNewChanges: true,
      },
    });
    const scheduleButton = screen.getByRole('button', { name: 'Schedule' });

    expect(scheduleButton).toBeInTheDocument();
    fireEvent.click(scheduleButton);
    expect(scheduleButton).toBeEnabled();
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should not change label for private stories with future date', () => {
    const { saveStory } = arrange({
      story: {
        title: 'Some title',
        status: 'private',
        date: FUTURE_DATE,
      },
      history: {
        hasNewChanges: true,
      },
    });
    const updateButton = screen.getByRole('button', { name: 'Update' });
    const scheduleButton = screen.queryByRole('button', { name: 'Schedule' });

    expect(scheduleButton).not.toBeInTheDocument();
    expect(updateButton).toBeInTheDocument();
    fireEvent.click(updateButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should save post via shortcut', () => {
    const { saveStory } = arrange({
      story: { title: 'Some title' },
    });

    fireEvent.keyDown(document.body, {
      key: 'S',
      which: 83,
      ctrlKey: true,
    });

    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should not save post via shortcut if already saving', () => {
    const { saveStory } = arrange({
      story: { title: 'Some title' },
      meta: { isSaving: true },
    });

    fireEvent.keyDown(document.body, {
      key: 'S',
      which: 83,
      ctrlKey: true,
    });

    expect(saveStory).not.toHaveBeenCalled();
  });
});
