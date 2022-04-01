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
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import useIsUploadingToStory from '../../../../utils/useIsUploadingToStory';
import ConfigContext from '../../../../app/config/context';
import {
  CheckpointContext,
  ChecklistCountProvider,
  PPC_CHECKPOINT_STATE,
} from '../../../checklist';
import PublishButton from '../publish';

jest.mock('../../../../utils/useIsUploadingToStory');

function arrange({
  props: extraButtonProps,
  story: extraStoryProps,
  storyState: extraStoryStateProps,
  meta: extraMetaProps,
  media: extraMediaProps,
  config: extraConfigProps,
  checklist: extraChecklistProps,
} = {}) {
  const saveStory = jest.fn();
  const onPublishDialogChecklistRequest = jest.fn();
  const showPriorityIssues = jest.fn();

  useIsUploadingToStory.mockImplementation(() => extraMediaProps?.isUploading);

  const storyContextValue = {
    state: {
      capabilities: {
        publish: true,
      },
      meta: { isSaving: false, isFreshlyPublished: false, ...extraMetaProps },
      story: {
        title: 'Example Story',
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
    actions: { saveStory },
  };
  const configValue = {
    allowedMimeTypes: {},
    capabilities: {},
    metadata: {
      publisher: 'publisher title',
    },
    ...extraConfigProps,
  };
  const prepublishChecklistContextValue = {
    state: {
      checkpoint: PPC_CHECKPOINT_STATE.UNAVAILABLE,
      ...extraChecklistProps,
    },
    actions: {
      showPriorityIssues,
      onPublishDialogChecklistRequest,
    },
  };
  renderWithTheme(
    <ConfigContext.Provider value={configValue}>
      <StoryContext.Provider value={storyContextValue}>
        <ChecklistCountProvider hasChecklist>
          <CheckpointContext.Provider value={prepublishChecklistContextValue}>
            <PublishButton {...extraButtonProps} />
          </CheckpointContext.Provider>
        </ChecklistCountProvider>
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );
  return {
    saveStory,
    showPriorityIssues,
  };
}

describe('PublishButton', () => {
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

  it('should be able to publish', () => {
    const { saveStory, showPriorityIssues } = arrange();

    const publishButton = screen.getByRole('button', { name: 'Publish' });
    expect(publishButton).toBeEnabled();
    fireEvent.click(publishButton);

    expect(showPriorityIssues).toHaveBeenCalledTimes(1);

    const publishModal = screen.getByRole('dialog');

    const publishModalButton = within(publishModal).getByRole('button', {
      name: 'Publish',
    });
    fireEvent.click(publishModalButton);

    expect(saveStory).toHaveBeenCalledWith({
      status: 'publish',
    });
  });

  it('should be able to submit for review if lacking capabilities', () => {
    const { saveStory } = arrange({
      storyState: {
        capabilities: {
          publish: false,
        },
      },
    });

    const publishButton = screen.getByRole('button', {
      name: 'Submit for review',
    });
    expect(publishButton).toBeEnabled();
    fireEvent.click(publishButton);

    const publishModal = screen.getByRole('dialog');

    const publishModalButton = within(publishModal).getByRole('button', {
      name: 'Submit for review',
    });
    fireEvent.click(publishModalButton);

    expect(saveStory).toHaveBeenCalledWith({
      status: 'pending',
    });
  });

  it('should disable button while upload is in progress', () => {
    arrange({ media: { isUploading: true } });
    expect(screen.getByRole('button', { name: 'Publish' })).toBeDisabled();
  });

  it('should allow forcing isSaving state', () => {
    arrange({
      props: { forceIsSaving: true },
    });

    const publishButton = screen.getByRole('button', { name: 'Publish' });
    expect(publishButton).toBeDisabled();
  });

  it('should update window location when publishing', () => {
    const { saveStory } = arrange({
      story: { title: 'Some title' },
    });
    const publishButton = screen.getByRole('button', { name: 'Publish' });

    fireEvent.click(publishButton);
    const publishModal = screen.getByRole('dialog');

    const publishModalButton = within(publishModal).getByRole('button', {
      name: 'Publish',
    });
    fireEvent.click(publishModalButton);

    expect(saveStory).toHaveBeenCalledTimes(1);
    expect(window.location.href).toContain('post=123&action=edit');
  });
});
