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
import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { setAppElement } from '@web-stories-wp/design-system';
import MockDate from 'mockdate';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import StoryContext from '../../../app/story/context';
import ConfigContext from '../../../app/config/context';
import MediaContext from '../../../app/media/context';
import HistoryContext from '../../../app/history/context';
import { renderWithTheme } from '../../../testUtils';
import { StoryTriggersProvider } from '../../../app/story/storyTriggers';
import { CheckpointContext } from '../../checklist';
import { useStory } from '../../../app';
import {
  PreviewButton,
  PublishButton,
  SwitchToDraftButton,
  UpdateButton,
} from '../buttons';
import { CircularProgress } from '../../..';

function Loading() {
  const { isSaving } = useStory((state) => ({
    isSaving: state.state.meta.isSaving,
  }));

  return (
    isSaving && (
      <div>
        <CircularProgress size={32} />
      </div>
    )
  );
}

const Buttons = () => {
  const { status } = useStory(
    ({
      state: {
        story: { status, embedPostLink, link },
        meta: { isFreshlyPublished },
      },
    }) => ({
      status,
      embedPostLink,
      link,
      isFreshlyPublished,
    })
  );

  const isDraft = 'draft' === status;

  return (
    <div>
      <div>
        <PreviewButton />
        <Loading />
      </div>
      {isDraft ? <UpdateButton /> : <SwitchToDraftButton />}
      {isDraft && <PublishButton />}
      {!isDraft && <UpdateButton />}
    </div>
  );
};

function setupButtons({
  story: extraStoryProps,
  storyState: extraStoryStateProps,
  meta: extraMetaProps,
  media: extraMediaProps,
  config: extraConfigProps,
  history: extraHistoryProps,
  checklist: extraChecklistProps,
} = {}) {
  const saveStory = jest.fn();
  const autoSave = jest.fn();
  const focusChecklistTab = jest.fn();
  const onReviewDialogRequest = jest.fn();

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
  const configValue = {
    ...extraConfigProps,
  };
  const mediaContextValue = {
    local: {
      state: { ...extraMediaProps },
    },
  };
  const historyContextValue = {
    state: { ...extraHistoryProps },
  };

  const prepublishChecklistContextValue = {
    state: {
      shouldReviewDialogBeSeen: false,
      ...extraChecklistProps,
    },
    actions: {
      onReviewDialogRequest,
    },
  };
  renderWithTheme(
    <HistoryContext.Provider value={historyContextValue}>
      <ConfigContext.Provider value={configValue}>
        <FlagsProvider>
          <StoryContext.Provider value={storyContextValue}>
            <StoryTriggersProvider story={storyContextValue}>
              <CheckpointContext.Provider
                value={prepublishChecklistContextValue}
              >
                <MediaContext.Provider value={mediaContextValue}>
                  <Buttons />
                </MediaContext.Provider>
              </CheckpointContext.Provider>
            </StoryTriggersProvider>
          </StoryContext.Provider>
        </FlagsProvider>
      </ConfigContext.Provider>
    </HistoryContext.Provider>
  );
  return {
    autoSave,
    saveStory,
    focusChecklistTab,
  };
}

describe('buttons', () => {
  const FUTURE_DATE = '2022-01-01T20:20:20Z';
  let previewPopup;
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
  });

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

  it('should display Publish button when in draft mode', () => {
    setupButtons();
    const publishButton = screen.getByRole('button', { name: 'Publish' });
    expect(publishButton).toBeInTheDocument();
  });

  it('should not be able to save draft if no changes', () => {
    const { saveStory } = setupButtons();

    const saveDraftButton = screen.getByRole('button', { name: 'Save draft' });
    expect(saveDraftButton).toBeDisabled();
    fireEvent.click(saveDraftButton);

    expect(saveStory).not.toHaveBeenCalled();
  });

  it('should be able to save draft if changes', () => {
    const { saveStory } = setupButtons({
      history: { hasNewChanges: true },
    });

    const saveDraftButton = screen.getByRole('button', { name: 'Save draft' });
    expect(saveDraftButton).toBeEnabled();
    fireEvent.click(saveDraftButton);

    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should be able to save a post if has changes and already published', () => {
    const { saveStory } = setupButtons({
      history: { hasNewChanges: true },
      story: { status: 'publish' },
    });

    const updateButton = screen.getByRole('button', { name: 'Update' });
    expect(updateButton).toBeEnabled();
    fireEvent.click(updateButton);

    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should update window location when publishing', () => {
    const { saveStory } = setupButtons({
      story: { title: 'Some title' },
    });
    const publishButton = screen.getByRole('button', { name: 'Publish' });

    fireEvent.click(publishButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
    expect(window.location.href).toContain('post=123&action=edit');
  });

  it('should save post via shortcut', () => {
    const { saveStory } = setupButtons({
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
    const { saveStory } = setupButtons({
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

  it('should display Switch to draft button when published', () => {
    const { saveStory } = setupButtons({
      story: { status: 'publish' },
    });
    const draftButton = screen.getByRole('button', { name: 'Switch to Draft' });

    expect(draftButton).toBeInTheDocument();
    fireEvent.click(draftButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should display Schedule button when future date is set', () => {
    const { saveStory } = setupButtons({
      story: {
        title: 'Some title',
        status: 'draft',
        date: FUTURE_DATE,
      },
    });
    const scheduleButton = screen.getByRole('button', { name: 'Schedule' });

    expect(scheduleButton).toBeInTheDocument();
    fireEvent.click(scheduleButton);
    expect(saveStory).toHaveBeenCalledTimes(1);
  });

  it('should only save a story without a title if confirmed', async () => {
    const { saveStory } = setupButtons({
      story: {
        title: '',
        status: 'draft',
      },
      checklist: {
        shouldReviewDialogBeSeen: true,
      },
    });
    const publishButton = screen.getByRole('button', { name: 'Publish' });
    expect(publishButton).toBeInTheDocument();
    fireEvent.click(publishButton);

    const publishAnywayButton = await screen.findByRole('button', {
      name: 'Continue to publish',
    });
    expect(publishAnywayButton).toBeInTheDocument();
    fireEvent.click(publishAnywayButton);

    expect(saveStory).toHaveBeenCalledTimes(1);

    await waitForElementToBeRemoved(() =>
      screen.getByRole('button', { name: 'Continue to publish' })
    );
  });

  it('should not save a story without a title if opting to add a title', async () => {
    const { saveStory } = setupButtons({
      story: {
        title: '',
        status: 'draft',
      },
      checklist: {
        shouldReviewDialogBeSeen: true,
      },
    });
    const publishButton = screen.getByRole('button', { name: 'Publish' });
    expect(publishButton).toBeInTheDocument();
    fireEvent.click(publishButton);

    const reviewChecklistButton = screen.getByRole('button', {
      name: /^Review Checklist/,
    });
    expect(reviewChecklistButton).toBeInTheDocument();
    fireEvent.click(reviewChecklistButton);

    expect(saveStory).not.toHaveBeenCalled();

    await waitForElementToBeRemoved(() =>
      screen.getByRole('button', { name: /^Review Checklist/ })
    );
  });

  it('should display Schedule button with future status', () => {
    setupButtons({
      story: {
        status: 'future',
        date: FUTURE_DATE,
      },
    });
    const scheduleButton = screen.getByRole('button', { name: 'Schedule' });

    expect(scheduleButton).toBeInTheDocument();
  });

  it('should display loading indicator while the story is updating', () => {
    setupButtons({ meta: { isSaving: true } });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Preview' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('should disable buttons while upload is in progress', () => {
    setupButtons({ media: { isUploading: true } });
    expect(screen.getByRole('button', { name: 'Save draft' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Preview' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('should disable publish button when user lacks permission', () => {
    setupButtons({
      storyState: { capabilities: { publish: false } },
    });
    expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('should open draft preview when clicking on Preview via about:blank', () => {
    const { saveStory } = setupButtons({
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
    const windowSpy = jest.spyOn(global, 'open').mockImplementation(mockedOpen);

    fireEvent.click(previewButton);

    expect(saveStory).toHaveBeenCalledWith();
    expect(mockedOpen).toHaveBeenCalledWith('about:blank', 'story-preview');
    expect(previewPopup.location.replace).toHaveBeenCalledWith(
      'http://localhost/?preview=true#development=1'
    );

    windowSpy.mockRestore();
  });

  it('should open preview for a published story when clicking on Preview via about:blank', () => {
    const { autoSave } = setupButtons({
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
    const windowSpy = jest.spyOn(global, 'open').mockImplementation(mockedOpen);

    fireEvent.click(previewButton);

    expect(autoSave).toHaveBeenCalledWith();
    expect(previewPopup.location.replace).toHaveBeenCalledWith(
      'http://localhost/?preview_id=1679&preview_nonce=b5ea827939&preview=true#development=1'
    );

    windowSpy.mockRestore();
  });
});
