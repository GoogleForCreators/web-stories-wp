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
import useIsUploadingToStory from '../../../../utils/useIsUploadingToStory';
import { CheckpointContext } from '../../../checklist';
import SwitchToDraftButton from '../switchToDraft';

jest.mock('../../../../utils/useIsUploadingToStory');

function arrange({
  props: extraButtonProps,
  story: extraStoryProps,
  storyState: extraStoryStateProps,
  meta: extraMetaProps,
  media: extraMediaProps,
  checklist: extraChecklistProps,
} = {}) {
  const saveStory = jest.fn();

  useIsUploadingToStory.mockImplementation(() => extraMediaProps?.isUploading);

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

  const prepublishChecklistContextValue = {
    state: {
      hasHighPriorityIssues: false,
      ...extraChecklistProps,
    },
  };
  renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <CheckpointContext.Provider value={prepublishChecklistContextValue}>
        <SwitchToDraftButton {...extraButtonProps} />
      </CheckpointContext.Provider>
    </StoryContext.Provider>
  );
  return {
    saveStory,
  };
}

describe('SwitchToDraftButton', () => {
  it('should allow switching state to draft', () => {
    const { saveStory } = arrange();

    const updateButton = screen.getByRole('button', {
      name: 'Switch to Draft',
    });
    expect(updateButton).toBeEnabled();
    fireEvent.click(updateButton);

    expect(saveStory).toHaveBeenCalledWith({
      status: 'draft',
    });
  });

  it('should allow forcing isSaving state', () => {
    arrange({
      props: { forceIsSaving: true },
    });

    const updateButton = screen.getByRole('button', {
      name: 'Switch to Draft',
    });
    expect(updateButton).toBeDisabled();
  });

  it('should disable button while upload is in progress', () => {
    arrange({ media: { isUploading: true } });
    expect(
      screen.getByRole('button', { name: 'Switch to Draft' })
    ).toBeDisabled();
  });
});
